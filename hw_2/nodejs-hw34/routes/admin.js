const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  const skills = controller.getSkills()
  res.render('pages/admin', { title: 'Admin page', skills })
})

router.post('/skills', controller.postSkills
//     (req, res, next) => {
//   /*
//   TODO: Реализовать сохранение нового объекта со значениями блока скиллов
//
//     в переменной age - Возраст начала занятий на скрипке
//     в переменной concerts - Концертов отыграл
//     в переменной cities - Максимальное число городов в туре
//     в переменной years - Лет на сцене в качестве скрипача
//   */
//   res.send('Реализовать сохранение нового объекта со значениями блока скиллов')
// }
)

router.post('/upload', controller.postProducts
//     (req, res, next) => {
//   /* TODO:
//    Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
//     в переменной photo - Картинка товара
//     в переменной name - Название товара
//     в переменной price - Цена товара
//     На текущий момент эта информация хранится в файле data.json  в массиве products
//   */
//   controller.postProducts()
//   // res.send('Реализовать сохранения объекта товара на стороне сервера')
//   // res.redirect('/')
// }
)

module.exports = router
