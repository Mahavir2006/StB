import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  hasSeenIntro: boolean;
  setHasSeenIntro: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('stuti-auth') === 'true';
  });

  const [hasSeenIntro, setHasSeenIntroState] = useState(() => {
    return sessionStorage.getItem('stuti-intro') === 'true';
  });

  const login = (password: string) => {
    if (password === '2425') {
      sessionStorage.setItem('stuti-auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('stuti-auth');
    setIsAuthenticated(false);
  };

  const setHasSeenIntro = (val: boolean) => {
    if (val) {
      sessionStorage.setItem('stuti-intro', 'true');
    } else {
      sessionStorage.removeItem('stuti-intro');
    }
    setHasSeenIntroState(val);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, hasSeenIntro, setHasSeenIntro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
