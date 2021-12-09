const formidable = require('formidable')
const { genSalt, hash, compare } = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const db = require('../models/db')

module.exports.signUp = (req,res,next) => {
  const password = 'NodeJsTestPassword'
  const saltRounds = 10

  genSalt(saltRounds, (err, salt) => {
      if (err) {
          throw err
      } else {
          hash(password, salt, (err, hash) => {
              if (err) {
                  throw err
              } else {
                  console.log('password', hash)
              }
          })
      }
  })
}

module.exports.loginUser = (req,res, next) => {
    const {
        email,
        password
    } = req.body
    const hash = db.get('admin.password').value()
    const emailValid = db.get('admin.email').value()
    compare(password, hash, (err, isMatch) => {
        if (err) {
            return next(err)
        } else if (!isMatch) {
            req.flash('msglogin', 'Неверный пароль')
            return res.render('pages/login', { msglogin: req.flash('msglogin') })
        } else {
            if (email !== emailValid) {
                req.flash('msglogin', 'Неверный email')
                return res.render('pages/login', { msglogin: req.flash('msglogin') })
            }
            return res.redirect('/admin')
        }
    })
}

module.exports.postMail = (req, res, next) => {
    const { body } = req
    const {
        name,
        email,
        message,
    } = body
    if (!name || !email || !message) {
        // return next('Не все поля заполнены');
        req.flash('msgemail', 'Не все поля заполнены')
        return res.redirect('/')
    }
    db.get('messages')
        .push({ email, name, message})
        .write()
    req.flash('msgemail', 'Письмо доставлено')
    res.redirect('/')
}

module.exports.getSkills = () => {
    return db.get('skills').value()
}

module.exports.postSkills = (req, res, next) => {
    const { body } = req
    const inputValues = Object.values(body)
    const inputKeys = Object.keys(body)
    if (inputValues.some(inputValue => !inputValue)) {
        // const err = new Error('Не все данные введены')
        // return next(err)
        req.flash('msgskill', 'Не все данные введены')
        return res.redirect('/admin')
    }
    for(const inputKey of inputKeys) {
        db.get('skills')
            .find({ text: inputKey })
            .assign({ number: body[inputKey] })
            .write()
    }
    req.flash('msgskill', 'Данные успешно обновлены')
    return res.redirect('/admin')
}

module.exports.getProducts = () => {
    return db.get('products').value()
}

module.exports.postProducts = (req, res, next) => {
    // db.set('products', [])
    //     .write()
    let form = new formidable.IncomingForm()
    let upload = path.join('./public', 'upload')
    fs.mkdir(upload, (err) => {
        console.log('folder created')
    })
    form.uploadDir = path.join(process.cwd(), upload)
    form.parse(req, (err, fields, files) => {
        if (err) {
            req.flash('msgfile', err)
            return res.redirect('/admin')
        }
        const { status, error } = validate(fields,files)
        if (error) {
            fs.unlink(files.photo.filepath, (err) => {
                console.log('Something went wrong while deleting temporary file')
            })
            req.flash('msgfile', status)
            return res.redirect('/admin')
        }
        const fileName = path.join(upload, files.photo.originalFilename)
        fs.rename(files.photo.filepath, fileName, async (err) => {
            if (err) {
                console.log(err.message)
            }
            let dir = fileName.substr(fileName.indexOf('\\'))
            db.get('products')
                .push({ name: fields.name, price: fields.price, src: dir})
                .write()
            req.flash('msgfile', 'Продукт успешно добавлен')
            return res.redirect('/admin')
        })
    })
}

const validate = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
        return { status: 'Не удалось добавить файл', error: true }
    }
    if (!fields.name) {
        return { status: 'Описание не заполнено', error: true }
    }
    if (!fields.price) {
        return { status: 'Цена не заполнена', error: true }
    }
    return { status: 'Ok', error: false }
}
