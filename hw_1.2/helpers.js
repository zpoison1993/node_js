const getDateInUTC = () => new Date().toUTCString()

// transformTimeToMs converts semantic seconds in process.env variables into numbers in milliseconds
const transformTimeToMs = (timeValueInSeconds) => Number(timeValueInSeconds) * 1000

const setTimeoutAsync = ms => new Promise(resolve => setTimeout(resolve, ms))

let intervalId = 0
const setIntervalAsync =
    (ms, func) => new Promise(
        resolve => {
            intervalId = setInterval(func, ms)
            setTimeoutAsync(ms).then(resolve)
        }
    )

const handleActionsAfterTimeout =
    (timeout, getResponseCallback) => new Promise(
        resolve => resolve(setTimeout(() => {
            clearInterval(intervalId)
            getResponseCallback()
        }, timeout))
    )

module.exports.getDateInUTC = getDateInUTC
module.exports.transformTimeToMs = transformTimeToMs
module.exports.setIntervalAsync = setIntervalAsync
module.exports.handleActionsAfterTimeout = handleActionsAfterTimeout
