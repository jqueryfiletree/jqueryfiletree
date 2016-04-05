/**
*	jQuery File Tree Node.js Connector
*	Version 1.0
*	wangpeng_hit@live.cn
*	21 May 2014
*/
var fs = require('fs');

var _getDirList = function(request, response) {
	var dir = request.body.dir;
	var r = '<ul class="jqueryFileTree" style="display: none;">';
   	try {
       	r = '<ul class="jqueryFileTree" style="display: none;">';
		var dirDecoded = decodeURIComponent(dir);
		var files = fs.readdirSync(dirDecoded);
		files.forEach(function(f){
			var ff = dirDecoded + decodeURIComponent(f);
			var ffEncoded = dir + encodeURIComponent(f);
			var stats = fs.statSync(ff);
            if (stats.isDirectory()) { 
                r += '<li class="directory collapsed"><a href="#" rel="' + ffEncoded + '/">' + f + '</a></li>';
            } else {
            	var e = f.split('.')[1];
             	r += '<li class="file ext_' + e + '"><a href="#" rel='+ ffEncoded + '>' + f + '</a></li>';
            }
		});
		r += '</ul>';
	} catch(e) {
		r += 'Could not load directory: ' + dirDecoded;
		r += '</ul>';
	}
	response.send(r)
};

module.exports.getDirList = _getDirList;