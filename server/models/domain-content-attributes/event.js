var mongoose = require('../db')
var Media = require('../base-content-attributes/media').Media
var Location = require('../base-content-attributes/location').Location
var Person = require('./person').Person
var Link = require('../base-content-attributes/link').Link

var eventSchema = mongoose.Schema({
  eventName: String,
  eventImage: [Media.schema],
  eventDateStart: Date,
  eventDateEnd: Date,
  location: Location.schema,
  eventContact: Person.schema,
  eventWebsite: Link.schema
})

exports.Event = mongoose.model('Event', eventSchema)