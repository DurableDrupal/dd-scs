var config = require('../../config')
const uri = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}?authSource=admin`

var mongoose = require('mongoose')
mongoose.connect(uri)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (callback) {
  console.log('db connected')
})

module.exports = mongoose
