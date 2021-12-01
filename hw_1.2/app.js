const http = require('http')
const yargs = require('yargs')
const { handleCoreFunctionality } = require('./core')
const { getDateInUTC, setIntervalAsync, handleActionsAfterTimeout } = require('./helpers')

const args = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('1.0.1')
    .alias('version', 'v')
    .example('node $0 --interval 2 --timeout 10 --port 3000')
    .option('interval', {
        alias: 'i',
        describe: 'Configuring interval',
        default: '1'
    })
    .option('timeout', {
        alias: 't',
        describe: 'Configuring timeout',
        default: '15'
    })
    .option('port', {
        alias: 'p',
        describe: 'Configuring port',
        default: '3000'
    })
    .epilog('Homework 1.2')
    .argv

const config = {
    interval: Number(args.interval) * 1000,
    timeout: Number(args.timeout) * 1000,
    port: args.port,
}

const server = http.createServer((req, res) => {
    console.log(`Current METHOD ${req.method} at URL ${req.url}`)
    const handleResponse = () => {
        console.log('logging finished at', getDateInUTC())
        res.statusCode = 200
        res.setHeader('Content-Type', 'html')
        res.end(`<h1>GET request has been resolved successfully at: ${getDateInUTC()}</h1>`)
    }
    switch (req.url) {
        case '/':
            setIntervalAsync(config.interval, handleCoreFunctionality)
                .then(() => handleActionsAfterTimeout(config.timeout, handleResponse))
            break
        default:
            res.end('')
    }
})

server.listen(config.port,'localhost', (error) => {
    error
        ? console.log(error)
        : console.log(`listening port ${config.port} with interval ${config.interval} and timeout ${config.timeout}`)
})
