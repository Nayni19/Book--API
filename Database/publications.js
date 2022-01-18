const mongoose = require("mongoose");

//create book schema
const PublicationsSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const PublicationModel = mongoose.model("publications", PublicationsSchema);

module.exports = PublicationModel;