// frontend/pages/_app.tsx (Exemplo para Pages Router)

import type { AppProps } from "next/app";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Envolve toda a aplicação no Provedor de Autenticação
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
