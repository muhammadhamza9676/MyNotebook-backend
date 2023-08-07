const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_sec = "ABC123";

//Create a new User
router.post('/createuser',[
    body('name','Enter a valid Name').isLength({min:3}),
    body('email','Enter a valid Email').isEmail(),
    body('password','Password too short').isLength({min:5})
], async (req, res) => {
  let success = false;
    const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success, errors: result.array() });
  }
  //const user = User(req.body);
  try{
  let user = await User.findOne({email : req.body.email});
  if(user)
  {
    return res.status(400).json({success, errors: "Email already registered."});
  }
  const salt = await bcrypt.genSalt(10);
  const secPass =  await bcrypt.hash(req.body.password,salt);

    user = await User.create({
    name : req.body.name,
    email : req.body.email,
    password : secPass,


  });
  const data ={
    user:{
      id : user.id
    }
  }
  const jwtToken = jwt.sign(data,JWT_sec);

  
  // .then(user => res.json(user))
  // .catch(err=> {console.log(err)
  //  res.json({error:'Email already registered.'})})


    // const user = User(req.body);
    // user.save();
    success = true;
    res.json({success, jwtToken});
}
catch(error){
  console.error(error.message);
  res.status(500).send("Internal Error Occured");
}
})


//Login User
router.post('/login',[
body('email','Enter a valid Email').isEmail(),
], async (req, res) => {
  let success = false;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const {email,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({ errors: "Wrong email or password" });
    }

    const comparepass = await bcrypt.compare(password,user.password);
    if(!comparepass)
    {
      success = false;
      return res.status(400).json({ success, errors: "Wrong email or password" });
    }

    const data ={
      user:{
        id : user.id
      }
    }
    const jwtToken = jwt.sign(data,JWT_sec);
    success = true;
    res.json({success, jwtToken});
  }
  catch(error)
  {
    console.error(error.message);
  res.status(500).send("Internal Error Occured");
  }
})


//Get user details
router.post('/getuser',fetchuser, async (req, res) => {
try {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Error Occured");
}
})
module.exports = router;