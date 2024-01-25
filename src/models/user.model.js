import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new Schema({

    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,

    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshTokens:{
        type:String
    }

},{
   timestamps: true
}  )




   

    userSchema.pre("save", async function (next) {
        try {
            // this holds the instance of the above object created  so whenever password change hua then apn changes kr denge
            if (!this.isModified("password")) return next();
    
            this.password = await bcrypt.hash(this.password, 10);
            next();
        } catch (error) {
            return next(error);
        }
    });
    

    userSchema.methods.isPasswordCorrect=async function (password)
    {
        return await bcrypt.compare(password,this.password);

    }



    // In the context of user authentication, the payload typically contains information about the user.
    //  The payload is then signed using a secret key to generate a JWT.
    
    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }

    
    userSchema.methods.generateRefreshToken = function(){
        return jwt.sign(
            {
                _id: this._id,
                
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }

 
export const User = mongoose.model("User", userSchema)