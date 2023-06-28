import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {

  UserPoolId: 'us-east-1_PDY2NsF0H',
  ClientId: '3e32j6vu9iiofmcat35hnhu8s7',
};
export default new CognitoUserPool(poolData);
