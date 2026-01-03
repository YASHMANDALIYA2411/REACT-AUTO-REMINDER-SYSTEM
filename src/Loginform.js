import { useState, useEffect, useRef } from "react";
import "./Loginform.css";

function Login({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const sessionTimeout = useRef(null);

  const resetSessionTimer = () => {
    if (sessionTimeout.current) clearTimeout(sessionTimeout.current);
    sessionTimeout.current = setTimeout(() => {
      alert('Session expired');
      window.location.reload();
    }, 15 * 60 * 1000);
  };
useEffect(() => {
  const events = ['click', 'keypress', 'mousemove'];
  events.forEach(e => document.addEventListener(e, resetSessionTimer));
  return () => events.forEach(e => document.removeEventListener(e, resetSessionTimer));
}, []);


  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }; 

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const hashedPassword = await hashPassword(password);
    
    if (tab === "signup") {
  
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[email]) {
        alert("User already exists! Please login.");
        return;
      }
      users[email] = hashedPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert("Account created successfully! Please login.");
      setTab("login");
      return;
    }
    
    if (tab === "login") {
     
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
    
      const isAdmin = email === "admin@1234" && password === "1234";
      const isRegisteredUser = users[email] && users[email] === hashedPassword;
      
      if (!isAdmin && !isRegisteredUser) {
        alert("Invalid credentials! Please signup first or use admin@1234 with password 1234");
        return;
      }
    }
    
    const userData = { 
      email, 
      userId: btoa(email), 
      sessionStart: Date.now() 
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    resetSessionTimer();
    if (onLogin) onLogin(userData);
  };

  const handleForgotPassword = async () => {
    if (!otpSent) {
      setOtpSent(true);
      console.log("OTP sent to:", email);
    } else {
      const hashedNewPassword = await hashPassword(newPassword);
      console.log("Password reset with encrypted password:", hashedNewPassword);
      setShowForgotPassword(false);
      setOtpSent(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {!showForgotPassword ? (
          <>
            <div className="login-tabs">
              <button
                className={tab === "login" ? "active" : ""}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={tab === "signup" ? "active" : ""}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <h2>{tab === "login" ? "Login Form " : "Create Account"}</h2>

            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
               {tab === "login" && (
              <a className="forgot" onClick={() => setShowForgotPassword(true)} style={{cursor: 'pointer'}}>Forget Password?</a>
            )}

            <button className="login-btn" onClick={handleSubmit}>
              {tab === "login" ? "Login" : "Create Account"}
            </button>

            <p className="footer-text">
              {tab === "login"
                ? <>Not a Member? <span onClick={() => setTab("signup")}>Signup Now</span></>
                : <>Already have an account? <span onClick={() => setTab("login")}>Login</span></>}
            </p>
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            {!otpSent ? (
              <>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="login-btn" onClick={handleForgotPassword}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p>OTP sent to {email}</p>
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="New Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#666'
                    }}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button className="login-btn" onClick={handleForgotPassword}>
                  Reset Password
                </button>
              </>
            )}
            <p className="footer-text">
              <span onClick={() => setShowForgotPassword(false)}>Back to Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
