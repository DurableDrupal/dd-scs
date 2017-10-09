var router = require('express').Router()
const Writer = require('../../models/writer').Writer;

// API for /api/writers (writers collection requests)
router.get('/writers', function(req, res) {
  const querystring = (req.query.idLegacy) ? {idLegacy: req.query.idLegacy} : {}
  query = Writer.find(querystring)
  if (req.query.limit) {
    query.limit(req.query.limit)
  }
  if (req.query.sort) {
    query.sort(req.query.sort)
  }
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, writers) {
      if (err)
          return res.json({
              error: "Error fetching writers",
              error: err
          });
      else if (!writers)
          return res.json({
              error: "Error finding writers",
              error: err
          });
      res.send(writers);
  })
})

router.post('/writers', function(req, res) {
    // console.log('adding new writer: ' + req.body.title)
    var writer = new Writer(req.body)

    writer.save(function(err, result) {
        if (err)
            return res.json({
                error: err
            });
        res.json({
            message: "Successfully added writer",
            writer: result
        })
    })
})

// Writer upsert on the basis of slug in query
router.put('/writers', function(req, res) {
    var aWriter = {}
    aWriter["metaData"] = {}
    aWriter["writerTwitter"] = {}
    aWriter.writerTwitter["linkAttributes"] = []
    aWriter["writerFacebook"] = {}
    aWriter.writerFacebook["linkAttributes"] = []
    aWriter["writerBio"] = {}
    aWriter["writerProfileMedia"] = {}
    aWriter.writerProfileMedia["mediaLink"] = {}

    // console.log("aWriter", aWriter)
    aWriter.metaData.itemName = req.body.data.nombre
    aWriter.metaData.itemSlug = req.body.data.slug
    aWriter.metaData.publishedDate = new Date().toISOString()
    aWriter.metaData.published = true
    aWriter.writerBio.value = req.body.content
    aWriter.writerTwitter.linkUrl = req.body.data.twitter.url
    aWriter.writerTwitter.linkAttributes.push({attrName: 'title', attrValue: req.body.data.twitter.profile_name})
    aWriter.writerFacebook.linkUrl = req.body.data.facebook.url
    aWriter.writerFacebook.linkAttributes.push({attrName: 'title', attrValue: req.body.data.facebook.profile_name})
    aWriter.writerProfileMedia.mediaLink.linkUrl = req.body.data.picture
    // console.log('the new aWriter: ', aWriter)
    // skip autor for now, since we would have to look that up

    var query = {
        'metaData.itemSlug': req.body.data.slug
    }
    Writer.findOneAndUpdate(query, aWriter, {upsert: true, new: true},
      function(err, writer) {
        if (err)
            return res.json({
                error: "Error fetching writer para upsert",
                message: err
            });
        else if (!writer)
            return res.json({
                error: "Error finding writer para upsert",
                message: err
            });
        res.json({
            message: "Successfully upserted writer",
            writer: writer
        })
    })
})


// CAUTION will delete all writers
router.delete('/writers', function(req, res) {
    Writer.remove({}, function(err) {
        if (err)
            return res.json({
                error: "Error deleting all writers",
                error: err
            });
        res.json({info: 'All writers removed successfully'})
    })
})

// API for /api/writer/:_id - specific writer with param _id
router.get('/writers/:_id', function(req, res) {
  query = Writer.findOne({_id: req.params._id})
  // optionally support field specifications in query strings
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, writer) {
        if (err)
            return res.json({
                error: "Error fetching writers",
                error: err
            });
        else if (!writer)
            return res.json({
                error: "Error finding writers",
                error: err
            });
        res.send(writer);
    })
})

router.get('/writersbyslug/:slug', function(req, res) {
  query = Writer.findOne({"metaData.itemSlug": req.params.slug})
  // optionally support field specifications in query strings
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, writer) {
        if (err)
            return res.json({
                error: "Error fetching writers",
                error: err
            });
        else if (!writer)
            return res.json({
                error: "Error finding writers",
                error: err
            });
        res.send(writer);
    })
})

router.delete('/writers/:_id', function(req, res) {
    Writer.findByIdAndRemove({
        _id: req.params._id
    }, function(err) {
        if (err)
            return res.json({
                error: "Error deleting writer",
                error: err
            });
        res.json({info: 'writer removed successfully'})
    })
})

module.exports = router
