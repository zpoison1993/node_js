const express = require('express')
const router = express.Router()
const { products, skills } = require('../data.json')
const controller = require('../controllers')

router.get('/', (req, res, next) => {
  const products = controller.getProducts()
  const skills = controller.getSkills()
  console.log('products', products)
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  controller.postMail(req, res, next)
  // res.send('Реализовать функционал отправки письма')
})

module.exports = router
