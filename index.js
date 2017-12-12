/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
<<<<<<< HEAD
    //stateEndpoint: process.env.BotStateEndpoint
=======
    //stateEndpoint: process.env.BotStateEndpoint,
>>>>>>> origin/master
    //openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
//var luisAppId = process.env.LuisAppId;
//var luisAPIKey = process.env.LuisAPIKey;
//var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

//const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6a13aa8f-1ae3-4ceb-baff-1ecb4a98726e?subscription-key=7a8cc728767249589b45b66f34adcdcf&timezoneOffset=0&verbose=true&q=';


// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
    /*
    .matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
    */
    .matches('Saludo', (session, args) => {
        session.send('greet found by luis');
        console.log(args);
    })
    .matches('Test', (session, args) => {
        session.send('probando');
        var url = 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png';
        sendInternetUrl(session, url, 'image/png', 'BotFrameworkOverview.png');
        console.log(args);
    })

    .onDefault((session) => {
        console.log('PASO1');
        session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    });

// Sends attachment using an Internet url
function sendInternetUrl(session, url, contentType, attachmentFileName) {
    var msg = new builder.Message(session)
        .addAttachment({
            contentUrl: url,
            contentType: contentType,
            name: attachmentFileName
        });

    session.send(msg);
}

bot.dialog('/', intents);


