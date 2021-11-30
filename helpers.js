const { copyFile, access, constants } = require('fs')
const { errorCode } = require('./constants')

const generateUniquePostfix = (radix = 36, customSize = 7) =>
    (Math.random() + 1).toString(radix).substring(customSize)
const modifyDuplicatedFileNames = (path) =>
    `${path.substr(0, path.lastIndexOf('.'))}_${generateUniquePostfix()}${path.substr(path.lastIndexOf('.'))}`

const copyFileUtil = ({ input, output }) => {
    access(output, constants.F_OK, (err) => {
        if (!err) {
            const outputWithUniqueFileName = modifyDuplicatedFileNames(output)
            copyFile(input, outputWithUniqueFileName, err => {
                if (err) {
                    console.log('e', err)
                    throw new Error(`Failed to copy file to destination folder`)
                }
                console.log('---COPYING DONE', outputWithUniqueFileName)
            })
        } else if (err.code === errorCode.NOT_FOUND) {
            copyFile(input, output, err => {
                if (err) {
                    throw new Error(`Failed to copy file to destination folder`)
                }
                console.log('---COPYING DONE', output)
            })
        } else {
            throw err
        }
    });

}

module.exports = copyFileUtil
