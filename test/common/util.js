
function param (obj) {
    if (typeof obj !== 'object') {return '';}
    var arr = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i + '=' + obj[i]);
        }
    }
    return arr.join('&');
}

module.exports.param = param;