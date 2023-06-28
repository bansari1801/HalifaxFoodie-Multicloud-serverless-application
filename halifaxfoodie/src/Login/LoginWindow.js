import React from "react";
import { useNavigate } from "react-router-dom"



function LoginWindow({ formData, setFormData }) {

    const changeHandler = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate()

  return (

    <div className="personal-info-container">

    <div className="email">
        <input
            type="text"
            placeholder="Email..."
            name="email"
            value={formData.email}
            onChange={changeHandler}
        />
    </div>
    <div className="password">
        <input
            type="text"
            placeholder="Password..."
            name="password"
            value={formData.password}
            onChange={changeHandler}
        />
    </div>
    <div className="cypertext">
        <input
            type="text"
            placeholder="Enter Cyphertext.."
            name="cypertext"
            value={formData.cypertext}
            onChange={changeHandler}
        />
    </div>

    </div>
    );
}

export default LoginWindow;
