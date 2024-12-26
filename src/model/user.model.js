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
    }
})
const User = mongoose.model("User",user_schema);
export default User