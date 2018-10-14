/**
 * app.js
 * main application
 */
'use strict';
let siteQueue = ['haaretz.co.il'];
let siteExec = [];
const path = require('path');
const fork = require('child_process').fork;
const program = path.resolve('tasker.js');
const options = {
    silent: false,
    stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

const child = fork(program, [], options);

child.stdout.on('data', (data) => {
    console.log(`Worker: ${data}`);
});

child.on('close', (exitCode)=> {
    console.log('Worker Terminate. exit code: ' + exitCode);
});