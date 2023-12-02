const {Router} = require('express')
const { loginUser, registerUser} = require('./controller')

const router = Router()

router.post('/login', loginUser)
router.post('/register', registerUser)

module.exports = router