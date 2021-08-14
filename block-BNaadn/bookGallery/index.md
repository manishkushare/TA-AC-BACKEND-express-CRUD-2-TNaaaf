Author.findByIdAndUpdate(book.authorId,{$pull : {booksId : book.id}},(err,info)=> {
            if(err) return next(err);
            book.categoryId.forEach(c => {
                Category.findByIdAndUpdate(c.id, {$pull : {bookId : book.id}},(err,info)=> {
                if(err) return next(err);
                res.redirect('/books');
                })
            })
        });