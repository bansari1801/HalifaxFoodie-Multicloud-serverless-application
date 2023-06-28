import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CustomerFeedBack from '../components/CustomerFeedback';
import Home from '../components/Home';
import HomePage from '../components/HomePage';
import LoginScreen from '../components/LoginScreen';
import Logout from '../components/Logout';
import Recipes from '../components/Recipes';
import Regisration from '../components/Registration';
import Visualization from '../components/Visualization';
import VisualizeCustomerFeedback from '../components/VisualizeCustomerFeedback';
import Login from '../Login/Login';


//Reference: https://www.digitalocean.com/community/tutorials/how-to-handle-routing-in-react-apps-with-react-router
const AppRoutes = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/customer_feedback" element={<CustomerFeedBack />} />
          <Route path="/visualizeCustomerFeedback" element={<VisualizeCustomerFeedback />} />
          <Route exact path="/visualization" element={<Visualization />} />
          <Route exact path='/registration' element={<Regisration/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/logout" element={<Logout/>} />
        </Routes>
      </BrowserRouter>

  );
}

export default AppRoutes;