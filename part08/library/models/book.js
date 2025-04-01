const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    published: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genres: {
        type: [String],
        required: true,
        validate: {
            validator: function(value) {
                return value.length > 0 && value.every(genre => genre.length >= 3);
            },
        }
    },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', schema)
