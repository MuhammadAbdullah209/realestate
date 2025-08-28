// src/components/OAuth.jsx
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { SignInSuccess } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const HandleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Api/auth/Google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      dispatch(SignInSuccess(data));
      navigator("/Profile");
      console.log("Google sign in success:", data);
    } catch (error) {
      console.log("Could not sign in with Google:", error.message || error);
    }
  };
  return (
    <button
      onClick={HandleGoogleClick}
      type="button"
      className="w-full py-2 rounded-md transition duration-200 bg-blue-600 hover:bg-blue-700 text-white"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default OAuth;
