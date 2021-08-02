var express = require('express');
var router = express.Router();
const Article = require('../models/article');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Article.find({},(err,articles) => {
    if(err) return next(err);
    res.render('allArticles',{articles:articles});
  })
});

router.get('/new',(req,res,next)=> {
  res.render('createArticleForm')
})

router.post('/',(req,res,next) => {
  Article.create(req.body,(err,article)=> {
    if(err) return next(err);
    res.redirect('/articles');
  })
});

router.get('/:id/edit',(req,res,next)=>{
  const id = req.params.id;
  Article.findById(id,(err,article)=> {
    if(err) return next(err);
    res.render('updateForm',{article:article});
  })
})

router.post('/:id',(req,res,next)=> {
    const id = req.params.id;
    Article.findByIdAndUpdate(id,req.body,{new :true},(err,article)=> {
      if(err) return next(err);
      res.render('article',{article:article});
    })
})

router.get('/:id/delete',(req,res,next)=> {
  const id = req.params.id;
  Article.findByIdAndDelete(id,(err,article)=> {
    if(err) return next(err);
    res.redirect('/articles')
  })
})

router.get('/:id/likes/increment',(req,res,next)=> {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc : {likes :1}},{new:true},(err,article)=> {
    if(err) return next(err);
    res.render('article',{article,article});
  })
})
router.get('/:id/likes/decrement',(req,res,next)=> {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc : {likes :-1}},{new:true},(err,article)=> {
    if(err) return next(err);
    res.render('article',{article,article});
  })
})

router.get('/:id',(req,res,next)=> {
  const id = req.params.id;
  Article.findById(id,(err,article)=> {
    if(err) return next(err);
    res.render('article',{article : article});
  });
})

module.exports = router;
