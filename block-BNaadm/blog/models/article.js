const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title : String,
    description : String,
    tags : [String],
    author : String,
    likes : Number,
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
})

const Article = mongoose.model('Article',articleSchema);

module.exports = Article;