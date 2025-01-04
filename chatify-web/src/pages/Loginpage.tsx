import React, { useState } from 'react';
import Login from '../component/Login';
import OtpVerificationPage from '../component/Otp';
import { ConfirmationResult } from 'firebase/auth'; 

const LoginPage: React.FC = () => {

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  return (
    <div>
  
      {!confirmationResult ? (
        <Login setConfirmationResult={setConfirmationResult} />
      ) : (
        <OtpVerificationPage confirmationResult={confirmationResult} />
      )}
    </div>
  );
};

export default LoginPage;
