const express=require('express');
const { addProduct, getAllProducts, getProductById, updateProductById, deleteProductById } = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const router=express.Router();

router.post('/',verifyToken,upload.single('image'),addProduct);
router.get('/',getAllProducts);
router.get('/:id',verifyToken,getProductById);
router.put('/:id',verifyToken,upload.single('image'),updateProductById);
router.delete('/:id',verifyToken,deleteProductById);
module.exports=router