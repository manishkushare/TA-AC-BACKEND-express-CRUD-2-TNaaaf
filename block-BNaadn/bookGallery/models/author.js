const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    'author-name' : String,
    'author-email' : String,
    'author-country' : String,
    booksId : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Book'
        }
    ]
})

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;