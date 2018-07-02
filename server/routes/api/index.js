var router = require('express').Router()

router.use(require('./authors'))
router.use(require('./blocks'))
// router.use(require('./contactos'))
router.use(require('./users'))

module.exports = router
