import React from "react";
import { useNavigate } from "react-router-dom"
function RegistrationWindow({ formData, setFormData }) {
    const changeHandler = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const navigate = useNavigate()
const onClickHandler = () => navigate(`/RegistrationWindow`)
  return (
    <div className="personal-info-container">
    <div className="firstname">
        <input
            type="text"
            placeholder="First Name..."
            name="firstName"
            value={formData.firstName}
            onChange={changeHandler}
        />
    </div>
    <div className="lastname">
        <input
            type="text"
            placeholder="Last Name..."
            name="lastName"
            value={formData.lastName}
            onChange={changeHandler}
        />
    </div>
    <div className="email">
        <input
            type="text"
            placeholder="Email Id..."
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
    <div className="phonenumber">
        <input
            type="text"
            placeholder="Mobile Number..."
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={changeHandler}
        />
    </div>
    <div className="key">
        <input
            type="text"
            placeholder="Enter key"
            name="key"
            value={formData.key}
            onChange={changeHandler}
        />
    </div>
    <div className="plaintext">
        <input
            type="text"
            placeholder="Enter plain text..."
            name="plaintext"
            value={formData.plaintext}
            onChange={changeHandler}
        />
    </div>
    <div>
        <div className="firstanswer">
            <input
                type="text"
                placeholder="Please enter your first answer"
                value={formData.firstanswer}
                name="firstanswer"
                onChange={(event) => {
                    setFormData({ ...formData, firstanswer: event.target.value });
                }}
            />
        </div>
        <div className="secondanswer">
            <input
                type="text"
                placeholder="Please enter your second answer"
                value={formData.secondanswer}
                name="secondanswer"
                onChange={(event) => {
                    setFormData({ ...formData, secondanswer: event.target.value });
                }}
            />
        </div>
        <div className="thirdanswer">
            <input
                type="text"
                placeholder="Please enter your third answer"
                value={formData.thirdanswer}
                name="thirdanswer"
                onChange={(event) => {
                    setFormData({ ...formData, thirdanswer: event.target.value });
                }}
            />
        </div>
        <div className="usertype">
            <input
                type="text"
                placeholder="Please enter customer type"
                value={formData.usertype}
                name="usertype"
                onChange={(event) => {
                    setFormData({ ...formData, usertype: event.target.value });
                }}
            />
        </div>
    </div>
    </div>
    );
}
export default RegistrationWindow;