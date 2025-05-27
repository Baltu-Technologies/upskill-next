import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Candidate: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      headline: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 