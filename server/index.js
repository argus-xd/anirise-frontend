const kodik = require("./controllers/kodik");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const morgan = require("morgan");
const cors = require("cors");
/* const fetch = require("node-fetch");
const tr = require("tor-request");
var url = require("url");
var http = require("http");
var https = require("https");
var SocksProxyAgent = require("socks-proxy-agent");

const Agent = require("socks5-https-client/lib/Agent");
const TelegramBot = require("node-telegram-bot-api");
const token = "998486485:AAHgfgM-00cVKmL-uQN-gvfSjPkTIv7rq2Y";

const MongoClient = require("mongodb").MongoClient; */

const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./app/routes")(app, {});

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log("We are live on " + port);
});

const context = {
  title: "vue ssr",
  meta: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue ssr demo">
    `
};
