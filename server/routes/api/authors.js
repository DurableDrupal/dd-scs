var router = require('express').Router()
const Author = require('../../models/author').Author;

// API for /api/authors (authors collection requests)
router.get('/authors', function(req, res) {
  const querystring = (req.query.idLegacy) ? {idLegacy: req.query.idLegacy} : {}
  query = Author.find(querystring)
  if (req.query.limit) {
    query.limit(req.query.limit)
  }
  if (req.query.sort) {
    query.sort(req.query.sort)
  }
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, authors) {
      if (err)
          return res.json({
              error: "Error fetching authors",
              error: err
          });
      else if (!authors)
          return res.json({
              error: "Error finding authors",
              error: err
          });
      res.send(authors);
  })
})

router.post('/authors', function(req, res) {
    //console.log('adding new author: ' + req.body.title)
    var author = new Author(req.body)

    author.save(function(err, result) {
        if (err)
            return res.json({
                error: err
            });
        res.json({
            message: "Successfully added author",
            author: result
        })
    })
})

// Author upsert on the basis of slug in query
router.put('/authors', function(req, res) {
    var anAuthor = {}
    anAuthor["idLegacy"] = null
    anAuthor["metaData"] = {}
    anAuthor["authorTwitter"] = {}
    anAuthor.authorTwitter["linkAttributes"] = []
    anAuthor["authorFacebook"] = {}
    anAuthor.authorFacebook["linkAttributes"] = []
    anAuthor["authorBio"] = {}
    anAuthor["authorProfileMedia"] = {}
    anAuthor.authorProfileMedia["mediaLink"] = {}

    // console.log("anAuthor", anAuthor)
    anAuthor.idLegacy = req.body.data.idLegacy
    anAuthor.metaData.itemName = req.body.data.nombre
    anAuthor.metaData.itemSlug = req.body.data.slug
    anAuthor.metaData.publishedDate = new Date().toISOString()
    anAuthor.metaData.published = true
    anAuthor.authorBio.value = req.body.content
    anAuthor.authorTwitter.linkUrl = req.body.data.twitter.url
    anAuthor.authorTwitter.linkAttributes.push({attrName: 'title', attrValue: req.body.data.twitter.profile_name})
    anAuthor.authorFacebook.linkUrl = req.body.data.facebook.url
    anAuthor.authorFacebook.linkAttributes.push({attrName: 'title', attrValue: req.body.data.facebook.profile_name})
    anAuthor.authorProfileMedia.mediaLink.linkUrl = req.body.data.picture
    console.log('the new anAuthor: ', anAuthor)
    // skip autor for now, since we would have to look that up

    var query = {
        'metaData.itemSlug': req.body.data.slug
    }
    Author.findOneAndUpdate(query, anAuthor, {upsert: true, new: true},
      function(err, author) {
        if (err)
            return res.json({
                error: "Error fetching author para upsert",
                message: err
            });
        else if (!author)
            return res.json({
                error: "Error finding author para upsert",
                message: err
            });
        res.json({
            message: "Successfully upserted author",
            author: author
        })
    })
})


// CAUTION will delete all authors
router.delete('/authors', function(req, res) {
    Author.remove({}, function(err) {
        if (err)
            return res.json({
                error: "Error deleting all authors",
                error: err
            });
        res.json({info: 'All authors removed successfully'})
    })
})

// API for /api/author/:_id - specific author with param _id
router.get('/authors/:_id', function(req, res) {
  query = Author.findOne({_id: req.params._id})
  // optionally support field specifications in query strings
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, author) {
        if (err)
            return res.json({
                error: "Error fetching authors",
                error: err
            });
        else if (!author)
            return res.json({
                error: "Error finding authors",
                error: err
            });
        res.send(author);
    })
})

// API for /api/author/:_id - specific author with param _id
router.get('/authors/slug/:slug', function(req, res) {
  query = Author.findOne({"metaData.itemSlug": req.params.slug})
  // optionally support field specifications in query strings
  if (req.query.select) {
    query.select(req.query.select)
  }
  query.exec(function(err, author) {
        if (err)
            return res.json({
                error: "Error fetching authors",
                error: err
            });
        else if (!author)
            return res.json({
                error: "Error finding authors",
                error: err
            });
        res.send(author);
    })
})

router.delete('/authors/:_id', function(req, res) {
    Author.findByIdAndRemove({
        _id: req.params._id
    }, function(err) {
        if (err)
            return res.json({
                error: "Error deleting author",
                error: err
            });
        res.json({info: 'author removed successfully'})
    })
})

module.exports = router
