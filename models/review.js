const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true,
    },
    reviewer_name: {
        type: String,
        required: true,
        trim: true,
        max: 50
    },
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String
    }
});

//export model
module.exports = mongoose.model('Review', reviewSchema);