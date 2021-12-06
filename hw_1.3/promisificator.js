function promisify(fn) {
    return function promisified(...args) {
        return new Promise((resolve, reject) => {
            function callback(err, ...results) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(results.length < 2 ? results[0] : results)
                }
            }
            args.push(callback)
            fn.call(this, ...args)
        })
    }
}

module.exports.promisify = promisify
