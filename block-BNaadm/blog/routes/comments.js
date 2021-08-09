const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Article = require('../models/article');
// edit commnet is two way process
router.get('/:id/edit',(req,res,next)=> {
    const id = req.params.id;
    Comment.findById(id,(err,comment)=> {
        res.render('updateComment',{comment});
    })
})

router.post('/:id',(req,res,next)=> {
    const id = req.params.id;
    Comment.findByIdAndUpdate(id,req.body,{new :true},(err,comment)=>{
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
})

// increment likes
router.get('/:id/likes/increment',(req,res,next)=> {
    const id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc : {likes :1}},(err,comment)=> {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
})
// decrement likes
router.get('/:id/likes/decrement',(req,res,next)=> {
    const id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc : {likes :-1}},(err,comment)=> {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
})
// delete comment
router.get('/:id/delete',(req,res,next)=> {
    const id = req.params.id;
    Comment.findByIdAndDelete(id,(err,comment)=> {
        if(err) return next(err);
        Article.findByIdAndUpdate(comment.articleId,{$pull : {comments : comment.id}},(err,article)=> {
            if(err) return next(err);
            res.redirect('/articles/' + article.id);
        })
    })
})
module.exports = router;
