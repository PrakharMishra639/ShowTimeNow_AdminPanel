"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful signup, e.g., show a success message
        console.log('Admin registration successful', data);

        toast.success('Admin Registration Successful', {
           
        });
      } else {
        // Handle signup error
        console.error('Admin registration failed', response.statusText);
        toast.error('Admin Registration Failed', {
           
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
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
  
        <input
          className="p-3 m-2 border border-gray-300 rounded w-full  focus:outline-none focus:ring-2 focus:ring-blue-500"
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <input
          className="p-3 m-2 border border-gray-300 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          className="p-3 m-2 border border-gray-300 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          className="w-full p-3 m-2 bg-blue-500 text-center text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        
        <p className="text-center text-gray-600 mt-4">
          Already have an account? 
          <a href="/pages/auth/signin" className="text-blue-500 hover:underline"> Sign In</a>
        </p>
      </div>
    </div>
  );
  }
  
  export default SignupPage;