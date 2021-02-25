import * as path from "path";
import * as nodeStatic from "node-static";

const swaggerStaticFilesPath = path.join(__dirname, "../swagger-ui-dist");
const staticFiles = new nodeStatic.Server(swaggerStaticFilesPath, { cache: false });

export const listen = (jsonApi: any, PORT = 8080) => {
  require("http")
    .createServer(function (req: any, res: any) {
      if (req.url === "/apiJsonDoc") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(jsonApi));
      } else
        req
          .addListener("end", function () {
            staticFiles.serve(req, res, () => {});
          })
          .resume();
    })
    .listen(PORT, (error: Error) => {
      if (error) console.log(error);
      else console.log("Docs server is listening on port :", PORT);
    });
};
