const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', (req, res, next) => {
  const skills = controller.getSkills()
  const msgskill = req.flash('msgskill')[0]
  const msgfile = req.flash('msgfile')[0]
  res.render('pages/admin', { title: 'Admin page', skills, msgskill, msgfile })
})

router.post('/skills', controller.postSkills)

router.post('/upload', controller.postProducts
)

module.exports = router
