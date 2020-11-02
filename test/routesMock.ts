import * as joi from "joi";

interface Root {
  path: string;
  method: string;
  tags?: [string];
  summary: string;
  description?: string;
  validations: any;
  parameters?: any[];
}

export const routes: Root[] = [
  {
    path: "/client/login",
    method: "GET",
    summary: "Login endpoint with email and password (1)",
    description: "Login endpoint with email and password ...",
    validations: {
      query: joi.object({
        email: joi.string().email().required().example("khalil@mansouri.com").description("user email"),
        password: joi.string().required().example("0987654321").description("user password"),
      }),
      // output: {
      //   200: joi.object({}),
      // },
    },
  },
  {
    method: "GET",
    summary: "Items details endpoint (2)",
    description: "Items details endpoint ...",
    path: "/items/{itemId}/details",
    validations: {
      path: joi.object({
        itemId: joi.string().required().example("2323423423234").description("this is items ID"),
      }),
    },
  },
  {
    method: "POST",
    summary: "update item in the database (3)",
    description: "update items ops ...",
    path: "/items/{itemId}/details",
    validations: {
      body: joi.object({
        itemId: joi.string().required().example("2323423423234").description("this is items ID"),
      }),
    },
  },
  {
    method: "post",
    path: "/{id}",
    summary: "Update (4)",
    description: "update description",
    validations: {
      path: joi.object({ id: joi.string().description("user ID").example("qwlk2l3kenr2kalsknfldkns") }),
      body: joi.object({
        avatar: joi.string().required().uri(),
        icon: joi.string().meta({ contentMediaType: "image/png" }),
        email: joi
          .string()
          .example("someEmail@email.com")
          .email()
          .description("this user email")
          .error(new Error("wrong email")),
        height: joi.number().precision(2),
        skills: joi
          .array()
          .items(
            joi.alternatives(
              joi.string(),
              joi.object().keys({
                name: joi.string().example("teleport").alphanum().description("Skill Name").lowercase(),
                level: joi.number().integer().example(1).description("Skill Level"),
              }),
            ),
          )
          .min(1)
          .max(3)
          .unique()
          .description("Skills"),
        retired: joi.boolean().truthy("yes").falsy("no").sensitive(true),
        // certificate: joi.binary().encoding("base64"),
      }),
    },
  },
  {
    method: "put",
    summary: "update item in the database (5)",
    description: "update items ops ...",
    path: "/items/{itemId}/details",
    validations: {
      body: joi.object({
        itemId: joi.string().required().example("2323423423234").description("this is items ID"),
      }),
    },
  },
];
