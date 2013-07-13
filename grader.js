#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var restler = require('restler');
var sys = require('util');

var program = require('commander');
var cheerio = require('cheerio');
var FILEURL_DEFAULT = "http://vast-ocean-2974.herokuapp.com";
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-u, --url   <command_url>', 'Url for a html_file')
        .option('-f, --file    <html_file>', 'Path to index.html')
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);

    if (program.url){ 
    	var file_url = program.url;
	console.log('URL Specified: ' + file_url);

	var filename = "download.html";
	restler.get(file_url, {
		}).on('complete', function(data){
			if(data instanceof Error){
				sys.puts('Error: ' + data.message);
			}else{
				fs.writeFile('./' + filename, data, function(err, data){
    var checkJson = checkHtmlFile(html_file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
				})
			}
		});
    	var html_file = filename;
    }
    else if (program.file){ 
	console.log('FILE Specified');
    	var html_file = program.file;
	assertFileExists(html_file);

    var checkJson = checkHtmlFile(html_file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
