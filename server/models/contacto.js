var mongoose = require('./db')
var MetaData = require('./base-content-attributes/meta-data').MetaData
var Tag = require('./base-content-attributes/tag').Tag

var contacto = mongoose.Schema({
  email: String,
  asunto: String,
  mensaje: String,
  contactoDate: Date,
  contactoTags: [Tag.schema]
})

exports.EventoGlobal = mongoose.model('EventoGlobal', eventoGlobal)

