'use strict';

const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');

module.exports = ( function(){

    const urlRegex = /^(https?:\/\/(www\.)?|www\.)?([0-9A-Za-z-.]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
    let urlHistory = new Set();

    let siteURL = '';
    let urlList = new Set();


    // An url Validator
    function urlValidator(url) {
        return urlRegex.test(url);
    }

    // set url
    function setURL(url) {
        if (urlValidator(url)) {
            siteURL = URL(url);
            if (siteURL.protocol === '')
                siteURL.set('protocol','https:');
            urlList = new Set();
            return true;
        }
        else
            return false;
    }

    // check if url is already crawled
    function isURLCrawled(url) {
        return urlHistory.has(url);
    }

    // requestHttp
    function requestHttp() {
        urlHistory.add(siteURL);
        request(siteURL.href, function (error, response, body) {
            if (error) {
                // On error note a error flag near the address and push it to last in queue.
                return false;
            }
            if (response.statusCode === 200) {
                harvestHttp(body);
                return true;
            }
            else {
                return false;
            }
        });
    }

    // Get Links linker with cheerio
    // Parse the document body
    function harvestHttp(body) {
        const $ = cheerio.load(body);
        const $linkElements = $('a');

        $linkElements.each((index, element) => {
            const href = element.attribs.href;

            if (typeof href !== 'string') {
                return;
            }

            if (href.startsWith('http://')) {
                urlList.add(href);
            }
        });
    }
    return {
        setNewUrl : setURL,
        crawl : requestHttp,
        links : urlList
    }
})();

