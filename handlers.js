"use strict";

let salesforce = require("./salesforce");

exports.SearchHouses = (slots, session, response) => {
//    session.attributes.stage = "ask_city";
//    response.ask("OK, in what city?");
        salesforce.findProperties()
            .then(properties => {
                if (properties && properties.length>0) {
                    let text = `OK, your order is expected delivery on `;
                    properties.forEach(property => {
                        text += `${property.get("Delivery_date__c")}. <break time="0.5s" /> `;
                    });
                    response.say(text);
                } else {
                    response.say(`Sorry, I didn't find any that.`);
                }
            })
            .catch((err) => {
                console.error(err);
                response.say("Oops. Something went wrong");
            });
};

exports.EmailCount = (slots, session, response) => {
//    session.attributes.stage = "ask_city";
//    response.ask("OK, in what city?");
        salesforce.countEmails()
            .then(properties => {
                if (properties && properties.length>0) {
                    let text = `OK, your order is expected delivery on `;
                    properties.forEach(property => {
                        text += `${property.get("Delivery_date__c")}. <break time="0.5s" /> `;
                    });
                    response.say(text);
                } else {
                    response.say(`Sorry, I didn't find any that.`);
                }
            })
            .catch((err) => {
                console.error(err);
                response.say("Oops. Something went wrong");
            });
};

exports.AnswerCity = (slots, session, response) => {
    if (session.attributes.stage === "ask_city") {
        session.attributes.city = slots.City.value;
        session.attributes.stage = "ask_bedrooms";
        response.ask("How many bedrooms?");
    } else {
        response.say("Sorry, I didn't understand that");
    }
};

exports.AnswerNumber = (slots, session, response) => {
    if (session.attributes.stage === "ask_bedrooms") {
        session.attributes.bedrooms = slots.NumericAnswer.value;
        session.attributes.stage = "ask_price";
        response.ask("Around what price?");
    } else if (session.attributes.stage === "ask_price") {
        let price = slots.NumericAnswer.value;
        session.attributes.price = price;
        let priceMin = price * 0.8;
        let priceMax = price * 1.2;
        salesforce.findProperties({city: session.attributes.city, bedrooms: session.attributes.bedrooms, priceMin: priceMin, priceMax: priceMax})
            .then(properties => {
                if (properties && properties.length>0) {
                    let text = `OK, here is what I found for ${session.attributes.bedrooms} bedrooms in ${session.attributes.city} around $${price}: `;
                    properties.forEach(property => {
                        text += `${property.get("Address__c")}, ${property.get("City__c")}: $${property.get("Price__c")}. <break time="0.5s" /> `;
                    });
                    response.say(text);
                } else {
                    response.say(`Sorry, I didn't find any ${session.attributes.bedrooms} bedrooms in ${session.attributes.city} around ${price}.`);
                }
            })
            .catch((err) => {
                console.error(err);
                response.say("Oops. Something went wrong");
            });
    } else {
        response.say("Sorry, I didn't understand that");
    }
};

exports.Changes = (slots, session, response) => {
    salesforce.findPriceChanges()
        .then(priceChanges => {
                if (priceChanges && priceChanges.length>0) {
                    let text = `OK, D E G sent  `;
                    priceChanges.forEach(property => {
                        text += `${property.get("emails_sent__C")}`;
                        text += ' emails last month. <break time="0.5s" />';    
                    });
                    response.say(text);
                } else {
                    response.say(`Sorry, I didn't find any that.`);
                }
            })
            .catch((err) => {
                console.error(err);
                response.say("Oops. Something went wrong");
            });
};
