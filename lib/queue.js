'use strict';

const spider = require('./spider');

let sites = ['ynet.co.il','haaretz.co.il'];

for(let i=0; i< sites.length; i++) {
   if (spider.setNewUrl(sites[i])) {
       if (spider.crawl()) {
           console.log(sites[i] + ': Crawled Successfully');
           sites.push(spider.links);
       }
       else
           console.log('I had enough');
   }
}
let i = 20;
for(let j =0; j< i;j++) {
    if (j===5)
        i = 30;
    console.log(j);
}