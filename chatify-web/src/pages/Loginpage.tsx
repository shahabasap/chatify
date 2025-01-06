import React, { useState } from 'react';
import Login from '../component/Login';
import OtpVerificationPage from '../component/Otp';
import { ConfirmationResult } from 'firebase/auth'; 

const LoginPage: React.FC = () => {

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [name, setName] = useState<string | null>(null)

  return (
    <div>
  
      {!confirmationResult ? (
        <Login setConfirmationResult={setConfirmationResult} setName={setName} />
      ) : (
        <OtpVerificationPage confirmationResult={confirmationResult} name={name} />
      )}
    </div>
  );
};

export default LoginPage;
