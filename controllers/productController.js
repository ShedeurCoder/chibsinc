const Product = require('../models/product');
const Rating = require('../models/review');
const cloudinary = require('cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = multer.diskStorage({});
const upload = multer({storage});
exports.upload = upload.single('image');  
exports.pushToCloudinary = (req, res, next) => {
    if (req.file) {
      cloudinary.uploader.upload(req.file.path)
      .then((result) => {
        req.body.image = result.public_id;
        next();
      })
      .catch(() => {
        res.redirect('/admin/add');
      })
    } else {
      next();
    }
}
exports.homePage = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $match: { available: true } },
            { $sample: { size: 4 } }
        ]);
        res.render('index', {title: "Chibs Inc", products});
    } catch(error) {
        next(error);
    }
}
exports.adminPassword = (req, res) => {
    res.render('admin_password', {title: "Password Protected"});
}
exports.admin = (req, res) => {  
    if(!req.session.signedIntoAdmin) {
        console.log(req.session.signedIntoAdmin)
        var attemptedPassword = req.body.admin_password_attempt;
        if (attemptedPassword === process.env.ADMIN_PASSWORD) {
            req.session.signedIntoAdmin = 1;
            res.render('admin_main', {title: "Chibs Inc - Admin"});
        } else {
            res.redirect("/admin_password");
        }
    } else {
        res.render('admin_main', {title: 'Chibs Inc - Admin'})
    }
}
exports.addProductGet = (req,res) => {
    if(!req.session.signedIntoAdmin) {
        res.redirect("/admin_password");
    } else {
        res.render('add_product', {title: "Add Product"})
    }
}
exports.addProductPost = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect(`/all/${product.product_name.replaceAll(" ", "_")}`);
    } catch(error) {
        next(error);
    }
}
exports.productPage = async (req,res,next) => {
    try {
        const productParam = req.params.product_name.replaceAll("_", " ");
        const product = await Product.findOne({product_name: productParam});
        const ratings = await Rating.aggregate([
            {$match: {product_name: product.product_name}},
            {$sample: {size: 3}}
        ]);
        const allRatings = await Rating.aggregate([
            {$match: {product_name: product.product_name}}
        ]);
        res.render('product_page', {title: `Products - ${productParam}`, product, ratings, allRatings});
    } catch(error) {
        next(error);
    }
}
exports.editProductGet = (req, res) => {
    if(!req.session.signedIntoAdmin) {
        res.redirect("/admin_password");
    } else {
        res.render('edit-remove', {title: "Edit product"});
    }
}
exports.removeProductGet = (req, res) => {
    if(!req.session.signedIntoAdmin) {
        res.redirect("/admin_password");
    } else {
        res.render('edit-remove', {title: "Remove product"});
    }
}
exports.editProductPost = async (req, res, next) => {
    try {
        const productName = req.body.product_name;
    
        const product = await Product.findOne({product_name: productName}).collation({
          locale: 'en',
          strength: 2
        });
        
        if (product != null) {
          res.render('product_page', {title: 'Edit Product', product})
          return
        } else {
          res.redirect('/admin/edit')
        }
    
      } catch(error) {
        next(error);
      }
}
exports.removeProductPost = async (req, res, next) => {
    try {
        const productName = req.body.product_name;
    
        const product = await Product.findOne({product_name: productName}).collation({
            locale: 'en',
            strength: 2
          });
        
        if (product != null) {
          res.render('product_page', {title: 'Remove Product', product})
          return
        } else {
          res.redirect('/admin/remove')
        }
    
      } catch(error) {
        next(error);
      }
}
exports.updateProductGet = async (req, res, next) => {
    try {
        if(!req.session.signedIntoAdmin) {
            res.redirect("/admin_password");
        } else {
            const product = await Product.findOne({product_name: req.params.product_name.replaceAll("_", " ")});
            res.render('add_product', {title: 'Update product', product});
        }
    } catch(error) {
        next(error)
    }
}
exports.updateProductPost = async (req, res, next) => {
    try {
        const productName = req.params.product_name.replaceAll("_", " ");
        var productId = await Product.findOne({product_name: productName});
        productId = productId._id;
        const product = await Product.findByIdAndUpdate(productId, req.body, {new:true});
        res.redirect(`/all/${product.product_name.replaceAll(" ", "_")}`);
    } catch(error) {
        next(error);
    }
}
exports.deleteProductGet = async (req, res, next) => {
    try {
        if(!req.session.signedIntoAdmin) {
            res.redirect("/admin_password");
        } else {
            const product = await Product.findOne({product_name: req.params.product_name.replaceAll("_", " ")});
            res.render('add_product', {title: 'Delete product', product});
        }
    } catch(error) {
        next(error)
    }
}
exports.deleteProductPost = async (req, res, next) => {
    try {
        const productName = req.params.product_name.replaceAll("_", " ");
        var productId = await Product.findOne({product_name: productName});
        productId = productId._id;
        const product = await Product.findByIdAndRemove({_id: productId});
        res.redirect('/');
    } catch(error) {
        next(error);
    }
}
exports.listAllProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find({available: {$eq: true}});
        res.render('all_products', { title: 'Chibs Inc - All Products', allProducts });
    } catch (error) {
        next(error);
    }
}
exports.about = (req, res) => {
    res.render('about', {title: 'Chibs Inc. - About'});
}
exports.addRating = async (req, res, next) => {
    try {
        const rating = new Rating(req.body);
        await rating.save();
        res.redirect(`/all/${req.params.product_name}`);
    } catch(error) {
        next(error);
    }
} 
exports.allRatings = async (req, res, next) => {
    try {
        const productParam = req.params.product_name.replaceAll("_", " ");
        const product = await Product.findOne({product_name: productParam});
        const ratings = await Rating.aggregate([
            {$match: {product_name: product.product_name}}
        ]);
        const allRatings = ratings;
        res.render('product_page', {title: `Products - ${productParam}`, product, ratings, allRatings});
    } catch(error) {
        next(error);
    }
}
exports.searchProduct = async (req, res, next) => {
    try {
        const searchQuery = req.body;
        const searchData = await Product.aggregate([
          {$match: {$text: {$search: `\"${searchQuery.productName}\"`}}},
          {$match:{available:true}}
        ])
        res.render('search_results', {title:"Chibs Inc. - Search results", searchData});
      } catch(error) {
        next(error);
      }
}