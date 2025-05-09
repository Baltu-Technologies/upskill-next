import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: outputs.data.url,
      region: outputs.data.aws_region,
      defaultAuthMode: 'apiKey' as const,
      apiKey: outputs.data.api_key,
      customHeaders: async () => ({
        'x-api-key': outputs.data.api_key
      })
    }
  }
} as const;

Amplify.configure(amplifyConfig);

export default amplifyConfig; 