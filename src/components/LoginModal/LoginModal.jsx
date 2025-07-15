import "./LoginModal.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { loginUser } from "../../api/auth";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const { user, token } = await loginUser(email.trim(), password);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("token", token);
      onLoginSuccess(user);
      toast.success('✅ Đăng nhập thành công!');
      setEmail("");
      setPassword("");
      setError("");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

return (
  <>
    <div className="login-overlay">
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <h2>Đăng nhập</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="login-btn" onClick={handleLogin}>
          Đăng nhập
        </button>
        <button 
          className="close-btn" 
          onClick={() => {
            setError("");
            setEmail("");
            setPassword("");
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
    <ToastContainer position="top-center" autoClose={2000} />
  </>
);

}
