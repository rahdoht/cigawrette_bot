import fs from "fs";
import { loadImage } from "canvas";
import { putLabel } from "./utils.js";

let images = fs.readdirSync("./images");
let randomCigawette = Math.floor(Math.random() * images.length);
let chosenCig = images[randomCigawette];

let givenPhrase1 = `foobar`;

let givenPhrase2 = `A longer phrase that is
about quarter of the provided 
length that could be taken`;

let givenPhrase3 = `An even longer phrase that is
about half of the provided 
length that could be taken
wee weoo weoo weo ewoweo 
leedle leedle leedle leedle
lee`;

loadImage(`images/${chosenCig}`).then((image) => {
  putLabel(image, givenPhrase1);
});
