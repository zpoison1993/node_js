const yargs = require('yargs')
const path = require('path')
const { readdir, lstat, mkdir } = require('fs')
const copyFileUtil = require('./helpers')
const { errorCode } = require('./constants')
const { promisify } = require('./promisificator')

const args = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('1.0.1')
    .alias('version', 'v')
    .example('node $0 --entry ./input --dist ./outputAsync -D')
    .option('entry', {
        alias: 'e',
        describe: 'Configuring entry path',
        demandOption: true
    })
    .option('dist', {
        alias: 'd',
        describe: 'Configuring output path',
        default: './outputAsync'
    })
    .option('delete', {
        alias: 'D',
        describe: 'Flag to delete input folder',
        default: false,
        boolean: true
    })
    .epilog('Homework 1')
    .argv

const config = {
    entry: path.normalize(path.resolve(__dirname, args.entry)),
    dist: path.normalize(path.resolve(__dirname, args.dist)),
    delete: args.delete,
}
const arr = []

const readdirAsync = promisify(readdir)
const lstatAsync = promisify(lstat)
const mkdirAsync = promisify(mkdir)

/*function copyCurrentFile (input, output, isEmptyFolder = false) {
    if (isEmptyFolder) return
    const fileNameWithExtension = path.basename(input)
    const extension = path.extname(input)
    const fileName = path.basename(fileNameWithExtension, extension)
    const destinationFolder = path.resolve(output,fileName[0].toUpperCase())
    lstatAsync(destinationFolder)
        .then((stats) => {
            if (stats.isDirectory()) {
                copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension)} )
            } else {
                console.log('Something is wrong with destinationFolder creating')
            }
        })
        .catch(() => {
            mkdirAsync(destinationFolder)
                .catch((err) => {
                    if (err.code === errorCode.ALREADY_EXISTS) {
                        copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension)} )
                    } else {
                        throw new Error(`something went wrong while ${destinationFolder} folder creating`)
                    }
                })
            copyFileUtil({input, output: path.resolve(destinationFolder, fileNameWithExtension)})
          })

}*/

async function copyCurrentFile (input, output) {
    const fileNameWithExtension = path.basename(input)
    const extension = path.extname(input)
    const fileName = path.basename(fileNameWithExtension, extension)
    const destinationFolder = path.resolve(output,fileName[0].toUpperCase())
    try {
        const stats = await lstatAsync(destinationFolder)
        if (stats.isDirectory()) {
            await copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension), arr} )
        } else {
            console.log('Something is wrong with destinationFolder creating')
        }
    } catch (e) {
        try {
           await mkdirAsync(destinationFolder)
           await copyFileUtil({input, output: path.resolve(destinationFolder, fileNameWithExtension), arr})
        } catch (e) {
            if (e.code === errorCode.ALREADY_EXISTS) {
                await copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension), arr} )
            } else {
                throw new Error(`something went wrong while ${destinationFolder} folder creating`)
            }
        }
    }
}
/*async function reader(src) {
     return readdirAsync(src)
        .then((files) => {
            lstatAsync(config.dist)
                .catch((err) => {
                    if (err) {
                        mkdir(config.dist, (err) => {
                            if (err) throw new Error(`something went wrong while ${config.dist} directory creating`)
                        })
                    }
                    // if the folder already exist we copy files there one more time avoiding duplicating names
                })
            if (!files.length) {
                copyCurrentFile(null,null, true)
            }

            files.forEach((file) => {
                const currentPath = path.resolve(src, file)
                console.log(currentPath)
                lstatAsync(currentPath)
                    .then(async (stats) => {
                        if (stats.isDirectory()) {
                            await reader(currentPath)
                        } else {
                            copyCurrentFile(currentPath, config.dist)
                        }
                    })
            })
        })
        .catch((err) => err)

}*/

async function reader(src) {
    const files = await readdirAsync(src)
    try {
        await lstatAsync(config.dist)
    } catch (e) {
        await mkdirAsync(config.dist)
            // .catch(() => (throw new Error(`something went wrong while ${config.dist} directory creating`)))
    }
    if (!files.length) {
        throw new Error(`No files in folder`)
    }
    files.forEach(async (file) => {
        const currentPath = path.resolve(src, file)
        console.log(currentPath)
        const stats = await lstatAsync(currentPath)
        if (stats.isDirectory()) {
            await reader(currentPath)
        } else {
            await copyCurrentFile(currentPath, config.dist)
            console.log('currentPath', currentPath)
        }
    })
}

(async () => {
    try {
        await reader(config.entry)
        Promise.all(arr).then(() => console.log('DONE'))
        // console.log('DONE')
    } catch (e) {
    console.log('Something went wrong', e)}
})()

