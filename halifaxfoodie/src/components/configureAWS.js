import AWS from 'aws-sdk';

const ConfigureAWS = () => {

  //Reference: https://aws.amazon.com/blogs/mobile/integrate-the-aws-sdk-for-javascript-into-a-react-app/
  AWS.config.update({
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET
  });
}

export default ConfigureAWS