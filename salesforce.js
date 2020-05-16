"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'https://localhost:8200/oauth/_callback',
    environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default *Added to test if this will resolve 'instance_url' error
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findProperties = (params) => {
    return ("good", "bad");
    /*let where = "";
    return new Promise((resolve, reject) => {
        let q = `select ID, Delivery_date__c from order where id = '8011I000000fwTYQAY'`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp.records);
            }
        });
    });*/

};

let frindEmailCount = (params) => {
    let where = "";
    return new Promise((resolve, reject) => {
        let q = `select ID, emails_sent__c from order where id = '8011I000000fwTYQAY'`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findPriceChanges = () => {
    let where = "";
    return new Promise((resolve, reject) => {
        let q = `select ID, emails_sent__C from Account where ID = '0011I00000QTYa1QAH'`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp.records);
            }
        });
    });
};


let createCase = (propertyId, customerName, customerId) => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Case');
        c.set('subject', `Contact ${customerName} (Facebook Customer)`);
        c.set('description', "Facebook id: " + customerId);
        c.set('origin', 'Facebook Bot');
        c.set('status', 'New');
        c.set('Property__c', propertyId);

        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });

};

login();

exports.org = org;
exports.findProperties = findProperties;
exports.frindEmailCount = frindEmailCount;
exports.findPriceChanges = findPriceChanges;
exports.createCase = createCase;
