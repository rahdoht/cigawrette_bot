import express from "express";
import { renderBot } from "./renderBot.js";

const app = express();
const port = process.env.PORT || 5000


app.get("/", (req, res) => {
  res.send("an image of a thing");
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
  renderBot()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Err: ", err);
      process.exit(1);
    });
});
