var express = require('express');
var router = express.Router();
const Article = require('../models/article');
const Comment =  require('../models/comment');

// get the articles
router.get('/', function(req, res, next) {
  Article.find({},(err,articles)=> {
    if(err) return next(err);
    res.render('articles',{articles});
  })

});
// create new article
// two way step 
// render form using get request
// capture data using post
router.get('/new',(req,res,next)=> {
  res.render('createArticleForm')
})
router.post('/',(req,res,next)=> {
  Article.create(req.body,(err,article)=> {
    if(err) return next(err);
    res.redirect('/articles');
  })
})

// edit article
router.get('/:id/edit',(req,res,next)=>{
  const id = req.params.id;
  Article.findById(id,(err,article)=> {
    if(err) return next(err);
    res.render('updateArticle',{article});
  })
})
router.post('/:id',(req,res,next)=> {
  const id = req.params.id;
  Article.findByIdAndUpdate(id,req.body,{new :true}, (err,article)=> {
    if(err) return next(err);
    res.redirect('/articles/' + id);
  })
})

// delete article
router.get('/:id/delete',(req,res,next)=>{
  const id = req.params.id;
  Article.findByIdAndDelete(id,(err,article)=> {
    if(err) return next(err);
    Comment.deleteMany({articleId : article.id},(err,info)=> {
      if(err) return next(err);
      res.redirect('/articles');
    })
  })
})



// find single article and list comments
router.get('/:id',(req,res,next)=> {
  const id = req.params.id;
  Article.findById(id).populate('comments').exec((err,article)=>{
    if(err) return next(err);
    res.render('article',{article})
  })
})

// create comment
router.post('/:id/comment',(req,res,next)=>{
  const id= req.params.id;
  req.body.articleId = id;
  Comment.create(req.body,(err,comment)=> {
    if(err) return next(err)
    Article.findByIdAndUpdate(comment.articleId,{$push : {comments : comment.id}},(err,article)=> {
      if(err) return next(err);
      res.redirect('/articles/' + id);
    })
  })
})
module.exports = router;
