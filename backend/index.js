require( "dotenv" ).config()

const express = require( "express"  )
const session = require( "express-session" )
const cors = require( "cors" )
const mongoose = require( "mongoose" )
const { v4: uuidv4 } = require( "uuid" )

const app = express()
    app.use( cors() )

const sess = {
    secret: "Chicken Tenders",
    genid: ( req ) => uuidv4(),
    resave: true,
    saveUninitialized: true,
    cookie: {}
}

if ( app.get( 'env' ) === 'production' ) {
    app.set( 'trust proxy', 1 ) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use( session( sess ) )


//Authentication Checker
function Authenticated( req, res, next ) {
    if ( req.session.user ) next()
    else res.send( '0' )
}


//Public Routes
app.get( "/login", ( req, res ) => {
    res.send( "login in progress" )
} )

app.get( "/verify", ( req, res ) => {
    res.send( "verify in progress" )
} )

//Private Routes
app.get( "/my-games", Authenticated, ( req, res ) => {
    res.send( "my games in progress" )
} )

app.get( "/user-info", Authenticated, ( req, res ) => {
    res.send( "user info in progress" )
} )


mongoose.connect( process.env.mongooseurl || 'mongodb://127.0.0.1:27017' ).then( () => {
    app.listen( process.env.RestPort || 8080, () => {
        console.log( `Backend running on port: ${ process.env.RestPort || 8080 }` )
    } )
} )


