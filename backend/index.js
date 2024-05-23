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
    cookie: {}
}

if ( app.get( 'env' ) === 'production' ) {
    app.set( 'trust proxy', 1 ) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use( session( sess ) )

//Public Routes
app.get( "/", ( req, res ) => {
    console.log( "We got a request for the home route" )
    res.send( "done" )
} )

//Private Routes

app.listen( process.env.RestPort || 8080, () => {
    console.log( `Backend running on port: ${ process.env.RestPort || 8080 }` )
} )


