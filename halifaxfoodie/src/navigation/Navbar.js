import React from 'react';

const isOwner = () => {
  if(localStorage.getItem("userType") === 'owner'){
    return true
  }
  return false
}

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/home">
              Home
            </a>
          </li>
          <li className="nav-item" style={{visibility:isOwner() ? 'visible' : 'hidden'}}>
            <a className="nav-link" href="/recipes">
              Recipes
            </a>
          </li>
          <li className="nav-item" style={{visibility:isOwner() ? 'visible' : 'hidden'}}>
            <a className="nav-link" href="/visualizeCustomerFeedback">
               Feedback Visualization
            </a>
          </li>
          <li className="nav-item" style={{visibility:isOwner() ? 'hidden' : 'visible'}}>
            <a className="nav-link" href="/visualization">
              Visualization
            </a>
          </li>
          <li className="nav-item" style={{visibility:isOwner() ? 'hidden' : 'visible'}}>
            <a className="nav-link" href="/customer_feedback">
               Customer Feedback
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
