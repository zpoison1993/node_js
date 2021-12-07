const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const db = require('../models/db')

module.exports.getSkills = () => {
    return db.get('skills').value()
}

module.exports.postSkills = (req, res, next) => {
    console.log('req', req)
    const { body } = req
    console.log('body', body)
    const inputValues = Object.values(body)
    const inputKeys = Object.keys(body)
    if (inputValues.some(inputValue => !inputValue)) {
        throw new Error('Не все данные введены')
    }
    for(const inputKey of inputKeys) {
        db.get('skills')
            .find({ text: inputKey })
            .assign({ number: body[inputKey] })
            .write()
    }
    console.log('db state', db.getState())
    res.redirect('/admin')
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
            return next(err)
        }
        const { status, error } = validate(fields,files)
        if (error) {
            fs.unlink(files.photo.filepath, (err) => {
                console.log('Something went wrong while deleting temporary file')
            })
            // return res.redirect(`/?msg=${status}`)
            return res.send(`/?msg=${status}`)
        }
        console.log('UPLOAD', upload)
        console.log('files', files.photo.originalFilename)
        const fileName = path.join(upload, files.photo.originalFilename)
        fs.rename(files.photo.filepath, fileName, async (err) => {
            if (err) {
                console.log(err.message)
            }
            let dir = fileName.substr(fileName.indexOf('\\'))
            db.get('products')
                .push({ name: fields.name, price: fields.price, src: dir})
                .write()
            console.log('db state', db.getState())
            res.send(db.getState())
        })
    })
}

const validate = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
        return { status: 'Image failed to load', error: true }
    }
    if (!fields.name) {
        return { status: 'Description not found', error: true }
    }
    if (!fields.price) {
        return { status: 'Price not found', error: true }
    }
    return { status: 'Ok', error: false }
}
