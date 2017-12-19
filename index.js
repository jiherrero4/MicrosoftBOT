/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var apiaiRecognizer = require('./apiai_recognizer');
var menus = require('./salas');
var peticion_preventa = require('./peticion_preventa');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
    //stateEndpoint: process.env.BotStateEndpoint,
    //openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
//server.post('/api/messages', connector.listen());
server.post('/', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);


/*  ************************************************************** LUIS MODEL ******************************************************************************************

// Make sure you add code to validate these fields
//var luisAppId = process.env.LuisAppId;
//var luisAPIKey = process.env.LuisAPIKey;
//var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

//const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;



const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6a13aa8f-1ae3-4ceb-baff-1ecb4a98726e?subscription-key=7a8cc728767249589b45b66f34adcdcf&timezoneOffset=0&verbose=true&q=';


// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
    
    //.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
    
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
*/
//*********************************************************************** API AI MODEL ***************************************************************************
var intents = new builder.IntentDialog({
    recognizers: [
        apiaiRecognizer
    ],
    intentThreshold: 0.2,
    recognizeOrder: builder.RecognizeOrder.series
});

intents.matches('salas.tipologia', '/salas.tipologia');
intents.matches('peticion.preventa', '/peticion.preventa');
intents.matches('informacion.endpoints', '/informacion.endpoints');
intents.matches('restaurant.location', '/restaurant.location');
intents.matches('restaurant.timings', '/restaurant.timings');

bot.dialog('/', intents);

// Intent: restaurant.menus
bot.dialog('/salas.tipologia', [
    function (session, args, next) {
        var cards = [];

        menus.forEach(function (menu) {
            var card = new builder.HeroCard(session)
                .title(menu.name)
                .subtitle(menu.subtitle)
                .text(menu.text)
                .images([
                    builder.CardImage.create(session, menu.image)
                ])
                .buttons([
                    builder.CardAction.openUrl(session, menu.url, 'Mas Informacion')
                ]);

            cards.push(card);
        })

        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.endDialog(reply);
    }
]);

// Intent: peticion.preventa
bot.dialog('/peticion.preventa', [
    function (session, args, next) {
        var cards = [];

        peticion_preventa.forEach(function (peticion) {
            var card = new builder.HeroCard(session)
                .title(peticion.name)
                .subtitle(peticion.subtitle)
                .text(peticion.text)
                .images([
                    builder.CardImage.create(session, peticion.image)
                ])
                .buttons([
                    builder.CardAction.openUrl(session, peticion.url, 'Pedir recurso')
                ]);

            cards.push(card);
        })

        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.endDialog(reply);
    }
]);

// Intent: informacion.endpoints
bot.dialog('/informacion.endpoints', [
    function (session, args) {
        var model = builder.EntityRecognizer.findEntity(args.entities, 'Modelo_Videoconferencias');
        if (model) {
            var model_name = model.entity;
            session.send("Se ha solicitado informacion del modelo" + model_name);
           
        } else {
            builder.Prompts.text(session, 'Cual es el modelo solicitado?');
        }
    },
    function (session, results) {
        var model_name = results.response;
        session.send("Se ha solicitado informacion del modelo" + model_name);
        });
    }
]);
// Intent: restaurant.location
bot.dialog('/restaurant.location', [
    function (session, args, next) {
        session.endDialog('You can find us at San Francisco 987, Santiago.');
    }
]);

// Intent: restaurant.timings
bot.dialog('/restaurant.timings', [
    function (session, args, next) {
        session.endDialog('We are open Monday to Friday from 2 PM to 11 PM.');
    }
]);





