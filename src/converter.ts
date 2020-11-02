const joiToJson = require("joi-to-json");
import * as _ from "lodash";

interface iPaths {
  [key: string]: any;
}

let paths: iPaths = {};

const doc_template = {
  openapi: "3.0.1",
  info: {
    description: "API Docs",
    version: "1.0.0",
    title: "API Docs",
  },
  servers: [
    {
      url: "http://localhost/",
    },
  ],
  tags: [],
  schemes: ["https", "http"],
  paths: {},
  components: {
    schemas: {
      Error: {
        type: "object",
        required: ["code", "err"],
        properties: {
          code: {
            type: "string",
          },
          err: {
            type: "string",
          },
        },
      },
    },
  },
};

function joiSchemaToSwaggerSchema(schema: any) {
  const swaggerSchema: { [key: string]: any } = _.pick(schema, [
    "title",
    "multipleOf",
    "maximum",
    "exclusiveMaximum",
    "minimum",
    "exclusiveMinimum",
    "maxLength",
    "minLength",
    "pattern",
    "maxItems",
    "minItems",
    "uniqueItems",
    "maxProperties",
    "minProperties",
    "required",
    "enum",
    "description",
    "format",
    "default",
    "type",
    "allOf",
    "oneOf",
    "anyOf",
    "not",
    "items",
    "properties",
    "additionalProperties",
  ]);
  if (!_.isEmpty(schema.examples)) {
    swaggerSchema.example = schema.examples[0];
  }
  if (!swaggerSchema.description) {
    swaggerSchema.description = "";
  }
  return swaggerSchema;
}

function _convertJsonSchemaToSwagger(jsonSchema: any) {
  _.forEach(jsonSchema.properties, (fieldSchema, field) => {
    jsonSchema.properties[field] = joiSchemaToSwaggerSchema(fieldSchema);

    fieldSchema = jsonSchema.properties[field];

    if (fieldSchema.type === "object") {
      _convertJsonSchemaToSwagger(fieldSchema);
    } else if (fieldSchema.type === "array") {
      if (fieldSchema.items.anyOf) {
        fieldSchema.items.anyOf = _.map(fieldSchema.items.anyOf, (item) => {
          return _convertJsonSchemaToSwagger(item);
        });
      } else {
        fieldSchema.items = _convertJsonSchemaToSwagger(fieldSchema.items);
      }
    }
  });

  const subSchemaFields = ["oneOf", "allOf", "anyOf"];
  _.forEach(subSchemaFields, (field) => {
    if (!_.isEmpty(jsonSchema[field])) {
      jsonSchema[field] = _.map(jsonSchema[field], (subSchema) => {
        return _convertJsonSchemaToSwagger(subSchema);
      });
    }
  });
  return jsonSchema;
}

doc_template.paths = paths;

export const parser = (routes: any[]): any => {
  routes.forEach((route) => {
    let method = route.method.toLowerCase();
    let parameters: any[] = [];
    let requestBody: any;
    Object.keys(route.validations).forEach((key) => {
      if (["query", "path"].includes(key)) {
        let { properties } = joiToJson(route.validations[`${key}`]);
        Object.keys(properties).forEach((fieldName) => {
          let { description, examples, required } = properties[fieldName];
          let isRequied = false;
          let example: any;

          if (required && required.includes(fieldName)) {
            isRequied = true;
          }
          if (!_.isEmpty(examples)) {
            example = examples[0];
            delete properties[fieldName].examples;
          }

          let parameter = {
            in: key,
            name: fieldName,
            description,
            required: isRequied,
            example,
            schema: _.omit(joiSchemaToSwaggerSchema(properties[fieldName]), ["description", "example"]),
          };

          parameters.push(parameter);
        });
      } else if (["body"].includes(key)) {
        const bodySchema = joiToJson(route.validations[`${key}`]);
        const schema = _convertJsonSchemaToSwagger(bodySchema);

        let contentType = "application/json";
        const anyBinaryField = _.some(schema.properties, (fieldDefn) => {
          return fieldDefn.format === "binary";
        });

        if (anyBinaryField) {
          contentType = "multipart/form-data";
        }

        requestBody = {
          content: {
            [contentType]: {
              schema,
            },
          },
        };
      }
    });

    let { path, summary, description } = route;
    if (!paths[path]) {
      paths[path] = {
        [method]: {
          summary,
          description,
          parameters,
          requestBody,
        },
      };
    } else
      paths[path][method] = {
        summary,
        description,
        parameters,
        requestBody,
      };
  });
  return doc_template;
};
export const jsonApi = doc_template;
