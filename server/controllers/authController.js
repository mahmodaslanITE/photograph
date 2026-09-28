const asyncHandler = require('express-async-handler');
const User = require('../Models/User');
const   bcrypt  = require('bcryptjs');
const jwt=require('jsonwebtoken')
/**
 * @description rigester user
 * @route Post /api/auth/register
 */
module.exports.registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name,email,password} = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(400).json({
          status: 'error',
          message: 'هذا البريد الإلكتروني مسجل بالفعل'
      });
  }
  if (!first_name || !last_name) {
    return res.status(400).json({ message: 'Please provide all required fields',status:'error' });
  }
  // Create user logic here
     const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
     const new_user=await User.create({
      first_name:first_name,
      last_name:last_name,
      email:email,
      password:hashedPassword,
     })

  res.status(201).json({ message: 'User registered successfully',status:'success' ,data:new_user });
})

/**
 * @description login user
 * @route Post /api/auth/login
 */
module.exports.loginUser=asyncHandler(async(req,res)=>{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
          status: 'error',
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
  }
  const token = user.generateToken();
  res.status(200).json({
    status:"success",
    message:"تم تسجيل الدخول بنجاح ",
    data:{
      profile:user,
      token
    }
  })
})