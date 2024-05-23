const { Schema, model } = require( "mongoose" )

const UserScchema = new Schema( {
    username: {
        type: String,
        unique: true,
        required: true
    },
    userid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    myGames: {
        type: [String]
    }
} )

module.exports = {
    User: model( "Users", UserScchema )
}


