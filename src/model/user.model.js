import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    accessToken:{
        type:String,
    },
    refreshToken:{
        type:String,
    },
    codeVerifier:{
        type:String,
    },
    state:{
        type:String,
    },
    expiresIn:{
        type:Number
    },
    tweets:{
        type:[String],
        default: []
    }
})
const User = mongoose.model("User",user_schema);
export default User