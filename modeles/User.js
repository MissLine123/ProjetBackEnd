const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admim: {type: Boolean},
});
module.exports = mongoose.model('User', userSchema);