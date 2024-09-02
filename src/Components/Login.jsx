

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    onLogin(username, password, navigate);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input className="login-input" type="text" name="username" placeholder="Username" required />
        <input className="login-input" type="password" name="password" placeholder="Password" required />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
