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

function addLastFailureInfo(failures) {
    for (var i = 0; i < failures.length; i++) {
        var lastFailedBuild = _.max(failures[i].builds, "timestamp");
        failures[i].lastFailureDate = formatDateToIso(new Date(lastFailedBuild.timestamp));
        failures[i].isNew = lastFailedBuild.timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return failures;
}

function addBuildInfo(builds) {
    for (var i = 0; i < builds.length; i++) {
        builds[i].date = formatDateToIso(new Date(builds[i].timestamp));
        builds[i].isNew = builds[i].timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return builds;
}

function documentedFailuresFilter(failure) {
    return failure.jiraIssueKey !== null;
}

function formatDateToIso(date) {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

module.exports = function(failuresMap) {
    var deferred = q.defer();
    var failuresArray = _.values(failuresMap);
    var documentedFailures = addLastFailureInfo(_.filter(failuresArray, documentedFailuresFilter));
    var undocumentedBuilds = addBuildInfo(failuresMap.other.builds);

    var context = {
        currentDate: new Date(),
        documentedFailures: documentedFailures,
        undocumentedBuilds: undocumentedBuilds,
        jenkinsURL: process.env.JENKINS_URL
    };

    nunjucks.configure(templatePath)
	.addGlobal("currentDate", formatDateToIso(new Date()))
	.addGlobal("documentedFailures", documentedFailures)
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
