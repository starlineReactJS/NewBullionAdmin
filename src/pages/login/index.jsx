import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastFn } from "@/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginAPI } from "../../ApiServices/services";
import { useAuth } from "../../context/AuthContext";
import styled, { keyframes, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-3deg); }
  50%       { transform: translateY(-14px) rotate(-3deg); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.05); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgBase};
  font-family: ${({ theme }) => theme.font.family};
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;

  /* Background blobs */
  &::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,228,208,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -80px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(89,131,232,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  margin: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 228, 208, 0.08);
  animation: ${fadeUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  overflow: hidden;
`;

// ── Gradient top banner ──
const CardBanner = styled.div`
  background: linear-gradient(120deg, #00e4d0, #5983e8);
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;

  /* Sheen effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255,255,255,0.18) 50%,
      transparent 60%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3.5s ease infinite;
    pointer-events: none;
  }
`;

const LogoWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 4s ease-in-out infinite;

  img {
    width: 42px;
    height: 42px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

const BannerTitle = styled.h1`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
`;

const BannerSub = styled.p`
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  letter-spacing: 0.3px;
`;

// ── Form body ──
const FormBody = styled.form`
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.2px;
`;

const inputStyles = ({ theme, $hasError }) => `
  width: 100%;
  background: ${theme.colors.bgInput};
  border: 1.5px solid ${theme.colors.borderInput};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.font.family};
  font-size: ${theme.font.sizeMd};
  padding: 11px 14px;
  outline: none;
  transition: ${theme.transition};

  &::placeholder { color: ${theme.colors.textMuted}; }

  &:focus {
    background: ${theme.colors.bgInputFocus};
    border-color: #00e4d0;
    box-shadow: 0 0 0 3px rgba(0,228,208,0.15);
  }
`;

const TextInput = styled.input`
  ${({ theme }) => inputStyles({ theme })}
`;

const PasswordWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled.input`
  ${({ theme }) => inputStyles({ theme })}
  padding-right: 44px;
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  display: flex;
  align-items: center;
  padding: 0;
  transition: ${({ theme }) => theme.transition};

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightBold};
  letter-spacing: 0.5px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: ${({ theme }) => theme.transition};
  position: relative;
  overflow: hidden;
  color: #fff;

  background: ${({ disabled }) =>
    disabled
      ? "rgba(0,228,208,0.4)"
      : "linear-gradient(120deg, #00e4d0, #5983e8)"};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 228, 208, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Loading shimmer when disabled */
  ${({ disabled }) =>
    disabled &&
    `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      background-size: 200% 100%;
      animation: shimmer 1.2s ease infinite;
    }
  `}
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.divider};
  margin: ${({ theme }) => `${theme.spacing.xs} 0`};
`;

const FooterNote = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  padding-top: ${({ theme }) => theme.spacing.xs};
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Login = () => {
  const { auth, login } = useAuth();
  const [disabledButton, setDisabledButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Login page has its own ThemeProvider so it works before AdminBullionLayout mounts
  const storedMode = localStorage.getItem("theme") || "light";
  const loginTheme = storedMode === "dark" ? darkTheme : lightTheme;

  const [form, setForm] = useState({ user: "", password: "" });

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
          toastFn("error", "Username and password required");
          return;
        }
        const result = await loginAPI({ user: form.user, password: form.password });
        const { success, data, message } = result || {};
        if (success) {
          setDisabledButton(false);
          if (data) {
            login(data);
            toastFn("success", message || "Login successful!");
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
    <ThemeProvider theme={loginTheme}>
      <Page>
        <Card>
          {/* ── Banner ── */}
          <CardBanner>
            <BannerTitle>Welcome back</BannerTitle>
            <BannerSub>Sign in to your admin account</BannerSub>
          </CardBanner>

          {/* ── Form ── */}
          <FormBody onSubmit={handleLogin} noValidate>
            <FieldGroup>
              <FieldLabel htmlFor="user">Username</FieldLabel>
              <TextInput
                id="user"
                name="user"
                type="text"
                placeholder="Enter your username"
                value={form.user}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordWrap>
                <PasswordInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <EyeBtn
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </EyeBtn>
              </PasswordWrap>
            </FieldGroup>

            <SubmitBtn type="submit" disabled={disabledButton}>
              {disabledButton ? "Signing in…" : "Sign In"}
            </SubmitBtn>

            <Divider />
            <FooterNote>Bullion Admin Panel &copy; {new Date().getFullYear()}</FooterNote>
          </FormBody>
        </Card>
      </Page>
    </ThemeProvider>
  );
};

export default Login;