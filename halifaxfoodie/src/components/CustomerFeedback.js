import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
const CustomerFeedBack = () => {

  const [feedback,setFeedback] = useState(null);
  const [id,setId] = useState(null)

  const uploadFeedback = () => {
    const feedbackObj = {
      "id":uuidv4(),
      "feedback":feedback,
      "restaurantId":id
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(feedbackObj)
  };
    //Reference: https://www.copycat.dev/blog/react-fetch/
    fetch('https://kcnnyl2tex4fhbi6um7nrcuqpa0nnxds.lambda-url.us-east-1.on.aws/',requestOptions)
    .then(response => 
      response.json()
    )
    .then(data => {
      alert(data.message)})
    .catch(err => console.log(err));
  }

  const handleFeedback = e => {
    setFeedback(e.target.value)
  }

  const handleId = e => {
    setId(e.target.value)
  }

  return (
    <div>
      <h3>Customer Feedback</h3>
      <div>
        <textarea rows={5} type="text" placeholder="Enter Feedback" onChange={handleFeedback}></textarea>
      </div>
      <div>
        <input type="number" placeholder="Enter RestaurantId" onChange={handleId}></input>
      </div>
      <div></div>
      <div>
        <Button variant="primary" onClick={uploadFeedback}>Upload Feedback</Button>
      </div>
    </div>
  );
};

export default CustomerFeedBack;
