var apiai = require('apiai');

var app = apiai('955aee67cb244a6f8167943383876ca0');

module.exports = {
    recognize: function (context, callback) {
        var request = app.textRequest(context.message.text, {
            sessionId: Math.random()
        });

        request.on('response', function (response) {
            var result = response.result;

            callback(null, {
                intent: result.metadata.intentName,
                score: result.score
            });
        });

        request.on('error', function (error) {
            callback(error);
        });

        request.end();
    }
};