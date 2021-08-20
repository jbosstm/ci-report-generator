var config = require("./config.json");
var fromArray = require("from2-array");
var jenkinsBuildsStream = require("./streams/jenkinsBuildsStream");
var jenkinsBuildsInfoStream = require("./streams/jenkinsBuildsInfoStream");
var jenkinsFailedBuildsFilterStream = require("./streams/jenkinsFailedBuildsFilterStream.js");
var failuresAggregatorStream = require("./streams/failuresAggregatorStream.js");

fromArray.obj(config.jobs)
    .pipe(jenkinsBuildsStream)
    .pipe(jenkinsBuildsInfoStream)
    .pipe(jenkinsFailedBuildsFilterStream)
    .pipe(failuresAggregatorStream);

var nunjucksReportGenerator = require("./generators/nunjucksReportGenerator");
failuresAggregatorStream.on("data", nunjucksReportGenerator);
