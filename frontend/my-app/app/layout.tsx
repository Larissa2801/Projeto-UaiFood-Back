// frontend/my-app/app/layout.tsx
import "./globals.css";

// 1. Importe o AuthProvider e o Toaster (para as notificações)
import { AuthProvider } from "../src/contexts/AuthContext";
import { CartProvider } from "../src/contexts/CartContext";
import { Toaster } from "sonner";

// [Opcional] Mantenha outros imports de CSS/Fonts/Metadata aqui

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            {" "}
            {/* 👈 ENVOLVENDO AQUI */}
            {children}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
