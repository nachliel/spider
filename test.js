/*const path = require('path');
const fork = require('child_process').fork;
const program = path.resolve('other.js');

const stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    console.log("you entered: [" +
        d.toString().trim() + "]");
    const child = fork(program, [d], {
        silent: false
    });
});
//const child = fork(program);
*/
/*
function getDomain(url) {
    let match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        let result = match[1];
        if ((match[1].match(/\./g) || []).length > 2){
            console.log('here' + match[1]);
            result = match[1].match(/^([0-9\-A-Za-z]+)\.([0-9.\-A-Za-z]+)/im);
            return result[2];
        }
        return result;
    }
    else
        return '';
}
console.log(getDomain('acme.org.il'));
const URL = require('url-parse');
const ur = URL('ynet.co.il');
console.log(ur.protocol);
if (ur.protocol === '')
    ur.set('protocol','https:');
console.log(ur);
let parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
console.log(parse_url.test('www.acme.org.il'));
//let regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
const regex = /^(https?:\/\/(www\.)?|www\.)?([0-9A-Za-z-\.]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
if(regex.test("https://haaretz.com")){
    console.log("Successful match");
}else{
    console.log("No match");
}

*/


function createCounter(value) {
    return function (cb) {
        console.log(value++);
        cb();
    };
}

const count = createCounter(1);

function loopme() {
    setTimeout(function() {
        count(loopme);
    }, 3000);
}

loopme();