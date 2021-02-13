var mongoose = require('mongoose');
const LocSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date
    },
    ipv4: {
        type: String,
    },
    lat: {
        type: Number
    },
    long: {
        type: Number
    },
    country: String,
    timezone: String
})
module.exports = mongoose.model('loc', LocSchema, 'loc');