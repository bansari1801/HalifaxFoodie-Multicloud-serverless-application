import React, { useState } from "react";
import RegistrationWindow from "./RegistrationWindow";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../Configs/UserPool';
import {db} from '../Configs/Firebaseconfig';
import {addDoc, collection, getDocs} from "firebase2/firestore";
import { doc, setDoc } from "firebase2/firestore";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
function Regisration() {
  let data ={}
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    firstanswer: "",
    secondanswer: "",
    thirdanswer: "",
    key: "",
    plaintext: "",
    usertype: ""
  });
const registerUserInCognito = () => {
  const attributeList = [];
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'email',
        Value: formData.email,
      })
    );
    UserPool.signUp(formData.email, formData.password, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);
        alert("Signup Failed");
      } else {
        console.log(data);
        var getUrl = "https://mf6j434x4nhazvjnwoch3e4qsm0zmcis.lambda-url.us-east-1.on.aws?email=" + formData.email + "&name=" + formData.firstName + "&password=" + formData.password + "&key=" + formData.key + "&plaintext=" + formData.plaintext + "&usertype=" + formData.usertype
        fetch(getUrl).then((data) => {
            alert('User Added Successfully 1');
            navigate('/login');
        })
      }
    });
}
  const formValidation1 = () => {
    var SpecialSym =['^','$','*','.','[',']','{','}','(', ')', '?', '-', '!', '@', '#', '%', '&', '/', ',', '>', '<', ':', ';', '|', '_', '~', '`','+','='];
    if (formData.firstName === "") {
      alert("Please enter your first name");
      return false;
    } else if (formData.lastName === "") {
      alert("Please enter your last name");
      return false;
    } else if (formData.email === "") {
      alert("Please enter your email");
      return false;
    } else if(formData.email.indexOf("@") === -1) {
      alert("Please enter a valid email");
      return false;
    } else if (formData.password === "") {
      alert("Please enter your password");
      return false;
    } else if(formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return false;
    } else if(formData.password.indexOf(" ") !== -1) {
      alert("Password cannot contain spaces");
      return false;
    } else if (formData.password.indexOf("1") === -1 && formData.password.indexOf("2") === -1 && formData.password.indexOf("3") === -1 && formData.password.indexOf("4") === -1 && formData.password.indexOf("5") === -1 && formData.password.indexOf("6") === -1 && formData.password.indexOf("7") === -1 && formData.password.indexOf("8") === -1 && formData.password.indexOf("9") === -1 && formData.password.indexOf("0") === -1) {
      alert("Password must contain at least one number");
      return false;
    } 
    //password must contain at least one uppercase letter
    else if (formData.password === formData.password.toLowerCase()) {
      alert("Password must contain at least one uppercase letter");
      return false;
    }
    //password must contain at least one lowercase letter
    else if (formData.password === formData.password.toUpperCase()) {
      alert("Password must contain at least one lowercase letter");
      return false;
    }  
    // else if (formData.password.indexOf(SpecialSym) === -1) {
    //   alert("Password must contain at least one special character");
    //   return false;
    // } 
    else if (formData.address === "") {
      alert("Please enter your address");
      return false;
    } else if (formData.phoneNumber === "") {
      alert("Please enter your phone number");
      return false;
    } else if (formData.phoneNumber.length !== 10) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  }
  const PageDisplay = () => {
      return <RegistrationWindow formData={formData} setFormData={setFormData} />;
  };
  const submitHandler = () => {
        console.log(formData);
        registerUserInCognito();
        storeAnswers2ndFactor();
  }
  const storeAnswers2ndFactor = async () => {
    data = {
      answer1: formData.firstanswer,
      answer2: formData.secondanswer,
      answer3: formData.thirdanswer
    }
    await setDoc(doc(db, "QuestionAnswers", formData.email), data);
  }
  return (
    <div className="form">
      <div className="form-container">
        <div className="header">
          <h1>RegistrationWindow</h1>
        </div>
        <div className="body">{PageDisplay()}</div>
        <div className="footer">
          <button
            onClick={submitHandler}
            >
            {true ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Regisration;