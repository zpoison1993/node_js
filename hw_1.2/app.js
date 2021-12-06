const dotenv = require('dotenv')
dotenv.config()
const http = require('http')
const { handleCoreFunctionality } = require('./core')
const {
    getDateInUTC,
    transformTimeToMs,
    setIntervalAsync,
    handleActionsAfterTimeout,
} = require('./helpers')

const PORT = process.env.PORT || 3000
const INTERVAL = process.env.INTERVAL || 1
const TIMEOUT = process.env.TIMEOUT || 10

const server = http.createServer((req, res) => {
    console.log(`Current METHOD ${req.method} at URL ${req.url}`)

    const loggingInterval = transformTimeToMs(INTERVAL)
    const loggingTimeout = transformTimeToMs(TIMEOUT)

    const handleResponse = () => {
        console.log('logging finished at', getDateInUTC())
        res.statusCode = 200
        res.setHeader('Content-Type', 'html')
        res.end(`<h1>GET request has been resolved successfully at: ${getDateInUTC()}</h1>`)
    }
    switch (req.url) {
        case '/':
            setIntervalAsync(loggingInterval, handleCoreFunctionality)
                .then(() => handleActionsAfterTimeout(loggingTimeout, handleResponse))
            break
        default:
            res.end('')
    }
})

server.listen(Number(PORT),'localhost', (error) => {
    error
        ? console.log(error)
        : console.log(`listening port ${PORT} with interval ${INTERVAL} seconds and timeout ${TIMEOUT} seconds`)
})
