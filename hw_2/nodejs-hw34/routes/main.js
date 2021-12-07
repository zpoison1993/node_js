const express = require('express')
const router = express.Router()
const { products, skills } = require('../data.json')
const contoller = require('../controllers')

router.get('/', (req, res, next) => {
  const products = contoller.getProducts()
  const skills = contoller.getSkills()
  console.log('products', products)
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  res.send('Реализовать функционал отправки письма')
})

module.exports = router
