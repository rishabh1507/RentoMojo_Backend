const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phonebookSchema = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true }
});

const phonebook = mongoose.model('phonebook', phonebookSchema);
module.exports = phonebook;