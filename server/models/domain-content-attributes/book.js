var mongoose = require('./db')
var MetaData = require('./base-content-attributes/meta-data').MetaData
var Media = require('./base-content-attributes/media').Media
var Tag = require('./base-content-attributes/tag').Tag
var TextLong = require('./base-content-attributes/text-long').TextLong

var bookSchema = mongoose.Schema({
  idLegacy: Number,
  metaData: MetaData.schema,
  bookAuthor: [{type: mongoose.Schema.Types.ObjectId, ref: 'Writer'}],
  bookBody: TextLong.schema,
  bookFootnote: TextLong.schema,
  tags: [Tag.schema],
})
 
exports.Book = mongoose.model('Book', bookSchema)