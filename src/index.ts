import { listen } from "./server";
import { parser } from "./converter";
import { publish } from "./postman";

export const publishToPosman = publish;
export const publishAsHtml = (joiRoutes: any, PORT: number) => listen(parser(joiRoutes), PORT);
