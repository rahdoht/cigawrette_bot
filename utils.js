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
  // picked from testing
  const TEXT_X = 920;
  const TEXT_Y = 1500;
  const labelWidth = 480;
  const labelHeight = 225;

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const formatText = (label, fontSize) => {
    ctx.font = `bold ${fontSize}px helvetica`;
    let lines = [];
    let words = label.split(/\s+/);
    let curLine = words[0];
    words.forEach((word) => {
      let newWidth = ctx.measureText(curLine + " " + word).width;
      if (newWidth < labelWidth) {
        curLine += " " + word;
      } else {
        lines.push(curLine);
        curLine = word;
      }
    });
    lines.push(curLine);
    return lines;
  };

  let lines;
  let textHeight = labelHeight + 1;
  let textWidth = 0;
  let fontSize = 43;
  while (textHeight > labelHeight) {
    fontSize -= 1;
    // break up lines according to fontSize
    lines = formatText(label, fontSize);
    // calculate textHeight for this fontSize
    textHeight = 0;
    lines.forEach((line) => {
      let textMeasure = ctx.measureText(line);
      textHeight += textMeasure.emHeightDescent;
      textWidth = Math.max(textWidth, textMeasure.width);
    });
    // set transformation with a deltaY fudge factor from testing
    let deltaY = 95 - textHeight / 2;
    ctx.setTransform(1.2, -0.215, -0.02, 1.5, TEXT_X, TEXT_Y + deltaY);
  }
  console.log(
    `fontSize=${fontSize} textWidth=${textWidth} textHeight=${textHeight}`
  );

  let y = 0; // current y-coordinate of the text baseline
  lines.forEach((line) => {
    let height = ctx.measureText(line).emHeightDescent / 2.2;
    ctx.fillText(line, 0, y);
    y += height; // increment y by a fraction of the height of the current line
    ctx.translate(0, height);
  });

  const IMG_BUFFER = canvas.toBuffer("image/jpeg");
  fs.writeFileSync("./renderedCig.jpg", IMG_BUFFER);
};
