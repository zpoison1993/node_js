const { copyFile, access, constants } = require('fs')
const { errorCode } = require('./constants')
const { promisify } = require('./promisificator')

const generateUniquePostfix = (radix = 36, customSize = 7) =>
    (Math.random() + 1).toString(radix).substring(customSize)
const modifyDuplicatedFileNames = (path) =>
    `${path.substr(0, path.lastIndexOf('.'))}_${generateUniquePostfix()}${path.substr(path.lastIndexOf('.'))}`

const accessAsync = promisify(access)
const copyFileAsync = promisify(copyFile)

/*const copyFileUtil = ({ input, output }) => {
    accessAsync(output, constants.F_OK)
        .then(() => {
            const outputWithUniqueFileName = modifyDuplicatedFileNames(output)
            copyFileAsync(input, outputWithUniqueFileName)
                .then(() => console.log('---ASYNC COPYING DONE', outputWithUniqueFileName))
                .catch((err) => {
                        console.log('e', err)
                        throw new Error(`Failed to copy file to destination folder`)
                    }
                )
        })
        .catch((err) => {
            if (err.code === errorCode.NOT_FOUND) {
                copyFileAsync(input, output)
                    .then(() => console.log('---ASYNC COPYING DONE', output))
                    .catch((err) => {
                            console.log('e', err)
                            throw new Error(`Failed to copy file to destination folder`)
                        }
                    )
            } else {
                console.log('Unknown error', err)
                throw err
            }
        })

}*/

const copyFileUtil = async ({ input, output, arr }) => {
    try {
        await accessAsync(output, constants.F_OK)
        const outputWithUniqueFileName = modifyDuplicatedFileNames(output)
        arr.push(copyFileAsync(input, outputWithUniqueFileName))
        console.log('---ASYNC COPYING DONE', outputWithUniqueFileName)
    } catch (e) {
        if (e.code === errorCode.NOT_FOUND) {
            arr.push(copyFileAsync(input, output))
        } else {
            console.log('Unknown error', e)
            throw e
        }
    }
}

module.exports = copyFileUtil
