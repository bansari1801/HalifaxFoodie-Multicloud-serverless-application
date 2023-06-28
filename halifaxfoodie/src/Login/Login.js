import React, { useState } from "react";
import LoginWindow from "./LoginWindow";

import UserPool from "../Configs/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import {db} from "../Configs/Firebaseconfig";

import {addDoc, collection, doc, getDoc} from "firebase2/firestore";

function Login() {
    
  const userCollection = collection(db, "QuestionAnswers");
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cypertext: ""
  })
  

const authenticateUserOnCognito = () => {
  const user = new CognitoUser({
      Username: formData.email,
      Pool: UserPool
  })
  const authDetails = new AuthenticationDetails({
      Username: formData.email,
      Password: formData.password
  })
  user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        if(formData.password == "")
        console.log("onSuccess: ", data)
        let loginUrl = "https://akt27k77yrozhdoemwimb4jozm0dtsge.lambda-url.us-east-1.on.aws?email=" + formData.email
          fetch(loginUrl).then((data) => {
            console.log(data)
            const requestOptions = {
              method: 'POST',
              headers: { 'Accept': 'application/json' },
              body: JSON.stringify({"email":formData.email})
          };
            //Reference: https://www.copycat.dev/blog/react-fetch/
            fetch('https://wtgrd2d4j3u45mrqv335hjpjim0vdsuo.lambda-url.us-east-1.on.aws/',requestOptions)
            .then(response => 
              response.json()
            )
            .then(data => {
              localStorage.setItem("email",data.email)
              localStorage.setItem("userType",data.type)
              alert("login successful")
              window.location = "/home"
            })
            .catch(err => console.log(err));
           
          })
      },
      onFailure: (err) => {
          console.log(err)
          alert("Incorrect credentials")
          window.location = "/login"
      }
  })
}


  const submitHandler = () => {
    authenticateUserOnCognito();
  }

  return (

<div>

    <div className="form">
      <div className="form-container">
        <div className="header">
          <h1>User Login</h1>
        </div>
        <div className="body"><LoginWindow formData={formData} setFormData={setFormData} /></div>
          <button
            onClick={submitHandler}
            >

            "Submit"
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login
