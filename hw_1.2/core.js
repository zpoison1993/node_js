const { getDateInUTC } = require('./helpers')

const processingLogging = () => {
    console.log('logging: ', getDateInUTC())
}
const handleCoreFunctionality = () => new Promise(
    (resolve) => (resolve(processingLogging()))
)

module.exports.handleCoreFunctionality = handleCoreFunctionality
