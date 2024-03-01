const AdminRouter = require('express').Router()
const Admin = require('../Models/admin')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

AdminRouter.post("/createadmin", async (req, res) => {
    const { username, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: encryptedPassword,
    });
    try {
      const oldadmin = await Admin.findOne({ email });
      if (oldadmin) {
        res.json("User Already existing");
      } else {
        admin.save();
        res.json("Data Successfully Stored");
      }
    } catch (err) {
      res.json("Error Occured");
    }
});

AdminRouter.post("/adlogin", (req, res) => {
    const { email, password } = req.body;
    Admin.findOne({ email: email }).then((admin) => {
      if (admin) {
        bcrypt.compare(password, admin.password, (err, response) => {
          if (response) {
            const token = jwt.sign({email: admin.email},'process.env.JWT_TOKEN',{expiresIn: '1d'})
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

AdminRouter.post('/admindata', async (req,res) => {
  const {token} = req.body;
  try{
    const admin = jwt.verify(token,'process.env.JWT_TOKEN')
    const adminemail = admin.email
    Admin.findOne({email: adminemail}).then((data) => {
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

AdminRouter.post('/forgot-password', (req,res) => {
  const {email} = req.body;
  Admin.findOne({email})
  .then(admin => {
    if(!admin){
      return res.json({
        message: "User not existed"
      })
    }
    else{
    const token = jwt.sign({id: admin._id},`process.env.JWT_TOKEN`,{expiresIn: "1d"})
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kannansrinivasanrs@gmail.com',
        pass: 'hmge naes wrwi zgmn'
      }
    });
    const link = `http://localhost:3000/resetpassword/${admin._id}/${token}`
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

AdminRouter.post('/reset-password/:id/:token', (req,res) => {
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
        Admin.findByIdAndUpdate({_id:id},{password: hash})
        .then(a => res.json("Password Updated Successfully!! Now try to login!!"))
        .catch(err => res.json("Error"))
      })
      .catch(err => res.json("Error"))
    }
  })
})

AdminRouter.get('/admincount', async (req,res) => {
  try{
    const admin = await Admin.find().count()
    res.json(admin)
  }
  catch(err){
      res.json(err)
    }
})

module.exports = AdminRouter