const UserRouter = require('express').Router()
const User = require('../Models/user')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

UserRouter.post("/createuser", async (req, res) => {
    const { username, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: encryptedPassword,
    });
    try {
      const olduser = await User.findOne({ email });
      if (olduser) {
        res.json("User Already existing");
      } else {
        user.save();
        res.json("Data Successfully Stored");
      }
    } catch (err) {
      res.json("Error Occured");
      console.log(err);
    }
});

UserRouter.post("/userlogin", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({email: user.email},'process.env.JWT_TOKEN',{expiresIn: '1d'})
            res.json({
              message: "Success",
              data: token
            });
          } else {
            res.json("Invalid Password");
          }
        });
      } else {
        res.json("No record found!!, Please Create");
      }
    });
});

UserRouter.post('/userdata', async (req,res) => {
  const {token} = req.body;
  try{
    const user = jwt.verify(token,'process.env.JWT_TOKEN')
    const useremail = user.email
    User.findOne({email: useremail}).then((data) => {
      res.json({
        message: "VERIFIED",
        data: data
      })
    }).catch((err) => {
      res.json({
        message: "EXPIRED"
      })
    })
  }catch(err){
    console.log(err)
  }
})

UserRouter.post('/forgot-password', (req,res) => {
  const {email} = req.body;
  User.findOne({email})
  .then(user => {
    if(!user){
      return res.json({
        message: "User not existed"
      })
    }
    else{
    const token = jwt.sign({id: user._id},`process.env.JWT_TOKEN`,{expiresIn: "1d"})
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kannansrinivasanrs@gmail.com',
        pass: 'hmge naes wrwi zgmn'
      }
    });
    const link = `https://main--dulcet-otter-4e9c91.netlify.app/reset/${User._id}/${token}`
    var mailOptions = {
      from: 'kannansrinivasanrs@gmail.com',
      to: email,
      subject: 'Reset your Password',
      text: 'Reset your password with below link',
      html: `<a href="${link}">${link}</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.json("Email sent successfully!!")
      }
    });
  }
  })
})

UserRouter.post('/reset-password/:id/:token', (req,res) => {
  const {id,token} = req.params
  const {password} = req.body

  jwt.verify(token,'process.env.JWT_TOKEN',(err,decoded) => {
    if(err){
      res.json({
        message: "Error"
      })
    } else{
      bcrypt.hash(password, 10)
      .then(hash => {
        User.findByIdAndUpdate({_id:id},{password: hash})
        .then(a => res.json("Password Updated Successfully!! Now try to login!!"))
        .catch(err => res.json("Error"))
      })
      .catch(err => res.json("Error"))
    }
  })
})

UserRouter.get('/getuser', async(req,res) => {
    const user = await User.find()
  try{
     res.json(user)
 }
 catch (err) {
     res.json(err)
 }
})

UserRouter.get('/usercount', async(req,res) => {
    try{
        const user = await User.find().count()
        res.json(user)
    }
    catch(err){
        res.json(err)
    }
})

module.exports = UserRouter