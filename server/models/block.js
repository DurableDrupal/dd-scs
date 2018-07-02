var mongoose = require('./db')
var Link = require('./base-content-attributes/link').Link
var MetaData = require('./base-content-attributes/meta-data').MetaData
var Media = require('./base-content-attributes/media').Media
var Tag = require('./base-content-attributes/tag').Tag

var blockSchema = mongoose.Schema({
  idLegacy: Number,
  metaData: MetaData.schema,
  blockAuthor: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
  blockSubTitle: String,
  blockSummary: String,
  blockBody: String,
  blockPhoto: Media.schema,
  blockVideo: Media.schema,
  blockLink: Link.schema,
  // slugs of pages where the block is to be included
  blockPages: [String],
  blockTags: [Tag.schema]
})
 
exports.Block = mongoose.model('Block', blockSchema)

