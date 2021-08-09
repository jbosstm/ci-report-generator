var through = require("through2");

module.exports = through.obj(function(build, encoding, callback) {

    var jenkins = require("jenkins")(process.env.JENKINS_URL);
    var self = this;

    jenkins.build.get(build.jobName, build.number, function(error, data) {
        // console.log("Getting extra Jenkins info about " + build.jobName + " build " + build.number);

        if (error) {
            return callback(error);
        }

        build.description = data.description;
        build.result = data.result;
        build.timestamp = data.timestamp;

        callback(null, build);
    });
});
