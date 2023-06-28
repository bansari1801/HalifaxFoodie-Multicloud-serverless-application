import React from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen  () {

    const navigate = useNavigate()
  return (
    <div className="App">
      <h1>Halifax Foodie!!! Serving our Since 2012</h1>
      <marquee>We are having new deals and heavy discounts on New Year!!!!!</marquee>
      
        <button onClick={() => navigate(`/login`)}> I wish to Login</button>

      
        <button onClick={() => navigate(`/registration`)}>I wish to Register</button>
      
        
    </div>
  );
}

export default LoginScreen;