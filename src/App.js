
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import ProductList from './Components/ProductList';
import FileUpload from './Components/FileUpload';

const App = () => {
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle login
  const handleLogin = (username, password, navigate) => {
    try {
      if (username === 'aayush' && password === 'aayush@123') {
        console.log('admin hoon mai');
        setToken('admin-token');
        setIsAdmin(true);
        navigate('/upload');
      } else {
        console.log('user hoon mai');
        setIsAdmin(false);
        navigate('/products');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/upload"
          element={isAdmin ? <FileUpload token={token} /> : <Navigate to="/products" />}
        />
        <Route
          path="/products"
          element={<ProductList />}
        />
      </Routes>
    </Router>
  );
};

export default App;
