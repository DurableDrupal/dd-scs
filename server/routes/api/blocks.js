var router = require('express').Router()
const Block = require('../../models/block').Block;

// API for /api/blocks/taglists (blocks taglist requests)
router.get('/blocks/taglists', function (req, res) {
  const blockNuevo = (req.query.blockNuevo) ? req.query.blockNuevo : 'no'
  const taglist = (req.query.taglist) ? req.query.taglist : 'Nada'
  Block.aggregate([
    { $unwind: "$blockTags" },
    { $match: { 
      "blockNuevo": blockNuevo,
      "blockTags.vocabName": taglist,
    }},
    { $group:
      { _id: "$blockTags.tagName" } 
    },
    { $sort:
      { '_id': 1 } 
    }
  ], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // send array of values instead of objects with key
    res.send(result.map(function (pt) { return pt._id}))
    //console.log(result);
  })
})

// API for /api/blocks/page (returns list of blocks per page)
router.get('/blocks/page', function (req, res) {
    var options = {}
    if (req.query.page) {
      options["page"] = req.query.page
    } else {
      options["page"] = 1
    }
    if (req.query.limit) {
      options["limit"] = parseInt(req.query.limit)
    } else {
      // return metadata only
      options["limit"] = 0
    }
    if (req.query.sort) {
      options["sort"] = req.query.sort
    }
    if (req.query.select) {
      options["select"] = req.query.select
    }
    // title and tag together not supported for now
    let query = { "metaData.published": true }
    if (req.query.title) {
      // as per https://stackoverflow.com/questions/29466377/programmatically-build-dynamic-query-with-mongoose
      // query = {"metaData.published": true, "metaData.itemName": req.query.title}
      query["metaData.itemName"] = req.query.title
    }
    if (req.query.tag) {
      query["blockTags.tagName"] = req.query.tag
    }
    if (req.query.blockNuevo) {
      query["blockNuevo"] = req.query.blockNuevo
    }
    Block.paginate(query, options, function (err, blocks) {
      if (err)
        return res.json({
          error: "Error fetching blocks",
          error: err
        });
      else if (!blocks)
        return res.json({
          error: "Error finding blocks",
          error: err
        });
      res.send(blocks);
    })
  })

// API for /api/blocks (blocks collection requests)
router.get('/blocks', function (req, res) {
    const querystring = (req.query.idLegacy) ? { idLegacy: req.query.idLegacy } : { "metaData.published": true }
    query = Block.find(querystring)
    if (req.query.blockSemana) {
      query.where('blockSemana').equals(req.query.blockSemana)
    }
    if (req.query.blockNuevo) {
      query.where('blockNuevo').equals(req.query.blockNuevo)
    }
    if (req.query.destacado) {
      query.where('blockSlideShow').equals(req.query.destacado)
    }
    // .populate('blockAuthor')
    if (req.query.limit) {
      query.limit(parseInt(req.query.limit))
    }
    if (req.query.sort) {
      query.sort(req.query.sort)
    }
    if (req.query.select) {
      query.select(req.query.select)
    }
    query.exec(function (err, blocks) {
      if (err)
        return res.json({
          error: "Error fetching blocks",
          error: err
        });
      else if (!blocks)
        return res.json({
          error: "Error finding blocks",
          error: err
        });
      res.send(blocks);
    })
  })

router.post('/blocks', function (req, res) {
    //console.log('adding new block: ' + req.body.title)
    var block = new Block(req.body)

    block.save(function (err, result) {
      if (err)
        return res.json({
          error: err
        });
      res.json({
        message: "Successfully added block",
        block: result
      })
    })
  })
// Block upsert on the basis of slug in query
.put('/blocks', function (req, res) {
    // TODO support update as well as upsert
    // update: :_id present, define query and options accordingly
    // upsert: no :_id present, but :idLegacy present, define query and options accordingly
    var aBlock = {}
    aBlock["idLegacy"] = null
    aBlock["metaData"] = {}
    aBlock["blockAuthor"] = []
    aBlock["blockSubTitle"] = null
    aBlock["blockSummary"] = null
    aBlock["blockBody"] = null
    aBlock["blockPhoto"] = {}
    aBlock.blockPhoto["mediaLink"] = {}
    aBlock.blockPhoto.mediaLink["linkAttributes"] = []
    aBlock["blockVideo"] = {}
    aBlock.blockVideo["mediaLink"] = {}
    aBlock.blockVideo.mediaLink["linkAttributes"] = []
    aBlock["blockLink"] = {}
    aBlock.blockLink["linkAttributes"] = []
    aBlock["blockTags"] = []
    aBlock["blockPages"] = []

    aBlock.idLegacy = req.body.data.idLegacy
    aBlock.metaData.itemName = req.body.data.nombre
    aBlock.metaData.itemSlug = req.body.data.slug
    aBlock.metaData.publishedDate = new Date().toISOString()
    aBlock.metaData.published = true
    aBlock.blockAuthor.push(req.body.data.blockAuthor) 
    aBlock.blockSubTitle = req.body.data.blockSubTitle
    aBlock.blockSummary = req.body.data.blockSummary
    aBlock.blockBody = req.body.content
    // aBlock.blockPhoto
    aBlock.blockPhoto.mediaLink.linkUrl = req.body.data.blockPhoto.mediaLink.url
    aBlock.blockPhoto.mediaLink.linkFilePath = req.body.data.blockPhoto.mediaLink.filePath
    aBlock.blockPhoto.mediaLink.linkAttributes.push({attrName: 'title', attrValue: req.body.data.blockPhoto.mediaLink.title})
    aBlock.blockPhoto.mediaType = req.body.data.blockPhoto.mediaType
    aBlock.blockPhoto.mediaCaption = req.body.data.blockPhoto.mediaCaption
    // aBlock.blockVideo
    aBlock.blockVideo.mediaLink.linkUrl = req.body.data.blockVideo.mediaLink.url
    aBlock.blockVideo.mediaLink.linkFilePath = req.body.data.blockVideo.mediaLink.filePath
    aBlock.blockVideo.mediaLink.linkAttributes.push({attrName: 'title', attrValue: req.body.data.blockVideo.mediaLink.title})
    aBlock.blockLink.linkUrl = req.body.data.blockLink.url
    aBlock.blockVideo.mediaType = req.body.data.blockVideo.mediaType
    aBlock.blockVideo.mediaCaption = req.body.data.blockVideo.mediaCaption
    // aBlock.blockLink
    aBlock.blockLink.linkAttributes.push({attrName: 'title', attrValue: req.body.data.blockLink.title})
    aBlock.blockTags = req.body.data.blockTags
    aBlock.blockPages = req.body.data.blockPages

    // console.log("aBlock", aBlock)
    // skip autor for now, since we would have to look that up :(
    // no, now we got it!
    var query = {
      'metaData.itemSlug': req.body.data.slug
    }
    Block.findOneAndUpdate(query, aBlock, { upsert: true, new: true },
      function (err, block) {
        console.log("err", err)
        if (err)
          return res.json({
            error: "Error fetching block para upsert",
            message: err
          });
        else if (!block)
          return res.json({
            error: "Error finding block para upsert",
            message: err
          });
        res.json({
          message: "Successfully upserted block",
          block: block
        })
      })
  })

// CAUTION will delete all blocks
router.delete('/blocks', function (req, res) {
    Block.remove({}, function (err) {
      if (err)
        return res.json({
          error: "Error deleting all blocks",
          error: err
        });
      res.json({ info: 'All blocks removed successfully' })
    })
  })

// API for /api/block/:_id - specific block with param _id
router.get('/blocks/slug/:slug', function (req, res) {
    query = Block.findOne({ 'metaData.itemSlug': req.params.slug })
    if (req.query.select) {
      query.select(req.query.select)
    }
    // optionally support field specifications in query strings
    query.exec(function (err, block) {
      if (err)
        return res.json({
          error: "Error fetching block por slug",
          error: err
        });
      else if (!block)
        return res.json({
          error: "Error finding block por slug",
          error: err
        });
      res.send(block);
    })
  })

// API for /api/block/:_id - specific block with param _id
router.get('/blocks/:_id', function (req, res) {
    query = Block.findOne({ _id: req.params._id })
    // optionally support field specifications in query strings
    if (req.query.select) {
      query.select(req.query.select)
    }
    query.exec(function (err, block) {
      if (err)
        return res.json({
          error: "Error fetching blocks",
          error: err
        });
      else if (!block)
        return res.json({
          error: "Error finding blocks",
          error: err
        });
      res.send(block);
    })
  })

router.delete('/blocks/:_id', function (req, res) {
    Block.findByIdAndRemove({
      _id: req.params._id
    }, function (err) {
      if (err)
        return res.json({
          error: "Error deleting block",
          error: err
        });
      res.json({ info: 'block removed successfully' })
    })
  })


module.exports = router
