const express = require("express");
// const { generateDocs } = require("../lib");
const  generateDocs  = require("../index");
const router = express.Router;

import { routes } from "./routesMock";

const PORT = 8083;

generateDocs(routes, PORT);

let app = new express();

app.use("/api", router);

app.listen(4001, () => console.log("test server is listting on 4001"));
