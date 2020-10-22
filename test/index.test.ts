import { generateDocs } from "../src/index";
import { routes } from "./routesMock";
const PORT = 8083;

generateDocs(routes, PORT);
