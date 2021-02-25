const express = require("express");
// const { generateDocs } = require("../lib");
const  { publishAsHtml, publishToPosman }  = require("../index");
const router = express.Router;

const { routes } = require("./routesMock");

const PORT = 8888;
publishAsHtml(routes, PORT);
publishToPosman(routes, 'PMAK-5fe34db588f69b0034bd3028-ff744bbb92368b76b1a1c2a862ed3217ad', '13969251-359b6835-b28f-4d5d-96b0-df14f2790963')

let app = new express();

app.use("/api", router);

app.listen(4001, () => console.log("test server is listting on 4001"));
