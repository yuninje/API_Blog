const router = require('express').Router()
// const auth = require('../../middlewares/auth')
const ctrl = require('./user.ctrl')

router.get('/', ctrl.getUsers)
router.post('/', ctrl.addUser)
router.get('/:id', ctrl.getUser)
router.put('/:id', ctrl.updateUser)
router.delete('/:id', ctrl.deleteUser)

module.exports = router
