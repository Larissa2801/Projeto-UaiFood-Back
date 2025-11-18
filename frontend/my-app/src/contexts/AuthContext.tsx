// frontend/src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- DEFINIÇÃO DE TIPOS ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
    consent: boolean
  ) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

// --- SETUP DO CONTEXTO ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⚠️ CORRETO:
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// --- PROVIDER ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados salvos
  useEffect(() => {
    const storedToken = localStorage.getItem("@App:token");
    const storedUser = localStorage.getItem("@App:user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }
    setIsLoading(false);
  }, []);

  // --- LOGIN ---
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log("RESPOSTA LOGIN:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return {
          error: new Error("Resposta inválida do servidor (HTML recebido)."),
        };
      }

      if (!response.ok) {
        return { error: new Error(data.error || "Falha na autenticação.") };
      }

      const { token, user: userData } = data;

      setToken(token);
      setUser(userData);
      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(userData));

      return { error: null };
    } catch (err) {
      return {
        error: new Error("Erro de rede. Verifique se o back-end está rodando."),
      };
    }
  };

  // --- CADASTRO ---
  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    consent: boolean
  ) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone, consent }),
      });

      const text = await response.text();
      console.log("RESPOSTA CADASTRO:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return {
          error: new Error("Resposta inválida do servidor (HTML recebido)."),
        };
      }

      if (!response.ok) {
        return {
          error: new Error(data.error || "Falha ao cadastrar usuário."),
        };
      }

      return { error: null };
    } catch (err) {
      return {
        error: new Error("Erro de rede. Verifique se o back-end está rodando."),
      };
    }
  };

  // --- LOGOUT ---
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
