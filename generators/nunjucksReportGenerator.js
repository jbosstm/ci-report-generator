var _ = require("underscore");
var nunjucks  = require('nunjucks');
var fs = require("fs");
var q = require("q");

var reportPath = __dirname + "/../dist/report.html";
var templatePath = __dirname + "/../template/report.template";
var weekMilliseconds = 604800000;

function writeToFile(path, content) {
    var deferred = q.defer();

    fs.writeFile(path, content, function(error) {
        if(error) {
            throw new Error(error);
        }

        deferred.resolve();
    });

    return deferred.promise;
}

function addBuildInfo(builds) {
    for (var i = 0; i < builds.length; i++) {
        builds[i].date = formatDateToIso(new Date(builds[i].timestamp));
        builds[i].isNew = builds[i].timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return builds;
}

function formatDateToIso(date) {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

module.exports = function(failuresMap) {
    var deferred = q.defer();
    var failuresArray = _.values(failuresMap);
    var undocumentedBuilds = addBuildInfo(failuresMap.builds);

    nunjucks.configure(templatePath)
	.addGlobal("currentDate", formatDateToIso(new Date()))
	.addGlobal("undocumentedBuilds", undocumentedBuilds)
	.addGlobal("jenkinsURL", process.env.JENKINS_URL)
	.render("", function(error, content) {
        if (error) {
            throw new Error(error);
        }

        writeToFile(reportPath, content)
            .then(function() {
                Deferred.resolve();
            });
    });

    return deferred.promise;
};
