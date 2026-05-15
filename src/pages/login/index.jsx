import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import loginimg from "../../assets/image/log-in.png";
import { toastFn } from "@/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginAPI } from "../../ApiServices/services";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const {auth,login} = useAuth();
  const [disabledButton, setDisabledButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    user: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!disabledButton) {
      setDisabledButton(true);
      try {
        if (!form?.user.trim() || !form?.password.trim()) {
          toastFn("error", "UserName and password required");
          return;
        }

        const body = {
          user: form?.user,
          password: form?.password
        };

        const result = await loginAPI(body);

        const { success, data, message } = result || {};
        if (success) {
          setDisabledButton(false);
          if (data) {
            login(data)
            toastFn("success", message || "Login successfully!");
            navigate("/");
          } else {
            toastFn("error", "Token not received from server");
          }
        } else {
          toastFn("error", message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        toastFn("error", error.message || "Something went wrong during login");
      } finally {
        setDisabledButton(false);
      }
    }
  };

  useEffect(() => {
    if (auth?.token) navigate("/");
  }, [navigate]);

  return (
    <div className="login-main-cover">
      <form onSubmit={handleLogin}>
        <div className="login-background">
          <div className="login-shape">
            <img src={loginimg} alt="logo" />
          </div>
        </div>
        <h3>Admin here</h3>

        <label htmlFor="username">UserName</label>
        <input
          placeholder="Username"
          type="text"
          id="user"
          name="user"
          value={form?.user}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form?.password}
            onChange={handleChange}
          />

          <span
            className="password-eye"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" disabled={disabledButton}
          style={{
            background: disabledButton ? "#ccc" : "",
            cursor: disabledButton ? "not-allowed" : "pointer",
          }}>Login</button>
      </form>
    </div>
  );
};

export default Login;