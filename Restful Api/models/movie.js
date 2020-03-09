const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    watchedOrNot: {
        type: Boolean,
        default: false
    },
    yearYouWatchedIn: {
        type: Number,
        default: 0
    }
}, { timestamps: true }
)

module.exports = mongoose.model('Movie', movieSchema);