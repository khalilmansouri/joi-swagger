import { listen } from "./server";
import { parser } from "./converter";

export const generateDocs = (joiRoutes: any, PORT: number) => listen(parser(joiRoutes), PORT);
