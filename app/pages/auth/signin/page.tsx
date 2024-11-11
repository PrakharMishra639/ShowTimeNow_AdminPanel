"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login, e.g., store adminAuthToken in a secure way
        console.log('Admin login successful', data);

        toast.success('Admin Login Successful', {
          
        });
        window.location.href = '/pages/movie/createmovie';

      } else {
        // Handle login error
        console.error('Admin login failed', response.statusText);
        toast.error('Admin Login Failed', {
         
        });
      }
    }
    catch (error) {
      toast.error('An error occurred during registration');
      console.error('An error occurred during registration', error);
    }
  }

  
  return (
    <div className='formpage bg-gray-100 min-h-screen flex justify-center items-center'>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        <input
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none w-full focus:ring-2 focus:ring-blue-500"
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          className="w-full p-3 m-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          onClick={handleLogin}
        >
          Sign In
        </button>
        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <a href="/pages/auth/signup" className="text-blue-500 hover:underline"> Sign Up</a>
        </p>
      </div>
    </div>
  );
  }
  
  export default SigninPage;
  
  