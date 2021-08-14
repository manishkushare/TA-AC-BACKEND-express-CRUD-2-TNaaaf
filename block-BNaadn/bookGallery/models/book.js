const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title : String,
    summary : String,
    pages : Number,
    publications : String,
    "cover-image" : String,
    categoryId : [ 
        {
            type : Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    authorId : {
        type : Schema.Types.ObjectId,
        ref : 'Author'
    }    
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;