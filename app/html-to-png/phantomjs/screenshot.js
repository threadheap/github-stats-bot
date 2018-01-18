'use strict';

var system = require('system');

var html = system.args[1];
var width = system.args[2];
var height = system.args[3];

var page = require('webpage').create();

page.viewportSize = { width: Number(width), height: Number(height) };
page.clipRect = { width: Number(width), height: Number(height) };

page.onLoadFinished = function (status) {
    try {
        if (status !== 'success') {
            return phantom.exit(1)
        }

        system.stdout.write('data:image/png;base64,' + page.renderBase64('PNG'));
        phantom.exit();
    } catch(err) {
        console.error(err)
        phantom.exit(1);
    }
}

page.setContent('<!DOCTYPE html>' + decodeURI(html), 'http://example.com');

setTimeout(function () {
    phantom.exit(1)
}, 500);
