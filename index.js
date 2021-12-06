const yargs = require('yargs')
const path = require('path')
const { readdir, lstat, mkdir } = require('fs')
const copyFileUtil = require('./helpers')
const { errorCode } = require('./constants')

const args = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('1.0.1')
    .alias('version', 'v')
    .example('node $0 --entry ./path --dist ./path -D')
    .option('entry', {
        alias: 'e',
        describe: 'Configuring entry path',
        demandOption: true
    })
    .option('dist', {
        alias: 'd',
        describe: 'Configuring output path',
        default: './output'
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

function copyCurrentFile (input, output, isEmptyFolder = false) {
    if (isEmptyFolder) return
    const fileNameWithExtension = path.basename(input)
    const extension = path.extname(input)
    const fileName = path.basename(fileNameWithExtension, extension)
    const destinationFolder = path.resolve(output,fileName[0].toUpperCase())
    lstat(destinationFolder, (err, stats) => {
        if (err) {
            mkdir(destinationFolder, (err) => {
                if (err) {
                    if (err.code === errorCode.ALREADY_EXISTS) {
                        copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension)} )

                    } else {
                        throw new Error(`something went wrong while ${destinationFolder} folder creating`)
                    }
                }
            })
            copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension)} )
        }
        if (stats && stats.isDirectory()) {
            copyFileUtil( {input, output: path.resolve(destinationFolder, fileNameWithExtension)} )
        }

    })
}
function reader(src) {
    readdir(src, function (err, files) {
        if (err) {
            throw err
        }
        lstat(config.dist, (err) => {
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
            lstat(currentPath, (err, stats) => {
                if (err) {
                    throw err
                }
                if (stats.isDirectory()) {
                    reader(currentPath)
                } else {
                    copyCurrentFile(currentPath, config.dist)
                }
            })
        })
    })

}

try {
  reader(config.entry)
} catch (e) {
    console.log('Something went wrong', e)
}
