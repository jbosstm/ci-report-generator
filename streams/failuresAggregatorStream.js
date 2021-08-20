var through = require("through2");
var _ = require("underscore");

var failures = {
    builds: []
};

function transform(build, encoding, callback) {
    console.log("Aggregating " + build.jobName + " build " + build.number);

    failures.builds.push(build);

    return callback();
}

function flush(callback) {
    this.push(failures);
    callback();
}

module.exports = through.obj(transform, flush);
