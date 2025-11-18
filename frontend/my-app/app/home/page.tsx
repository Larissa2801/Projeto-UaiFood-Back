// frontend/my-app/app/home/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

// Definição da interface (mantida do código anterior)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

// URL da API (mantida para referência futura)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function HomePage() {
  const { user, token } = useAuth();
  const { items, addToCart } = useCart();
  const router = useRouter();

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DADOS MOCK PARA VISUALIZAÇÃO E TESTE SEM BACKEND
  
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Mega Bacon Burger",
      description:
        "Hambúrguer de 200g, queijo cheddar, bacon crocante, alface e molho da casa.",
      price: 35.9,
    },
    {
      id: "2",
      name: "Batata Frita Rustica",
      description: "Porção de batatas rústicas com tempero especial.",
      price: 15.5,
    },
    {
      id: "3",
      name: "Coca-Cola Lata",
      description: "350ml, bem gelada.",
      price: 7.0,
    },
  ];
  

  // O useEffect agora usa os dados mock
  
  useEffect(() => {
    /*
    // ⚠️ QUANDO O BACKEND ESTIVER PRONTO, COMENTE ESTE BLOCO E DESCOMENTE A LÓGICA DE BUSCA DA API
    const loadMockProducts = () => {
      setProducts(mockProducts);
      setIsLoading(false);
    };
    loadMockProducts();
    */

     // LÓGICA DE BUSCA REAL (DESCOMENTAR QUANDO O BACKEND ESTIVER NO AR)
    const fetchProducts = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Token de autenticação ausente.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (e: any) {
        setError(e.message || "Falha ao conectar com o servidor.");
        toast.error("Falha ao carregar o cardápio. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    
  }, [token]);

  if (isLoading) {
    return <div className="text-center p-8">Carregando cardápio...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Erro: {error}</div>;
  }

  // 3. Renderização Principal (Cardápio)
  return (
    <>
      <div className="p-4 md:p-8 pb-20 max-w-7xl mx-auto">
        {/* === HEADER PRINCIPAL === */}
        <header className="mb-12 pt-4 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            Cardápio UAIfood
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Selecione seus itens favoritos!
          </p>
        </header>

        {/* === SEÇÃO DE PRODUTOS === */}
        {/* CORREÇÃO: Usando no máximo 3 colunas para melhor distribuição e centralização no container max-w-7xl */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col transition duration-300 hover:shadow-2xl"
            >
              {/* Opcional: Aqui você adicionaria uma imagem do produto */}
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                [Imagem do Produto]
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                  {product.description}
                </p>

                <div className="mt-auto flex justify-between items-center pt-2">
                  <span className="text-2xl font-extrabold text-green-600">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>

                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`Adicionado: ${product.name}`);
                    }}
                    // Botão estilizado com a cor primary (Laranja)
                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* BOTÃO FIXO DO CARRINHO (Mantido) */}
      {items.length > 0 && (
        <button
          onClick={() => router.push("/cart")}
          className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center space-x-2 transition hover:bg-green-700 z-50"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>
            Ver Carrinho ({items.length} {items.length === 1 ? "item" : "itens"}
            )
          </span>
        </button>
      )}
    </>
  );
}
