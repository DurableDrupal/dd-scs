var router = require('express').Router()
const Text = require('../../models/text').Text;

// API for /api/texts (texts collection requests)
router.get('/texts', function(req, res) {
  const querystring = (req.query.idLegacy) ? {idLegacy: req.query.idLegacy} : {}
  query = Text.find(querystring)
  if (req.query.limit) {
    query.limit(req.query.limit)
  }
  if (req.query.sort) {
    query.sort(req.query.sort)
  }
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, texts) {
      if (err)
          return res.json({
              error: "Error fetching texts",
              error: err
          });
      else if (!texts)
          return res.json({
              error: "Error finding texts",
              error: err
          });
      res.send(texts);
  })
})

router.post('/texts', function(req, res) {
    //console.log('adding new text: ' + req.body.title)
    var text = new Text(req.body)

    text.save(function(err, result) {
        if (err)
            return res.json({
                error: err
            });
        res.json({
            message: "Successfully added text",
            text: result
        })
    })
})

// Text upsert on the basis of idLegacy in query
router.put('/texts', function(req, res) {
    // TODO support update as well as upsert
        // update: :_id present, define query and options accordingly
        // upsert: no :_id present, but :idLegacy present, define query and options accordingly
    var query = {
        'idLegacy': req.body.idLegacy
    }
    Text.findOneAndUpdate(query, req.body, {upsert: true, new: true},
      function(err, text) {
        if (err)
            return res.json({
                error: "Error fetching text para upsert",
                error: err
            });
        else if (!text)
            return res.json({
                error: "Error finding text para upsert",
                error: err
            });
        res.json({
            message: "Successfully upserted text",
            text: text
        })
    })
})

// CAUTION will delete all texts
router.delete('/texts', function(req, res) {
    Text.remove({}, function(err) {
        if (err)
            return res.json({
                error: "Error deleting all texts",
                error: err
            });
        res.json({info: 'All texts removed successfully'})
    })
})

// API for /api/text/:_id - specific text with param _id
router.get('/texts/:_id', function(req, res) {
  query = Text.findOne({_id: req.params._id})
  // optionally support field specifications in query strings
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, text) {
        if (err)
            return res.json({
                error: "Error fetching texts",
                error: err
            });
        else if (!text)
            return res.json({
                error: "Error finding texts",
                error: err
            });
        res.send(text);
    })
})

router.delete('/texts/:_id', function(req, res) {
    Text.findByIdAndRemove({
        _id: req.params._id
    }, function(err) {
        if (err)
            return res.json({
                error: "Error deleting text",
                error: err
            });
        res.json({info: 'text removed successfully'})
    })
})


module.exports = router