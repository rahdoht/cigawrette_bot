import fs from "fs";
import { loadImage } from "canvas";
import { putLabel } from "./utils.js";

const tweets = [
  "Post bear pre FTX scandal drop was a surgical incision to mimic venture bear market sale price movements as a take on round raises / simultaneously timing ensures primary minters like the art ahead of potential speculative reasons, ensuring project longevity over pop &amp; fizzle",

  // Sarcastic tweets
  "Oh wow, an NFT project based on cigarette packs? Just what the world needs, more glorification of smoking! 🚬👏",
  "I've always wanted to own a digital representation of a pack of cigarettes... said no one ever. 🤦‍♀️💻📉",
  "Finally, an NFT project that can really help people: by making them feel nostalgic for the good old days when smoking was cool. 😒💰👎",
  "Great, now we can collect virtual cigarette packs... because physical packs just aren't wasteful enough. 🤦‍♂️🌍💸",
  "Because what's the point of spending money on a virtual asset if it doesn't also contribute to lung cancer? 🤔💸🤢",

  // Ironic tweets
  "If you're looking for a way to invest your money, might I suggest an NFT project based on something truly valuable and timeless... like cigarette packs. 🤑💸💩",
  "Finally, an NFT project that embodies the timeless values of society: addiction, disease, and premature death. 😂🤣🚬💀",
  "I hear the Cigawrette Packs NFT project is going to be worth millions someday... or maybe just a few bucks if you're lucky. 😜💰💸",
  "You know what they say: smoking kills, but at least your NFT collection will live on forever. 😎🚬💻",
  "Who needs real art when you can have a digital image of a pack of cigarettes that nobody will ever care about? 🎨💻😂",

  // Shorter
  "Cigawrette Packs - where virtual smoking meets virtual art. 💨🎨",
  "Who needs a nicotine fix when you can have a Cigawrette Pack? 💻💰",
  "Just bought my first Cigawrette Pack and my wallet is already feeling lighter. 💸😭",
  "Cigawrette Packs: because why settle for a boring old stock portfolio? 📈💼",
  "I never thought I'd be excited about a virtual cigarette pack, but here we are. 🤷‍♀️💻",
  "Cigawrette Packs: the new status symbol for the virtual world. 💰💻",
  "I don't smoke in real life, but I'm addicted to collecting Cigawrette Packs. 🤑💻",
  "Cigawrette Packs: the perfect gift for that friend who has everything. 💁‍♀️💻",
  "Just when you thought you've seen it all, Cigawrette Packs come along. 🤯💻",
  "I'm not saying I'm addicted to Cigawrette Packs, but my wallet would beg to differ. 🙈💸",
];

const words = [
  "apple",
  "banana",
  "cherry",
  "orange",
  "kiwi",
  "grape",
  "melon",
  "pineapple",
  "pear",
  "peach",
  "plum",
  "watermelon",
  "strawberry",
  "blueberry",
  "raspberry",
];

for (let i = 10; i <= 1000; i += 100) {
  let tweet = "";
  while (tweet.length < i) {
    const randomWordIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomWordIndex];
    tweet += randomWord + " ";
  }
  tweet = tweet.trim(); // remove the last whitespace
  tweets.push(tweet);
}

let rand = Math.floor(Math.random() * tweets.length);
let randomTweet = tweets[rand];
console.log(randomTweet);

// const blanks = JSON.parse(fs.readFileSync("blanks.json", "utf-8"));
// let randomCig = blanks[Math.floor(Math.random() * blanks.length)];
// console.log(`using cigawrette ${randomCig}`);
// const ipfs_url =
//   "https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link";

let images = fs.readdirSync("./images");
let randomCigawette = Math.floor(Math.random() * images.length);
let chosenCig = images[randomCigawette];

// loadImage(`${ipfs_url}/${randomCig}.jpg`).then((image) => {
loadImage(`images/${chosenCig}`).then((image) => {
  putLabel(image, randomTweet);
});
