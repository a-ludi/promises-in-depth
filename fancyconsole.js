function comment(str) {
    if (typeof str === 'string') {
        str = str.replace(/´([^´]+)´/g, function (match, str) {
            return '\033[4m' + str + '\033[0;32m';
        })
    }
    console.log('\033[32m// ' + str + '\033[0m');
}

function log(str) {
    console.log('\033[37m' + str + '\033[0m');
}

module.exports = {
    comment: comment,
    log: log,
    info: console.info
};