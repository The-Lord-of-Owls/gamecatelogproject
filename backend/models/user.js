const { Schema, model } = require( "mongoose" )

const UserScchema = new Schema( {
    userName: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
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


