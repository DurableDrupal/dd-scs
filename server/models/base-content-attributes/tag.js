var mongoose = require('../db')

var tagSchema = mongoose.Schema({
    idLegacy: Number,
    vocabIdLegacy: Number,
    vocabName: String,
    tagSlug: String,
    tagName: String
})

exports.Tag = mongoose.model('Tag', tagSchema)