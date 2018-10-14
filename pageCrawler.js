/*

 crawler.js
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Duty: To crawl ONE URL and fetch data.
 Parameters: URL

 */
'use strict';
const request = require('request');
//const Events = require('events');
const cheerio = require('cheerio');
const URL = require('url-parse');

module.exports = (function () {
    /*
            Construct module: Read site
     */
    let parsedPageUrl;

    // Site Structure
    const site = {
        url: '',
        title: '',
        relativeLinks: [],
        absoluteLinks: [],
        linkedSites: [],
        timestamp: 0
    };

    const eventNames = {
        badContentType: 'bad-content-type',
        requestCompleted: 'request-completed',
        urlRepeated: 'url-repeated',
        urlRejected: 'url-rejected',
        badStatusCode: 'bad-status-code',
        requestError: 'request-error'
    };

    const urlRegex = /^(https?:\/\/(www\.)?|www\.)?([0-9A-Za-z-.]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;

    //const events = new Events.EventEmitter();
    //events.setMaxListeners(0);
    /*
            Functions
     */

    /**
     * Set url of module.
     * @param url
     */
    function setURL(url) {
        // Check URL
        if (validateUrl(url)) {
            parsedPageUrl = URL(url);
            if (parsedPageUrl.protocol === '')
                parsedPageUrl.set('protocol','https:');
            //TODO: CHECK WHEN TO PUT HTTPS / HTTP !WARNING!
            site.url = getDomain(parsedPageUrl.href);
            site.title = '';
            site.relativeLinks = [];
            site.absoluteLinks = [];
            site.linkedSites = [];
            return true;
        }
        else
            return false;
    }

    /**
     * Check url address for request
     * @param url
     * @returns {boolean}
     */
    function validateUrl(url) {
        return urlRegex.test(url);
    }


    /**
     * Read the page. return status code.
     */
    function requestHttp(callback) {
        // Start Reading site
        console.log('Request Site: ' + parsedPageUrl.href);
        request(parsedPageUrl.href, function (error, response, body) {
            console.log('request started...');
            if (error) {
                // On error note a error flag near the address and push it to last in queue.
                site.timestamp = Date.now();
                //events.emit(eventNames.requestError, {url: parsedPageUrl.href});
                return;
            }

            // Check status code (200 is HTTP OK)
            console.log("Status code: " + response.statusCode);
            if (response.statusCode === 200) {

                harvestHttp(body);
                //events.emit(eventNames.requestCompleted, {url: parsedPageUrl.href, links:site.linkedSites});
                callback(site.linkedSites);
                return true;
            }

            else {
                //404?!
                // On error note a error flag near the address and push it to last in queue.
                //TODO: Switch on every status code.

                //events.emit(eventNames.badStatusCode, {url: parsedPageUrl.href, statusCode: res.statusCode});
                return;
            }
        });
    }


    // Parse the document body
    function harvestHttp(body) {
        let $ = cheerio.load(body);

        site.title = $('title').text() || '';
        collectInternalLinks($);
        collectSitelinks();

        site.timestamp = Date.now();
    }

    /**
     * search for word in body. unused meanwhile
     * TODO: REMOVE OR ELABORATE.
     * @param $
     * @param word
     * @returns {boolean}
     */
    function searchForWord($, word) {
        let bodyText = $('html > body').text();
        return bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1;

    }

    /**
     * Get url and returns domain only https://www.acme.org.il/unrelated/links -> acme.org.il
     * @param url
     * @returns {*} url containL domain name only. string.
     */
    function getDomain(url) {
        let match;
        if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
            let result = match[1];
            if ((match[1].match(/\./g) || []).length > 2){
                result = match[1].match(/^([0-9\-A-Za-z]+)\.([0-9.\-A-Za-z]+)/im);
                return result[2];
            }
            return result;
        }
        else
            return '';
    }

    /**
     * Collect all the links in page.
     * Absolute links and Relative links
     * @param $
     */
    function collectInternalLinks($) {
        let relativeLinks = $("a[href^='/']");
        relativeLinks.each(function () {
            let linkName = '';
            if (/^<space>*/.test($(this).text())) {
                if (($(this).children('img').attr('alt') || '').length === 0)
                    linkName = $(this).children('img').attr('alt') || '';
                else
                    linkName = $(this).children('img').attr('alt') || '';
            }
            else {
                linkName = $(this).text();
            }
            site.relativeLinks.push({
                name: linkName,
                link: $(this).attr('href')
            });

        });

        let absoluteLinks = $("a[href^='http']");
        absoluteLinks.each(function () {
            let linkName = '';
            if (/^<space>*/.test($(this).text())) {
                if (($(this).children('img').attr('alt') || '').length === 0)
                    linkName = $(this).children('img').attr('alt') || '';
                else
                    linkName = $(this).children('img').attr('alt') || '';
            }
            else {
                linkName = $(this).text();
            }
            let flagNotDuplicate = true;
            for (let i = 0; i < site.absoluteLinks.length; i++) {
                if (site.absoluteLinks[i].link === $(this).attr('href')) {
                    flagNotDuplicate = false;
                    // Check if it has a name...
                    if (site.absoluteLinks[i].name !== '')
                        site.absoluteLinks[i].name = linkName;

                    break;

                }
            }
            if (flagNotDuplicate) {
                site.absoluteLinks.push({
                    name: linkName,
                    link: $(this).attr('href')
                });
            }
        });
    }

    /**
     * Collecting all unique website links in page.
     * store them in site.linkedSites
     * and Score them by magnitude.
     * magnitude is the number of times the site accrues in page.
     */
    function collectSitelinks() {
        console.log('Search for New Sites in links...');

        for (let i = 0; i < site.absoluteLinks.length; i++) {
            let linkURL = getDomain(site.absoluteLinks[i].link);
            let linkName = site.absoluteLinks[i].name;
            let notDuplicateFlag = true;
            for(let j = 0; j < site.linkedSites.length; j++) {
                if (site.linkedSites[j].link === linkURL) {
                    notDuplicateFlag = false;
                    site.linkedSites[j].magnitude++;
                    break;
                }
            }
            if (notDuplicateFlag) {
                site.linkedSites.push( {
                    name : linkName,
                    link : linkURL,
                    magnitude: 1
                });
            }
        }
        console.log('Site Connected to: ' + site.linkedSites.length + ' sites.');
        //console.log(site.linkedSites);
    }
    return {
        siteData : site,
        requestHttp : requestHttp,
        setPageUrl : setURL,
        eventNames : eventNames
    }
})();