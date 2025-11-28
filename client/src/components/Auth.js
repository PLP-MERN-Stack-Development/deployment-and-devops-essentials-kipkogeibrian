import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const authStyles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem"
  },
  loginForm: {
    background: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px"
  },
  formGroup: {
    marginBottom: "1rem"
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s"
  },
  inputFocus: {
    outline: "none",
    borderColor: "#667eea"
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  buttonHover: {
    background: "#5a6fd8"
  },
  buttonDisabled: {
    background: "#a0aec0",
    cursor: "not-allowed"
  },
  error: {
    background: "#fed7d7",
    color: "#742a2a",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #feb2b2"
  },
  success: {
    background: "#c6f6d5",
    color: "#22543d",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #9ae6b4"
  },
  switchForm: {
    textAlign: "center",
    marginTop: "1rem",
    color: "#718096"
  },
  switchLink: {
    color: "#667eea",
    cursor: "pointer",
    textDecoration: "underline"
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        // Verify token is still valid
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, message: "Login successful" };
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, message: "Registration successful" };
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Compute isAdmin based on user role - supports multiple admin role types
  const isAdmin = user?.role === "admin" || user?.role === "administrator";

  // Create the context value object
  const contextValue = {
    user, 
    loading, 
    login, 
    register, 
    logout, 
    isAdmin,
    checkAuth 
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const getInputStyle = (field) => {
    return inputFocus[field] 
      ? { ...authStyles.input, ...authStyles.inputFocus }
      : authStyles.input;
  };

  const getButtonStyle = () => {
    const baseStyle = authStyles.button;
    return loading 
      ? { ...baseStyle, ...authStyles.buttonDisabled }
      : baseStyle;
  };

  return React.createElement("div", { style: authStyles.loginContainer },
    React.createElement("form", { onSubmit: handleSubmit, style: authStyles.loginForm },
      React.createElement("h2", { style: { textAlign: "center", marginBottom: "1rem" } }, "📚 Library Login"),
      
      error && React.createElement("div", { style: authStyles.error },
        React.createElement("strong", null, "Error: "),
        error
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "email",
          placeholder: "Email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          onFocus: () => setInputFocus(prev => ({ ...prev, email: true })),
          onBlur: () => setInputFocus(prev => ({ ...prev, email: false })),
          style: getInputStyle('email'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "password",
          placeholder: "Password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          onFocus: () => setInputFocus(prev => ({ ...prev, password: true })),
          onBlur: () => setInputFocus(prev => ({ ...prev, password: false })),
          style: getInputStyle('password'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("button", { 
        type: "submit", 
        style: getButtonStyle(),
        disabled: loading
      }, loading ? "Logging in..." : "Login"),
      
      React.createElement("div", { style: authStyles.switchForm },
        React.createElement("span", null, "Don't have an account? "),
        React.createElement("span", { 
          onClick: onSwitchToRegister,
          style: authStyles.switchLink,
          onMouseEnter: (e) => e.target.style.color = "#5a6fd8",
          onMouseLeave: (e) => e.target.style.color = "#667eea"
        }, "Register here")
      ),
      
      React.createElement("div", { style: { marginTop: "1rem", fontSize: "0.9rem", color: "#718096" } },
        React.createElement("p", { style: { margin: "0.5rem 0" } }, "Demo Admin: admin@library.com / admin123"),
        React.createElement("p", { style: { margin: "0.5rem 0" } }, "Or register a new account")
      )
    )
  );
}

export function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState({ 
    name: false, email: false, password: false, confirmPassword: false 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  const getInputStyle = (field) => {
    return inputFocus[field] 
      ? { ...authStyles.input, ...authStyles.inputFocus }
      : authStyles.input;
  };

  const getButtonStyle = () => {
    const baseStyle = authStyles.button;
    return loading 
      ? { ...baseStyle, ...authStyles.buttonDisabled }
      : baseStyle;
  };

  return React.createElement("div", { style: authStyles.loginContainer },
    React.createElement("form", { onSubmit: handleSubmit, style: authStyles.loginForm },
      React.createElement("h2", { style: { textAlign: "center", marginBottom: "1rem" } }, "📚 Create Account"),
      
      error && React.createElement("div", { style: authStyles.error },
        React.createElement("strong", null, "Error: "),
        error
      ),
      
      success && React.createElement("div", { style: authStyles.success },
        React.createElement("strong", null, "Success: "),
        success
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "text",
          name: "name",
          placeholder: "Full Name",
          value: formData.name,
          onChange: handleChange,
          onFocus: () => handleFocus('name'),
          onBlur: () => handleBlur('name'),
          style: getInputStyle('name'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "email",
          name: "email",
          placeholder: "Email",
          value: formData.email,
          onChange: handleChange,
          onFocus: () => handleFocus('email'),
          onBlur: () => handleBlur('email'),
          style: getInputStyle('email'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "password",
          name: "password",
          placeholder: "Password (min 6 characters)",
          value: formData.password,
          onChange: handleChange,
          onFocus: () => handleFocus('password'),
          onBlur: () => handleBlur('password'),
          style: getInputStyle('password'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("div", { style: authStyles.formGroup },
        React.createElement("input", {
          type: "password",
          name: "confirmPassword",
          placeholder: "Confirm Password",
          value: formData.confirmPassword,
          onChange: handleChange,
          onFocus: () => handleFocus('confirmPassword'),
          onBlur: () => handleBlur('confirmPassword'),
          style: getInputStyle('confirmPassword'),
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement("button", { 
        type: "submit", 
        style: getButtonStyle(),
        disabled: loading
      }, loading ? "Creating Account..." : "Register"),
      
      React.createElement("div", { style: authStyles.switchForm },
        React.createElement("span", null, "Already have an account? "),
        React.createElement("span", { 
          onClick: onSwitchToLogin,
          style: authStyles.switchLink,
          onMouseEnter: (e) => e.target.style.color = "#5a6fd8",
          onMouseLeave: (e) => e.target.style.color = "#667eea"
        }, "Login here")
      )
    )
  );
}

export function UserMenu() {
  const { user, logout, isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const userMenuStyles = {
    container: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "white",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      zIndex: 1000
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    adminBadge: {
      background: "#f56565",
      color: "white",
      padding: "0.25rem 0.5rem",
      borderRadius: "10px",
      fontSize: "0.8rem",
      fontWeight: "bold"
    },
    logoutBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      padding: "0.25rem",
      borderRadius: "4px",
      transition: "background 0.3s"
    },
    logoutBtnHover: {
      background: "#f7fafc"
    }
  };

  const getLogoutButtonStyle = () => {
    return isHovered 
      ? { ...userMenuStyles.logoutBtn, ...userMenuStyles.logoutBtnHover }
      : userMenuStyles.logoutBtn;
  };

  if (!user) return null;

  return React.createElement("div", { style: userMenuStyles.container },
    React.createElement("div", { style: userMenuStyles.userInfo },
      React.createElement("span", null, `👋 ${user.name}`),
      isAdmin && React.createElement("span", { style: userMenuStyles.adminBadge }, "Admin")
    ),
    React.createElement("button", { 
      onClick: logout,
      style: getLogoutButtonStyle(),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      title: "Logout"
    }, "🚪")
  );
}

// Debug component to verify auth context
export function AuthDebug() {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return null;
  
  return React.createElement("div", { 
    style: { 
      position: "fixed", 
      bottom: "10px", 
      left: "10px", 
      background: "rgba(0,0,0,0.8)", 
      color: "white", 
      padding: "10px", 
      borderRadius: "5px",
      zIndex: 9999,
      fontSize: "12px",
      fontFamily: "monospace"
    } 
  },
    React.createElement("div", null, `User: ${user ? user.name : "null"}`),
    React.createElement("div", null, `Role: ${user ? user.role : "null"}`),
    React.createElement("div", null, `isAdmin: ${isAdmin ? "YES" : "NO"}`),
    React.createElement("div", null, `ID: ${user ? user._id : "null"}`)
  );
}

export default AuthContext;