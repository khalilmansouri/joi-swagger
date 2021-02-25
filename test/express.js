const express = require("express");
// const { generateDocs } = require("../lib");
const  { publishAsHtml, publishToPosman }  = require("../index");
const router = express.Router;

const { routes } = require("./routesMock");

const PORT = 8888;
publishAsHtml(routes, PORT);

let app = new express();

app.use("/api", router);

app.listen(4001, () => console.log("test server is listting on 4001"));
