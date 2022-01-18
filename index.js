const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");

const express = require("express");
const app = express();
app.use(express.json());

var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://Nayni_Shah:naynishah123@cluster0.dthvr.mongodb.net/book-company?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connection Established"));

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://Nayni_Shah:naynishah123@cluster0.dthvr.mongodb.net/book-company?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const bcollection = client.db("book-company").collection("books").findOne({ISBN:"12345THREE"});
//   bcollection.then((data)=> console.log(data)).catch((err)=>console.log(err));
//   // perform actions on the collection object
// });
// client.close();

// ROOT API
app.get("/", (req, res) => {
    return res.json({ "WELCOME": `to my Backend Software for the Book Company` });
});

// Book API
// Get all books 
// http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

// Get specific book by ISBN number 
// http://localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn", async (req, res) => {
    // console.log(req.params);
    const { isbn } = req.params;
    // console.log(isbn);
    const getSpecificBook = await BookModel.findOne({ ISBN: isbn });
    if (getSpecificBook === null) {
        return res.json({ "error": `No Book found for the ISBN of ${isbn}` });
    }
    return res.json(getSpecificBook);
});

// Get specific book by category
// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    // // console.log(req.params);
    const { category } = req.params;
    // console.log(category);
    const getByCategory = await BookModel.find({ category: category });
    if (getByCategory.length === 0) {
        return res.json({ "error": `No Book found for the specified category of ${category}` });
    }
    return res.json(getByCategory);
});

// Get all authors 
// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

// Get authors by the id 
// http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
    // console.log(req.params);
    let { id } = req.params;
    id = Number(id);
    // console.log(id);
    const getSpecificAuthor = await AuthorModel.findOne({ id: id });
    if (getSpecificAuthor === null) {
        return res.json({ "error": `No Author found for the id of ${id}` });
    }
    return res.json(getSpecificAuthor);
});

// Get authors by the books ISBN number
// http://localhost:3000/author-isbn/12345Two
app.get("/author-isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const getSpecificAuthorBook = await AuthorModel.find({ books: isbn });
    if (getSpecificAuthorBook.length === 0) {
        return res.json({ "error": `No Authors found for the book of ${isbn}` });
    }
    return res.json(getSpecificAuthorBook);
});

// Get all publications 
// http://localhost:3000/publications
app.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

// Get publications of a specific book
// http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const getSpecificPublication = await PublicationModel.find({ books: isbn });
    if (getSpecificPublication.length === 0) {
        return res.json({ "error": `No Publication found for the book of ${isbn}` });
    }
    return res.json(getSpecificPublication);
});

// Post a new book 
// http://localhost:3000/book
app.post("/book", async (req, res) => {
    // console.log(req.body);
    const addNewBook = await BookModel.create(req.body);
    return res.json({ bookAdded: addNewBook, message: "Book was added !!!" });
});

// Post a new Author 
// http://localhost:3000/author
app.post("/author", async (req, res) => {
    // console.log(req.body);
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({ authorAdded: addNewAuthor, message: "Author was added !!!" });

});

// Post a new Publication
// http://localhost:3000/publication
app.post("/publication", async (req, res) => {
    // db.publications.push(req.body);
    // return res.json(db.publications);
    const addNewPublication = await PublicationModel.create(req.body);
    return res.json({ publicationAdded: addNewPublication, message: "Publication was added !!!" });
});



// Update the details of a book 
// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    const { isbn } = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ ISBN: isbn }, req.body, { new: true });
    return res.json({ bookUpdated: updateBook, message: "Book was updated !!!" });
});

// Update author details
// http://localhost:3000/author-update/1
app.put("/author-update/:id", async (req, res) => {
    // console.log(req.params);
    let { id } = req.params;
    id = Number(id);
    const updateAuthor = await AuthorModel.findOneAndUpdate({ id: id }, req.body, { new: true });
    return res.json({ authorUpdated: updateAuthor, message: "Author was updated !!!" });
});

// Update publication details 
// http://localhost:3000/publication-update/1
app.put("/publication-update/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    const updatePublication = await PublicationModel.findOneAndUpdate({ id: id }, req.body, { new: true });
    return res.json({ publicationUpdated: updatePublication, message: "Publication was updated !!!" });
});

// Delete book 
// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req, res) => {
    // console.log(req.params);
    const { isbn } = req.params;
    const deleteBook = await BookModel.deleteOne({ ISBN: isbn });
    return res.json({ bookDeleted: deleteBook, message: "Book was Deleted !!!" });
});

// Delete Author from a book
// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    // console.log(req.params);
    let { isbn, id } = req.params;

    let getSpecificBook = await BookModel.findOne({ ISBN: isbn });
    if (getSpecificBook === null) {
        return res.json({ "error": `No Book found for the ISBN of ${isbn}` });
    }
    else {
        getSpecificBook.authors.remove(id);
        const deleteAuthorFromBook = await BookModel.findOneAndUpdate({ ISBN: isbn }, getSpecificBook, { new: true });
        return res.json({ authorDeleted: deleteAuthorFromBook, message: "Author was Deleted from the Book!!!" });
    }
});

// Delete Book from Author
// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", async (req, res) => {
    let { id, isbn } = req.params;
    id = Number(id);

    let getSpecificAuthor = await AuthorModel.findOne({ id: id });
    if (getSpecificAuthor === null) {
        return res.json({ "error": `No Author found for the Book of ${isbn}` });
    }
    else {
        getSpecificAuthor.books.remove(isbn);
        const deleteBookFromAuthor = await AuthorModel.findOneAndUpdate({ id: id }, getSpecificAuthor, { new: true });
        return res.json({ authorDeleted: deleteBookFromAuthor, message: "Book was Deleted from the Author Details!!!" });
    }
});

// Delete Author
// http://localhost:3000/author-delete/1
app.delete("/author-delete/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    const deleteAuthor = await AuthorModel.deleteOne({ id: id });
    return res.json({ authorDeleted: deleteAuthor, message: "Author was Deleted !!!" });
});

// Delete publication from a book
// http://localhost:3000/publication-delete/12345ONE
app.delete("/publication-delete/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    const deletePublication = await PublicationModel.deleteOne({ id: id });
    return res.json({ publicationDeleted: deletePublication, message: "Publication was Deleted !!!" });
});


app.listen(3000, () => {
    console.log("My EXPRESS App is Running.....")
});