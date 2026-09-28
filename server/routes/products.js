const express=require('express');
const { addProduct, getAllProducts, getProductById, updateProductById, deleteProductById } = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const router=express.Router();

router.post('/',verifyToken,addProduct);
router.get('/',getAllProducts);
router.get('/:id',verifyToken,getProductById);
router.put('/:id',verifyToken,updateProductById);
router.delete('/:id',verifyToken,deleteProductById);
module.exports=router