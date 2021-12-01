const getDateInUTC = () => new Date().toUTCString()

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
module.exports.setIntervalAsync = setIntervalAsync
module.exports.handleActionsAfterTimeout = handleActionsAfterTimeout
