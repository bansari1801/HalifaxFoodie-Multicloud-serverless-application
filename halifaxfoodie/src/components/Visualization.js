import { useEffect } from 'react';

const calculateVisualizationData = async () => {
  const requestOptions = {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({}),
  };

  // Reference: https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  await fetch('https://ugitwh2creumcclomhmfan2woq0uolxv.lambda-url.us-east-1.on.aws/', requestOptions)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

const Visualization = () => {
  useEffect(() => {
    calculateVisualizationData();
  },[])
  return(
    <div>
      <div>
      <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/702c0504-d3c9-4fb3-9b18-990e2c0c8cae/page/PyY9C" allowFullScreen></iframe>
      </div>
      <div>
      <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/16f1c378-fb41-4fa8-97ff-c027f2b1a9c2/page/ZxY9C" allowFullScreen></iframe>  
       </div>
    </div>
  )
}

export default Visualization