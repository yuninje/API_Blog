const router = require('express').Router()
// const auth = require('../../middlewares/auth')
const ctrl = require('./user.ctrl')

router.get('/', ctrl.getUsers)
router.post('/', ctrl.addUser)
router.get('/:user_id', ctrl.getUser)
router.put('/:user_id', ctrl.updateUser)
router.delete('/:user_id', ctrl.deleteUser)

module.exports = router
