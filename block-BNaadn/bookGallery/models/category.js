const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category : {
        type : String,
    },
    bookId : [{
        type : Schema.Types.ObjectId,
        ref : 'Book'
    }]

})

const Category  = mongoose.model('Category', categorySchema);
module.exports = Category;