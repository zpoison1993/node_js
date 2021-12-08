const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  controller.loginUser(req,res,next)
})

module.exports = router
