var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

/* GET home page. */
router.get('/', productController.homePage);

router.get('/all', productController.listAllProducts);
router.get('/all/:product_name', productController.productPage);
router.get('/about', productController.about);
router.get('/all/:product_name/ratings', productController.allRatings);
router.post('/results', productController.searchProduct)

// ratings
router.post('/all/:product_name', productController.addRating);
router.post('/all:product_name/ratings', productController.addRating);

// admin
router.get('/admin_password', productController.adminPassword);
router.get('/admin', productController.admin);
router.post('/admin', productController.admin);
router.get('/admin/add', productController.addProductGet);
router.post('/admin/add', 
    productController.upload,
    productController.pushToCloudinary,
    productController.addProductPost
);
router.get('/admin/edit', productController.editProductGet);
router.get('/admin/remove', productController.removeProductGet);
router.post('/admin/edit', productController.editProductPost);
router.post('/admin/remove', productController.removeProductPost);
router.get('/admin/edit/:product_name', productController.updateProductGet);
router.post('/admin/edit/:product_name',
    productController.upload,
    productController.pushToCloudinary,
    productController.updateProductPost
);
router.get('/admin/remove/:product_name', productController.deleteProductGet);
router.post('/admin/remove/:product_name', productController.deleteProductPost);

module.exports = router;