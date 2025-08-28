import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth from '../Components/OAuth';

const SignUp = () => {
  const [FormData, SetFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, SetError] = useState(null);
  const [Loading, SetLoading] = useState(false);
  const HandleChange = (e) => {
    SetFormData({
      ...FormData,
      [e.target.id]: e.target.value
    });
    SetError(null);
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    SetLoading(true);
    SetError(null);
    try {
      const res = await fetch('/Api/auth/SignUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      toast.success('User created successfully')
      setTimeout(() => {
        navigate('/SignIn');
      },1500);
    } catch (err) {
      SetError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      SetLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign Up</h2>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={HandleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={HandleChange}
              disabled={Loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={HandleChange}
              disabled={Loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              id="password"
              onChange={HandleChange}
              placeholder="Password"
              disabled={Loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              disabled={Loading}
              className={`w-full text-white py-2 rounded-md transition duration-200 ${Loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {Loading ? 'Creating account...' : 'SIGN UP'}
            </button>
            <OAuth/>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Have an account?{' '}
            <Link to="/SignIn" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default SignUp;
