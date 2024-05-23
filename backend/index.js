require( "dotenv" ).config()

const express = require( "express"  )
const session = require( "express-session" )
const cors = require( "cors" )
const jwt = require( "express-jwt" )
const jwksRsa = require( "jwks-rsa" )
const mongoose = require( "mongoose" )
const { v4: uuidv4 } = require( "uuid" )

//Express instance
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

const authConfig = {
    domain: process.env.Auth0Domain,
    audience: process.env.Auth0ClientId
}

const checkJwt = jwt( {
    secret: jwksRsa.expressJwtSecret( {
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${ process.env.Auth0Domain }/.well-known/jwks.json`
    } ),
    audience: process.env.Auth0ClientId,
    issuer: `https://${ process.env.Auth0Domain }/`,
    algorithms: [ 'RS256' ]
} )

app.use( session( sess ) )


//Authentication Checker
function Authenticated( req, res, next ) {
    if ( req.session.user ) next()
    else res.send( '0' )
}


//Mongoose Models
const { User } = require( "./models/user.js" )


//Public Routes
app.get( "/login", ( req, res ) => {
    res.send( "login in progress" )
} )

app.get( "/verify", ( req, res ) => {
    res.send( "verify in progress" )
} )


//Private Routes
app.get( "/my-games", checkJwt, async ( req, res ) => {
    User.findOne( { userid: req.session.user.userId } ).then( user => {
        res.json( user.myGames || [ "default" ] )
    } )
} )

app.get( "/user-info", checkJwt, ( req, res ) => {
    User.findOne( { userid: req.session.user.userId } ).then( user => {
        res.json( user || { default: true } )
    } )
} )


mongoose.connect( process.env.MongooseURL || 'mongodb://127.0.0.1:27017' ).then( () => {
    app.listen( process.env.RestPort || 8080, () => {
        console.log( `Backend running on port: ${ process.env.RestPort || 8080 }` )
    } )
} )


