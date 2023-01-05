import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()



const token = process.env.BEARER;
const consumer_key = process.env.API_KEY;
const consumer_secret = process.env.API_KEY_SECRET;

console.log(token)
console.log(consumer_key)
console.log(consumer_secret)