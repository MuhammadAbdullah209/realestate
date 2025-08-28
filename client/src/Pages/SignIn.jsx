import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { SignInStart, SignInSuccess, SignInFailure } from '../Redux/user/userSlice';
import 'react-toastify/dist/ReactToastify.css';
import OAuth from '../Components/OAuth';
const SignIn = () => {
  const [FormData, SetFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const Navigator = useNavigate();
  const error = useSelector((state) => state.user.error);
  const Loading = useSelector((state) => state.user.loading);

  const HandleChange = (e) => {
    SetFormData({
      ...FormData,
      [e.target.id]: e.target.value
    });

    if (error) dispatch(SignInFailure(null)); // Clear error on input change
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SignInStart());

    try {
      const res = await fetch('/Api/auth/SignIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(FormData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Sign In failed');
      }

      toast.success('User signed in successfully!');
      dispatch(SignInSuccess(data));
      Navigator('/');
    } catch (err) {
      dispatch(SignInFailure('User Not Found'));
      // toast.error('User Not Found');
    }
  };

  const handleCloseError = () => {
    dispatch(SignInFailure(null));
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 relative">
              {error}
              <button
                onClick={handleCloseError}
                className="absolute top-1 right-2 text-red-500 hover:text-red-700 text-lg font-bold focus:outline-none"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          )}

          <form className="space-y-4" onSubmit={HandleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={HandleChange}
              disabled={Loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              id="password"
              onChange={HandleChange}
              placeholder="Password"
              disabled={Loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              disabled={Loading}
              className={`w-full text-white py-2 rounded-md transition duration-200 ${Loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {Loading ? 'Signing In...' : 'SIGN IN'}
            </button>
            <OAuth />
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/SignUp" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
};

export default SignIn;
