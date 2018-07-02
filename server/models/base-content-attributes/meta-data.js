var mongoose = require('../db')
var Schema = mongoose.Schema
var Tag = require('./tag').Tag

var metaDataSchema = mongoose.Schema({
    itemSlug: String,
    itemSlugLegacy: [String],
    itemName: String,
    itemType: String,
    language: String,
    published: Boolean,
    promote: Boolean,
    sticky: Boolean,
    publishedDate: Date,
    disabled:   Boolean,
    createdDate: Date,
    modifiedDate: Date,
    revisionId: Number,
    // nodewords (D6), metadata (D7)
    metaTags: Schema.Types.Mixed,
    workflowState: Tag.schema
})

exports.MetaData = mongoose.model('MetaData', metaDataSchema)
