import * as converter from "openapi-to-postmanv2";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { parser } from "./converter";

export const publish = (swaggetRoutes: any, ACCESS_KEY: string, COLLECTION_UID: string) => {
  let parsedRoutes = parser(swaggetRoutes);
  converter.convert({ type: "string", data: parsedRoutes }, {}, (err: any, conversionResult: any) => {
    if (!conversionResult.result) {
      throw Error("Could not convert: " + conversionResult.reason);
    } else {
      var data = JSON.stringify({
        collection: conversionResult.output[0].data,
      });

      var config: AxiosRequestConfig = {
        method: "put",
        url: "https://api.getpostman.com/collections/" + COLLECTION_UID,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": ACCESS_KEY,
        },
        data: data,
      };

      axios(config)
        .then(() => {
          return;
        })
        .catch((error: AxiosError) => {
          throw error;
        });
    }
  });
};
