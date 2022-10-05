const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect('mongodb+srv://kubabst:ytLow2j2m05bz1Bg@topicbeans-cluster.yi96kbu.mongodb.net?retryWrites=true&w=majority',
{useNewUrlParser: true , 
useUnifiedTopology: true } )  

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const Schema = mongoose.Schema     

const User = new Schema({
  username: String ,
  password: String ,
  googleID: String },
  {
    timestamps:{
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  })


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData' , User , 'userData') 