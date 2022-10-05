const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

require('dotenv').config() 


mongoose.connect(process.env.DB_CONNECTION_STRING + "?retryWrites=true&w=majority",
{useNewUrlParser: true , 
useUnifiedTopology: true } )  

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const Schema = mongoose.Schema     

const Product = new Schema({
  owner : String ,
  name: String ,
  type: String ,
  details: String },
  {
    timestamps:{
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  })


module.exports = mongoose.model('productData' , Product ) 