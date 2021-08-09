const mongoose = require('mongoose');
const Article = require('./article');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    content : String,
    articleId : {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    likes : {
        type : Number,
        default : 0,
    },
    author : String

},{timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;