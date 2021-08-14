const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Category = require('../models/category');
const Author = require('../models/author');
const { populate } = require('../models/book');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../','public/uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
  
const upload = multer({ storage: storage })
  

function createBook(req,res,category,author){
    req.categoryId = [];
    req.categoryId.push(category.id);
    req.authorId = author.id;
    Book.create(req,(err,book)=> {
        if(err) return next(err);
        Author.findByIdAndUpdate(author.id,{$push : {booksId : book.id}},(err,updatedAuthor)=> {
            if(err) return next(err);
            Category.findByIdAndUpdate(category.id,{$push : {bookId : book.id}},(err,updatedCategory)=> {
                if(err) return next(err);
                res.redirect('/books');
            });
        })

    })
}

router.get('/',(req,res,next)=> {
    Book.find({},(err,books)=> {
        // console.log(books,"inside books");
        if(err) return next(err);
        res.render('listAllBooks',{books});
    })
})

router.get('/new',(req,res,next)=> {
    res.render('createBookForm');
})
router.post('/',upload.single('cover-image'),(req,res,next)=>{
    // console.log(req.body);
    // console.log("image: ",req.file);
    req.body['cover-image'] = req.file.filename;
    Author.findOne({'author-name' : req.body['author-name']},(err,author)=> {
        if(err) return next(err);
        Category.findOne({'category': req.body.category},(err,category)=> {
            if(err) return next(err);
            if(author && category){
                createBook(req.body,res,category,author);
            }
            else if(author || category){
                if(author){
                    Author.findOne({'author-name' : req.body['author-name']},(err,author)=> {
                        if(err) return next(err);
                        Category.create(req.body,(err,category)=> {
                            if(err) return next(err);
                            createBook(req.body,res,category,author);

                        })
                    })
                }
                else {
                    Author.create(req.body,(err,author)=> {
                        if(err) return next(err);
                        Category.findOne({'category': req.body.category},(err,category)=> {
                            if(err) return next(err);
                            createBook(req.body,res,category,author);

                        })
                    })
                }
            }
            else{
                Author.create(req.body,(err,author)=> {
                    if(err) return next(err);
                    Category.create(req.body,(err,category)=> {
                        if(err) return next(err);
                        createBook(req.body,res,category,author);

                    })
                })
            }
        })
    })
})

router.get('/:id/edit',(req,res,next)=> {
    const id = req.params.id;
    Book.findById(id).populate({path: 'categoryId', populate : {path : 'bookId'}}).populate({path :'authorId' , populate: {path : 'booksId'}})
    .exec((err,book)=> {
        book.categoryId.forEach(c => console.log(c.category));
        if(err) return next(err);
        res.render('editBookDetails',{book});
    });
})
router.post('/:id',(req,res,next)=> {
    const id = req.params.id;
    Book.findByIdAndUpdate(id,req.body,(err,book)=> {
        if(err) return next(err);
        Author.findByIdAndUpdate(book.authorId,req.body,(err,author)=>{
            if(err) return next(err)
            Category.update({bookId :book.id },req.body,{multi : true},(err,info)=>{
                if(err) return next(err)
                res.redirect('/books/' + id);

            })
        })
    })
})

router.get('/:id/delete',(req,res,next)=> {
    const id = req.params.id;
    Book.findByIdAndDelete(id,(err,book)=> {
        console.log("✔", book);
        if(err) return next(err);
        Category.update({bookId : book.id},{$pull : {bookId : book.id}},{multi : true},(err,info)=> {
            if(err) return next(err);
            console.log("info: ",info);
            Author.update({booksId : book.id},{$pull : {booksId : book.id}},{multi : true},(err,info)=> {
                if(err) return next(err);
                res.redirect('/books')
            })
        })
    })
})
router.get('/:id',(req,res,next)=> {
    const id = req.params.id;
    // by populating across multiple level
    Book.findById(id).populate({path: 'categoryId', populate : {path : 'bookId'}}).populate({path :'authorId' , populate: {path : 'booksId'}})
    .exec((err,book)=> {
        if(err) return next(err);
        res.render('listSingleBook',{book});
    });
    

})
module.exports = router;