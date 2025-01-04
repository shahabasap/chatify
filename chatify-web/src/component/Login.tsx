import React, { useState } from "react";
import { motion } from "motion/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { app } from "../services/firebaseConfig"; // Ensure your firebaseConfig is correct

// global.d.ts or any .d.ts file in your project
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier; // Add this line to declare recaptchaVerifier on the window object
  }
}


interface LoginProps {
  setConfirmationResult: (result: ConfirmationResult) => void; // Type for the confirmation result
}

const Login: React.FC<LoginProps> = ({ setConfirmationResult }) => {
  const [value, setValue] = useState<string>("");  // Phone number state, typed as string
  const [error, setError] = useState<string>("");  // Error state, typed as string

  const sendOtp = async () => {
    setError(""); // Reset error on each OTP request

    // Validate the phone number
    if (!value) {
      setError("Please enter a valid phone number.");
      return;
    }
    console.log("Phone Number:", value);

    try {
      const auth = getAuth(app);

      // Set up reCAPTCHA verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response:any) => {
          console.log('reCAPTCHA solved, OTP sending in progress...');
        },
      });

      // Send OTP with the properly formatted phone number
      const result = await signInWithPhoneNumber(auth, `+${value}`, window.recaptchaVerifier);
      setConfirmationResult(result);  // Pass the result to the parent component for further handling
      
    } catch (error: any) {  // Add error typing
      if (error.code === "auth/invalid-phone-number") {
        setError("The phone number is not valid. Please enter a valid phone number.");
      } else {
        setError("Error sending OTP. Please try again later.");
      }
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-900">
        <div className="w-3/5 h-auto border border-green-300 rounded-3xl md:w-96 text-white">
          <div className="flex flex-col items-center w-full h-full p-7">
            <div className="text-3xl font-bold mt-4">Login here</div>
            <div className="flex flex-col w-full mt-8 items-center gap-4">
              <PhoneInput
                country="us"
                value={value}
                onChange={setValue}
                onlyCountries={["us", "in", "gb", "au", "ca"]}
                preferredCountries={["in", "us", "gb"]}
                excludeCountries={["ru", "cn"]}
                containerStyle={{
                  width: "100%",
                }}
                inputStyle={{
                  background: "gray",
                  width: "100%",
                  borderRadius: "8px",
                  color: "white",
                }}
                buttonStyle={{
                  border: "1px solid white",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendOtp}
                className="w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-green-300 rounded-lg"
              >
                Send OTP
              </motion.button>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
};

export default Login;
