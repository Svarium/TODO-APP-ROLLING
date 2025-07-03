import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique: true,
        trim: true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    verificationToken:{
        type:String,
        default:null
    },
    passwordResetToken:{
         type:String,
         default:null
    },
    passwordResetExpires:{
        type:Date,
        default:null
    },
}, {
    timestamps:true,
    versionKey:false
})


export default mongoose.model('User', userSchema);