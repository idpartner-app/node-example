# IDPartner Node Demo
A demo of a Relying Party integrating with IDPartner

## Getting started

### Create IDPartner Account

Start by setting up an account and creating an application. https://docs.idpartner.com/documentation/getting-started/onboarding-account

### Install ngrok

It is required for the callback url to be https. The easiest way to expose an HTTPS endpoint that you can use locally is via [ngrok](https://ngrok.com)

### Run the demo

These are the steps for running the IDPartner node demo:

Clone the demo git repository:

```sh
git clone https://github.com/idpartner-app/rp-example.git
```

Install the project

```sh
yarn install
```


Start the application

```sh
yarn start
```

### Update Client ID

After creating an IDPartner account and application a client id will be generated. There are two places you need to update

1. [Update CHANGE_ME_CLIENT_ID in custom html](./views/index.ejs.md)
1. [Update CHANGE_ME_CLIENT_ID in confidential client](./routes/index.js)
1. [Update callback url in confidential client](./routes/index.js)

