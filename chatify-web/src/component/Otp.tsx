import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ConfirmationResult } from "firebase/auth";
import UserApi from "../api/UserApi";
import { setUserData } from "../redux/authSlice";

// Define the props type for the component
interface OtpVerificationPageProps {
  confirmationResult: ConfirmationResult; // Adjust according to Firebase version
}

const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({
  confirmationResult,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyOtp = async () => {
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid OTP.");
      return;
    }

    try {
      // Confirm the OTP with the confirmationResult
      const result = await confirmationResult.confirm(otp);
      console.log("User signed in successfully:", result.user);

      // Get the token and dispatch to Redux
      const token = await result.user.getIdToken();
      const user = await UserApi.createUser(result.user.uid)
       const name="martin"

       if (user.status==200) {
        dispatch(setUserData({token,name,id:user.data._id}));

        // Navigate to the dashboard or another page
        navigate("/dashboard");
        
       }

    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-900">
      <div className="w-3/5 h-auto border border-green-300 rounded-3xl md:w-96 text-white">
        <div className="flex flex-col items-center w-full h-full p-7">
          <div className="text-3xl font-bold mt-4">Verify OTP</div>
          <div className="flex flex-col w-full mt-8 items-center gap-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full p-2 text-white bg-gray-700 rounded-lg"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={verifyOtp}
              className="w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-green-300 rounded-lg"
            >
              Verify OTP
            </motion.button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
