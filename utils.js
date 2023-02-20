import fs from "fs";
import dotenv from "dotenv";
import { createCanvas } from "canvas";

dotenv.config({ silent: true });

// encodes all characters encoded with encodeURIComponent, plus: ! ~ * ' ( )
export const fullyEncodeURI = (value) =>
  encodeURIComponent(value)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2a")
    .replace(/~/g, "%7e");

export const oauth = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
};

export const putLabel = (image, label) => {
  // downsample the original by half
  const IMAGE_WIDTH = 1728;
  const IMAGE_HEIGHT = 2160;

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  const TEXT_X = 915;
  const TEXT_Y = 1465;
  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  var fontSize = 28;
  ctx.font = `bold ${fontSize}px helvetica`;

  // // helper squares
  // ctx.save();
  // ctx.fillStyle = "orange";
  // ctx.fillRect(TEXT_X, TEXT_Y, 20, 20);
  // ctx.fillRect(TEXT_X, TEXT_Y + 310, 20, 20);
  // ctx.restore();

  const maxWidth = 460;

  var words = label.split(/\s+/);
  var lines = [];
  var curLine = words[0];
  for (let i = 1; i < words.length; i++) {
    var word = words[i];
    var newWidth = ctx.measureText(curLine + " " + word).width;
    if (newWidth < maxWidth) {
      curLine += " " + word;
    } else {
      lines.push(curLine);
      curLine = word;
    }
  }
  lines.push(curLine);

  // center vertically
  const lineHeight = ctx.measureText(curLine).actualBoundingBoxDescent;
  const textHeight = lineHeight * lines.length;
  var deltaY = 120 - textHeight / 2;
  ctx.setTransform(1.2, -0.215, -0.02, 1.5, TEXT_X, TEXT_Y + deltaY);

  for (let i = 0; i < lines.length; i++) {
    var line = lines[i];
    ctx.fillText(line, 0, 0);
    var height = ctx.measureText(line).actualBoundingBoxDescent;
    ctx.translate(0, height);
  }

  const IMG_BUFFER = canvas.toBuffer("image/jpeg");
  fs.writeFileSync("./renderedCig.jpg", IMG_BUFFER);
};
