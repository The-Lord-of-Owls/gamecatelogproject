require( "dotenv" ).config()

const express = require( "express"  )
const session = require( "express-session" )
const bodyParser = require( "body-parser" )
const bcrypt = require( "bcryptjs" )
const jwt = require( "jsonwebtoken" )
const cors = require( "cors" )
const mongoose = require( "mongoose" )
const { v4: uuidv4 } = require( "uuid" )

//Express instance
const app = express()
	app.use( bodyParser.json() )
    app.use( cors( {
		credentials: true
	} ) )
	if ( app.get( 'env' ) === 'production' )
		app.set( 'trust proxy', 1 )
	app.use( session( {
		secret: "Chicken Tenders",
		genid: ( req ) => uuidv4(),
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: ( app.get( 'env' ) === 'production' ) || false
		}
	} ) )


//Authentication Checker
function Authenticated( req, res, next ) {
    if ( req.session && req.session.user ) {
		next()
	} else {
		res.status( 401 ).send( { msg: "Not authenticated" } )
	}
}


//Mongoose Models
const { User } = require( "./models/user.js" )


//Public Routes
app.post( "/login", ( req, res ) => {
	const { email, password } = req.body;

	User.findOne( { email: email } ).then( user => {
		if ( !user ) {
			return res.status( 404 ).send( { msg: "User not found" } )
		}

		const passwordIsValid = bcrypt.compareSync( password, user.password )
		if ( !passwordIsValid ) {
			return res.status( 401 ).send( { msg: "Password is invalide" } )
		}

		const token = jwt.sign( { id: user.email }, "Chicken Tenders", { expiresIn: 86400} )
		req.session.user = {
			email: user.email,
			name: user.name,
			myGames: user.myGames
		}
		res.status( 200 ).send( { msg: "Login successful", user: req.session.user, token: token } )
	} )
} )

app.post( "/register", ( req, res ) => {
	console.log( req.body )
	const { email, password, confirmedPassword, name } = req.body;

	if ( password === confirmedPassword ) {
		return res.status( 401 ).send( { msg: "Password confirmation does not match" } )
	}
	
	const hashedPassword = bcrypt.hashSync( password, 8 )
	const newUser = new User( { name: name, email: email, password: hashedPassword } )
	newUser.save()

	res.status( 201 ).send( { msg: "User successfully registered" } )
} )

app.post( "/logout", ( req, res ) => {
	req.session.destroy( err => {
		if ( err ) {
			return res.status( 500 ).send( { msg: "Logout failed" } )
		}
		res.status( 200 ).send( { msg: "Logout successful" } )
	} )
} )


//Private Routes
app.get( "/my-games", Authenticated, async ( req, res ) => {
    User.findOne( { userid: req.session.user.userId } ).then( user => {
        res.json( user.myGames || [ "default" ] )
    } )
} )

app.get( "/user-info", Authenticated, ( req, res ) => {
    User.findOne( { userid: req.session.user.userId } ).then( user => {
        res.json( user || { default: true } )
    } )
} )

console.log( "Attempting to connect to MongoDB" )
mongoose.connect( process.env.MongooseURL || 'mongodb://127.0.0.1:27017' ).then( () => {
	console.log( "Successfully connected to MongoDB" )

	app.listen( process.env.RestPort || 8080, () => {
        console.log( `Backend running on port: ${ process.env.RestPort || 8080 }` )
		console.log( `Running in ${ app.get( 'env' ) } mode` )
    } )
} )


