# CigawretteBot

CigawretteBot is a Twitter bot that listens for the command "@cigawrettebot render <some phrase>" and generates an image of a cigawrette with the specified phrase. The bot then tweets the image on its Twitter account.

## Usage
To use CigawretteBot, you can mention its Twitter handle @cigawrettebot in a tweet and include the command render <some phrase> in the text. For example:

```
@cigawrettebot render Hello, world!
```

CigawretteBot will then generate an image with the phrase "Hello, world!" on it and tweet it on its account.

## Customization

You can test the text placement by editing the putLabel function in utils.js and then running 

```sh
node renderImage.js
```

## Deployment

To deploy CigawretteBot, you need to fill out the following variables in a .env file:

```toml
CONSUMER_KEY=YourTwitterAPIconsumerkey
CONSUMER_SECRET=YourTwitterAPIconsumersecret
TOKEN=YourTwitterAPIaccesstoken
TOKEN_SECRET=YourTwitterAPIaccesstokensecret
BEARER_TOKEN=YourTwitterAPIbearertoken
```

You can obtain these credentials by creating a Twitter developer account and creating a new app.

Once you have set up the .env file, you can run the bot by executing the following command:

```sh
node renderBot.js
```

This will start the bot, which will listen for incoming tweets and generate and tweet images as specified. You can run this command on a server or a hosting platform such as Heroku to keep the bot running 24/7.

## Heroku CLI

```sh
heroku login
heroku create -t cigbot
heroku local web
heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d')
git push heroku main
heroku logs --tail
```
