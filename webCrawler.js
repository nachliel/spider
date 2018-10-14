'use strict';

const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');

const WebCrawler = ( function(){

    const urlRegex = /^(https?:\/\/(www\.)?|www\.)?([0-9A-Za-z-.]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
    let urlHistory = new Set();
    let events = new events.EventEmitter();




    // An url Validator
    function urlValidator(url) {
        return urlRegex.test(url);
    }
    // set url

    // check if url is already crawled

    // requestHttp

    // Get Links linker with cheerio


}

let a = new WebCrawler();
