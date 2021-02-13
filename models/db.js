var mongoose = require('mongoose');
const DBSchema = new mongoose.Schema({
    date: {
        required: true,
        type: String
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    time: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productive: {
        type: Boolean,
        default: true
    }
})
module.exports = mongoose.model('db', DBSchema, 'db');