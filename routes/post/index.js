const router = require('express').Router()
// const auth = require('../../middlewares/auth')
const ctrl = require('./post.ctrl')

router.get('/', ctrl.getPosts)
router.post('/', ctrl.addPost)
router.get('/:post_id', ctrl.getPost)
router.put('/:post_id', ctrl.updatePost)
router.delete('/:post_id', ctrl.deletePost)

module.exports = router
