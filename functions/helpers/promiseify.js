const promiseify = (fn) => {
    return (...args) => new Promise((resolve, reject) => {
        fn(...args, (err, ...out) => {
            if (err) {
                err.args = args
                err.out = out
                console.error(err, out)
                reject(err)
            } else {
                resolve(out)
            }
        })
    })
}

module.exports = promiseify
