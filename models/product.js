const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: "Product name is required",
        max: 32,
        unique: true,
        trim: true
    },
    product_description: {
        type: String,
        required: "Product description is required",
    },
    link: {
        type: String,
        required: "Link is required"
    },
    image: String,
    price: {
        type: Number,
        required: "Price is required"
    },
    available: {
        type: Boolean,
        required: "Availability is required"
    }
});

productSchema.index({
    product_name: 'text'
});

//export model
module.exports = mongoose.model('Product', productSchema);