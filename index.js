const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const AdminRouter = require('./Controllers/admincontroller')
const ProductRouter = require('./Controllers/productcontroller')
const UserRouter = require('./Controllers/usercontroller')
const OrderRouter = require('./Controllers/ordercontroller')
const URL = 'mongodb+srv://root:root@cluster0.cnnzxyr.mongodb.net/'

const port = 5000

async function Connect(){
    try{
        await mongoose.connect(URL)
        console.log('Database connection Successfull')
    }
    catch{
        console.log('DB Connection Error')
    }
}

app.listen(port, '0.0.0.0', () => {
    console.log('Server is Started in the port', port)
})

app.get('/', (req,res) => {
    res.send({
        data: "API CREATED SUCCESSFULLY!!"
    })
})

app.use(cors())
app.use(express.json())
app.use('/', AdminRouter)
app.use('/', ProductRouter)
app.use('/',UserRouter)
app.use('/',OrderRouter)

Connect()



