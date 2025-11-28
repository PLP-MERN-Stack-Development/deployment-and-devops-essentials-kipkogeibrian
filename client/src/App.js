import React, { useState } from "react";
import { AuthProvider, useAuth, LoginForm, RegisterForm } from "./components/Auth";
import LibraryApp from "./components/LibraryApp";

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "white",
    flexDirection: "column",
    gap: "1rem"
  }
};

function AuthWrapper() {
  const { user, loading, isAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return React.createElement("div", { style: styles.app },
      React.createElement("div", { style: styles.loadingContainer },
        React.createElement("h2", null, "🔄 Loading Library System...")
      )
    );
  }

  if (!user) {
    return React.createElement("div", { style: styles.app },
      isLogin 
        ? React.createElement(LoginForm, { onSwitchToRegister: () => setIsLogin(false) })
        : React.createElement(RegisterForm, { onSwitchToLogin: () => setIsLogin(true) })
    );
  }

  return React.createElement("div", { style: styles.app },
    React.createElement("div", null,
      // ... your existing header and navigation
      
      React.createElement("div", { style: { padding: "2rem" } },
        // ... your existing routes
        
        // Add admin routes
        isAdmin && window.location.hash === "#/admin/users" && 
          React.createElement(AdminUsers),
          
        isAdmin && window.location.hash.includes("#/admin/users/") && 
          !window.location.hash.includes("/edit") &&
          !window.location.hash.includes("/create") &&
          React.createElement(UserDetail, { 
            userId: window.location.hash.split("/").pop() 
          }),
        
        // Add more admin routes as needed
        
        // Main LibraryApp component
        React.createElement(LibraryApp)
      )
    )
  );
}

function App() {
  return React.createElement(AuthProvider, null,
    React.createElement(AuthWrapper)
  );
}

export default App;