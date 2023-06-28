import { useEffect } from 'react';


const fetchReviews = async () => {
  const requestOptions = {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({ restaurantId: '1' }),
  };

  // Reference: https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
  await fetch('https://eu7ngeeb5f2xyf5wxdbwjovndy0mqkoj.lambda-url.us-east-1.on.aws/', requestOptions)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

const VisualizeCustomerFeedback = () => {

  useEffect(() => {
    fetchReviews();
  },[])
  // Reference: https://blog.logrocket.com/best-practices-react-iframes/
  return (
    <div className="p-6">
      <h3>Visualizing Feedback</h3>
      <div>
        <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/db1f89be-d2f0-40c3-9cf6-1b94071e6ed7/page/m2W9C" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default VisualizeCustomerFeedback;
