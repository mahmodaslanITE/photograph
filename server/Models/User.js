const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
})

userSchema.methods.generateToken = function () {
    return jwt.sign(
      {
        id: this._id,
        email:this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '70d' } // Token valid for 7 days
    );
  };
module.exports=mongoose.model('User',userSchema)