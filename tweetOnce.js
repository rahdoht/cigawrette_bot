import { TwitterMediaUploader } from "./mediaUploader.js";

const photos = [
  {
    path: "./renderedCig.jpg",
    type: "image/jpg",
  },
];

const mediaUploader = new TwitterMediaUploader();
mediaUploader
  .init(photos)
  .then(mediaUploader.processFile)
  .then(() => mediaUploader.tweet("We don't sell Tic Tacs for Christ's sake."))
  .catch((e) => console.error("something broke", e));
