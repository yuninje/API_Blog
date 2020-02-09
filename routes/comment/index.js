const router = require('express').Router()
// const auth = require('../../middlewares/auth')
const ctrl = require('./comment.ctrl')

router.get('/', ctrl.getComments)
router.post('/', ctrl.addComment)
router.get('/:comment_id', ctrl.getComment)
router.put('/:comment_id', ctrl.updateComment)
router.delete('/:comment_id', ctrl.deleteComment)

module.exports = router
