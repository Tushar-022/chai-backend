import mongoose,{Schema} from 'mongoose'


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

// this is used so that we can do things in current context only

    userSchema.pre("save",async function(next){
        //agar password modify hua toh hi vapis save krenge
        if(!this.isModified("password")) return next();

        this.password=await bcrypt.hash(this.password)
        next()

    })

    userSchema.methods.isPasswordCorrect=async function (password)
    {
        return await bcrypt.compare(password,this.password);

    }

    userSchema.methods.generateAcessToken=function()
    {
        jwt.sign({
            _id:this.id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName
        }),
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    }

    userSchema.methods.generateRefreshToken=function(){
        jwt.sign({
            _id:this.id
        }),
        process.env.REFRESH_ACCESS_TOKEN,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    }

 const User=mongoose.model('User',userSchema);
 export default {User}