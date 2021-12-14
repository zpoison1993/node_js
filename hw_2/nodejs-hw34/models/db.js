/*const nconf = require('nconf')
const path = require('path')

console.log('FILE', path.join(__dirname,'my-db.json'))
module.exports = function () {
    return nconf
        .argv()
        .env()
        .file({ file: path.join(__dirname,'data.json')})
}*/
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults
// db.defaults({ skills: [], products: [] })
//     .write()

module.exports = db
