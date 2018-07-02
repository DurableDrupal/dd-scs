var mongoose = require('../db')
var TextLong = require('../base-content-attributes/text-long').TextLong
var Media = require('../base-content-attributes/media').Media
var Tag = require('../base-content-attributes/tag').Tag

var textSchema = mongoose.Schema({
//  textAuthor: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
  textTeaser: TextLong.schema,
  textBody: TextLong.schema,
  textFootnote: TextLong.schema,
  textMedia: [Media.schema],
  tags: [Tag.schema],
})
 
exports.Text = mongoose.model('Text', textSchema)
