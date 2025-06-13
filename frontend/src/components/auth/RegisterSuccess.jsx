import React from "react";
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import { MailQuestion } from "lucide-react";
import "../../styles/auth/Register.css";

function RegisterSuccess() {
  return (
    <div className="page-wrapper">
      <AuthHeader />
      <div className="register-bg">
        <div className="register-layout">
          <div className="register-side left-side"></div>
          <div className="login-box register-fullbox">
            <div className="register-title-bg">
              <div className="form-icon">
                <MailQuestion size={48} />
              </div>
              <h2 className="login-title">Check Email Inbox!</h2>
            </div>
            <div className="register-intro">
              <span className="register-intro-text">
                Registration successful!<br />
                We have sent you an email.<br />
                Please complete your registration by clicking the link in your inbox.
              </span>
            </div>
          </div>
          <div className="register-side right-side"></div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

export default RegisterSuccess;