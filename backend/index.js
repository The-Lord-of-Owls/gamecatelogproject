require( "dotenv" ).config()

const express = require( "express"  )
const axios = require( "axios" )
const session = require( "express-session" )
const bodyParser = require( "body-parser" )
const bcrypt = require( "bcryptjs" )
const jwt = require( "jsonwebtoken" )
const cors = require( "cors" )
const mongoose = require( "mongoose" )
const { createClient } = require( "redis" )

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

let redisEnabled = false
const redisClient = createClient()
	.on( 'error', err => console.error( err ) )
	


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
	User.findOne( { email: req.body.email } ).then( user => {
		if ( !user ) {
			return res.status( 404 ).send( { msg: "User not found" } )
		}

		const passwordIsValid = bcrypt.compareSync( req.body.password, user.password )
		if ( !passwordIsValid ) {
			return res.status( 401 ).send( { msg: "Password is invalide" } )
		}

		const token = jwt.sign( { id: user.email }, "Chicken Tenders", { expiresIn: 86400 } )
		req.session.user = {
			email: user.email,
			name: user.name,
			myGames: user.myGames
		}
		res.status( 200 ).send( { msg: "Login successful", user: req.session.user, token: token } )
	} )
} )

app.post( "/register", ( req, res ) => {
	const { email, password, confirmedPassword, name } = req.body

	if ( password === confirmedPassword ) {
		return res.status( 401 ).send( { msg: "Password confirmation does not match" } )
	}
	
	const hashedPassword = bcrypt.hashSync( password, 8 )
	const newUser = new User( { name: name, email: email, password: hashedPassword } )
	newUser.save()

	res.status( 201 ).send( { msg: "User successfully registered" } )
} )

app.post( "/logout", ( req, res ) => {
	if ( req.session.user.email === req.body.email ) {	//Sanity checking for logout
		req.session.destroy( err => {
			if ( err ) {
				return res.status( 500 ).send( { msg: "Logout failed" } )
			}
			res.status( 200 ).send( { msg: "Logout successful" } )
		} )
	} else {
		res.status( 401 ).send( { msg: "Email did not match the associated session user.email" } )
	}
} )



const giantBombURL = "https://www.giantbomb.com/api"
const apiKey = "53a931fb4f5b5e21e58d648276d55f1378019f5f"

//Note for self, this is a good place to implement Redis
app.get( "/game/:guid", async ( req, res ) => {
	if ( redisEnabled ) {
		const results = await redisClient.json.get( 'noderedis:jsondata', {
			path: [
				`$["${ req.params.guid }"]`
			]
		} )
	
		if ( results.length > 0 ) {
			return res.status( 200 ).send( results )
		}
	}

	axios.get( `${ giantBombURL }/game/${ req.params.guid }/?api_key=${ apiKey }&format=json` ).then( async data => {
		if ( redisEnabled ) {
			redisClient.json.set( 'noderedis:jsondata', `$["${ req.params.guid }"]`, {
				guid: data.data.results.guid,
				name: data.data.results.name,
				image: data.data.results.image
			} )
		}

		res.status( 200 ).send( data.data )
	} ).catch( err => console.error( err ) )
} )

const skipCache = false	//Temporarily disable due to needing to figure out an efficient and clean way to return the results
app.get( "/games/:limit&:offset", async ( req, res ) => {
	if ( redisEnabled && skipCache ) {
		const results = await redisClient.json.get( 'noderedis:jsondata', {
			path: [
				`$.guids`,
				'$.games'
			]
		} )

		if ( results.length > 0 ) {
			console.log( "using cache, results are greater than 1, and offset is not null", req.params.limit, req.params.offset )
			console.log( results )
			//const gameList = results[ '$.games' ][ 0 ].slice( req.params.offset, req.params.offset + req.params.limit )

			return res.status( 200 ).send( { results: gameList } )
		} else {
			console.log( "using cache, but needing to update it's contents", req.params.limit, req.params.offset )
			axios.get( `${ giantBombURL }/games/?api_key=${ apiKey }&format=json&limit=${ req.params.limit }&offset=${ req.params.offset }` ).then( data => {
				data.data.results.forEach( ( game, index ) => {
					const newGame = {
						guid: game.guid,
						name: game.name,
						image: game.image,
					}
					redisClient.json.set( 'noderedis:jsondata', `$.guids["${ game.guid }"]`, index )
					redisClient.json.set( 'noderedis:jsondata', `$.games[${ index }]`, newGame )
				} )

				res.status( 200 ).send( data.data )
			} ).catch( err => console.error( err ) )

			return
		}
	}

	axios.get( `${ giantBombURL }/games/?api_key=${ apiKey }&format=json&limit=${ req.params.limit }&offset=${ req.params.offset }` ).then( data => {
		res.status( 200 ).send( data.data )
	} ).catch( err => console.error( err ) )
} )



//Private Routes

//Get list of favorite games
app.get( "/my-games", Authenticated, async ( req, res ) => {
    res.status( 200 ).send( { msg: "Sending favorite games", myGames: req.session.user.myGames } )
} )

//Add a game to the myFavorites array
app.get( "/my-games/add/:guid", Authenticated, async ( req, res ) => {
	if ( req.session.user.myGames.includes( req.params.guid ) ) {
		return res.status( 401 ).send( { msg: "Game already exists in favorites" } )
	}

	req.session.user.myGames.push( req.params.guid )

	await User.updateOne( { email: req.session.user.email }, { myGames: req.session.user.myGames } )
	res.status( 200 ).send( { msg: "Game added successfully" } )
} )

//Remove a game from the myFavorites array
app.get( "/my-games/remove/:get", Authenticated, async ( req, res ) => {
	const index = req.session.user.myGames.indexOf( req.params.guid )
	if ( index <= -1 ) {
		return res.status( 404 ).send( { msg: "Game is not in favorites" } )
	}

	req.session.user.myGames.splice( index, 1 )

	await User.updateOne( { email: req.session.user.email }, { myGames: req.session.user.myGames } )
	res.status( 200 ).send( { msg: "Game was removed from favorites" } )
} )

//Send the user's info if authenticated
app.get( "/user-info", Authenticated, ( req, res ) => {
    res.status( 200 ).send( { msg: "Sending user info", user: req.session.user } )
} )



console.log( "Attempting to connect to MongoDB" )
mongoose.connect( process.env.MongooseURL || 'mongodb://127.0.0.1:27017' ).then( () => {
	console.log( "Successfully connected to MongoDB" )

	//Handle redis cache
	redisClient.connect().then( async () => {
		//Reset our cache
		await redisClient.del( 'noderedis:jsondata' )
		await redisClient.json.set( 'noderedis:jsondata', '$', {} )

		redisEnabled = true
		console.log( "Redis Cache: Enabled" )
	} )

	//Start express
	app.listen( process.env.RestPort || 8080, () => {
        console.log( `Backend running on port: ${ process.env.RestPort || 8080 }` )
		console.log( `Running in ${ app.get( 'env' ) } mode` )
    } )
} )


