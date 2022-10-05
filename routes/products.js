var express = require('express');
var router = express.Router();
const passport = require("passport");
const { request } = require('../app');
const productModel = require("../models/product")


router.get('/maint', async(req,res)=>{

  try{
    console.log("Finding products for user:" , req.user.username)
    const userProducts = await productModel.find({owner : req.user.username})

    console.log("found products", userProducts)
    res.render("products", {products : userProducts})
  }catch(e){
    res.render("products", {message : e.message })
  }
})
router.get('/', async (req,res) => {

  try{
    const products = await productModel.find()

    res.json(products)
  }catch(e){
    res.status(500).json({message : e.message})
  }
})

router.post('/', async (req,res) => {
  console.log(req.user)
  const product = new productModel({
    owner: req.body.owner , 
    name: req.body.name ,
    type: "Practical" ,
    details: "Used for mining" 
  })

  try{
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  }catch(e){
    res.status(400).json({ message : e.message})
  }

})

router.get('/:id',getProduct, (req,res) => {
  res.json(res.product)
})

router.patch('/:id',getProduct, async (req,res) => {
  if(req.body.name != null){
    res.product.name = req.body.name
  }
  if(req.body.type != null){
    res.product.type = req.body.type
  }
  if(req.body.details != null){
    res.product.details = req.body.details
  }

  try{
    const updatedProduct = await res.product.save()
    res.json(updatedProduct)
  }catch(e){
    res.status(400).json({message : e.message})
  }
})

router.delete('/:id',getProduct, async (req,res) => {
  try{
    await res.product.remove()
    res.json({message: 'Deleted Product'})
  } catch(err){
    res.status(500).json({message : err.message})
  }

})


async function getProduct(req,res,next){
  let product 
  try{
    product = await productModel.findById(req.params.id)
    if(product == null){
      return res.status(404).json({message: "Cannot find product"})
    }
  }
  catch(e){
    return res.status(500).json({message: e.message})   
  }

  res.product = product
  next() 
}

module.exports = router;