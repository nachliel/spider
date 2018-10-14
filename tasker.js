'use strict';
// Begin reading from stdin so the process does not exit.
process.stdin.resume();
const fs = require('fs');
console.log(':: Process ignite');
// Queue Tasks:
let siteQueue = [];
let siteExec = [];
const pageCrawler = require('./pageCrawler');
let index = 0;
// load Queue from Files and Database:
fs.readFile('sites_queue.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
        process.exit(1);
    }
    else {
        siteQueue = JSON.parse(data);
        /*
        db.sites.find(function(err, docs) {
            if (err) {
                console.log(error);
                console.log('exit');
                proccess.exit(1);
            }
            let i = 0;
            /*
            docs.forEach(function(doc) {
                i++;
                console.log(doc.url);
                siteExec.push(doc.url);

                if (i === docs.length) {
                    // Finish load Program:

                    console.log('Load files complete.');
                    //startMachine();
                    if (setURL())
                        pageCrawler.requestHttp();
                }
            });

        });

        if (setURL())
            pageCrawler.requestHttp();
            */
        starter();
    }
});


/*
pageCrawler.events.on(pageCrawler.eventNames.badStatusCode, e => {
    console.log(':: Bad status code: ' + e.statusCode + ', at url: ' + e.url);
});

pageCrawler.events.on(pageCrawler.eventNames.urlRejected, e => {
    console.log(':: URL rejected: ' + e.url);
});

pageCrawler.events.on(pageCrawler.eventNames.urlRepeated, e => {
    console.log(':: URL already visited: ' + e.url);
});

pageCrawler.events.on(pageCrawler.eventNames.badContentType, e => {
    console.log(':: Bad content type: ' + e.contentType + ', at url: ' + e.url);
});

pageCrawler.events.on(pageCrawler.eventNames.requestCompleted, e => {
    console.log(':: Successfully crawled: ' + e.url);
    loadURLStack(e.links);
    if (setURL())
        pageCrawler.requestHttp();
    else
        console.log('No more Links');
});
*/

// load the URL if the url o.k then will continue to read.
function setURL() {
    while(siteQueue[0] !== undefined) { //!!!! undefined without ''
        let url = siteQueue.shift();
        siteExec.push(url);
        if (pageCrawler.setPageUrl(url))
            return true;
    }
    // empty url queue:
    return false;
}

function loadURLStack(links) {
    for(let i = 0; i < links.length; i++) {
        let siteUnCrawled = true;
        for (let executedSite of siteExec) {
            if (executedSite === links[i].link) {
                siteUnCrawled = false;
                break;
            }
        }
        if (siteUnCrawled) {
            siteQueue.push(links[i].link);
            console.log('New site to Queue: ' + links[i].link);
        }
    }
}

function starter() {
        pageCrawler.setPageUrl(siteQueue[index]);
        pageCrawler.requestHttp((links)=> {
            loadURLStack(links);
            console.log('site: ' + siteQueue[index] + ' Finished Crawled, With ' + links.length + ' sites added.');
            index++;
            starter();
        });

}

function starter2(callback) {
    function report() {

        if (setURL()) {
            startProcess(report);
        }
        else {

            callback();
        }
    }
    // instead of starting all the iterations, we only start the 1st one
    if (setURL())
        startProcess(report);
    else
        console.log('Failed to start SpiderPage');
}

function startProcess(callback) {
    pageCrawler.start((data) =>{
        loadURLStack(data.links);
        console.log('finish');
        callback();
    });
}
/*
function startMachine() {
    starter(() => {
        console.log('finish?');
    });
}

function starter(callback) {
    function report() {

        if (setURL()) {
            startProcess(report);
        }
        else {

            callback();
        }
    }
    // instead of starting all the iterations, we only start the 1st one
    if (setURL())
        startProcess(report);
    else
        console.log('Failed to start SpiderPage');
}


function startProcess(callback) {
    pageCrawler.start((data) =>{
        let newSites = data.sites;
        //console.log(newSites);
        for(let i = 0; i < newSites.length; i++) {
            let siteUnCrawled = true;
            for (let executedSite of siteExec) {
                if (executedSite === newSites[i].link) {
                    siteUnCrawled = false;
                    break;
                }
            }
            if (siteUnCrawled) {
                siteQueue.push(newSites[i].link);
                console.log('New site to Queue: ' + newSites[i].link);
            }
        }
        console.log('finish');
        callback();
    });
}

process.on('message', message => {
    console.log('message from parent:', message);
});
*/