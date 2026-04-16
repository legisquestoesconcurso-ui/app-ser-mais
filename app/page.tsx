'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Home, Lock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// CONFIGURAÇÃO SUPABASE (Real)
// ==========================================
const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx4l5U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function HomeScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Lógica do Carrossel Automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Lógica de Busca de Dados (Supabase)
  useEffect(() => {
    const loadLibrary = async () => {
      setLoading(true);
      try {
        // 1. Busca todos os e-books da tabela 'ebooks'
        const { data: ebooksData, error: ebooksError } = await supabase
          .from('ebooks')
          .select('*');
        
        if (ebooksError) throw ebooksError;

        // 2. Busca o acesso do usuário 'user_123' na tabela 'user_access'
        const { data: accessData, error: accessError } = await supabase
          .from('user_access')
          .select('book_id')
          .eq('user_id', 'user_123');

        if (accessError) throw accessError;

        // Cria um Set com os IDs dos livros que o usuário tem acesso para busca rápida
        const accessSet = new Set(accessData?.map(a => a.book_id) || []);

        // 3. Formata os livros com a flag hasAccess
        const formattedBooks = (ebooksData || []).map(book => ({
          id: book.id,
          title: book.titulo || 'Sem Título',
          author: book.author || '',
          cover: book.capa_url || 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?auto=format&fit=crop&w=400&q=80',
          hasAccess: accessSet.has(book.id)
        }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error('Erro ao carregar biblioteca do Supabase:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLibrary();
  }, []);

  return (
    <div className="min-h-screen bg-[#3b1261] flex flex-col font-sans relative pb-20">
      
      {/* HEADER PREMIUM */}
      <header className="flex justify-between items-center px-6 pt-14 pb-4">
        <div className="relative flex items-center justify-center w-14 h-14">
          {/* Logo original, clara, com sombra preta sutil por trás para profundidade 3D */}
          <img 
            src="https://i.postimg.cc/8Fw2649C/ChatGPT-Image-11-de-abr-de-2026-14-34-31.jpg" 
            alt="SER+ Logo" 
            className="w-full h-full object-cover rounded-2xl"
            style={{ 
              filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))' 
            }}
          />
        </div>
        <button className="w-10 h-10 rounded-full border border-yellow-500/40 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-transform active:scale-95">
          <User className="text-yellow-400" size={20} />
        </button>
      </header>

      {/* CARROSSEL DE ANÚNCIOS (BANNER SUPERIOR) */}
      <div className="px-6 mb-10">
        <div className="relative h-44 rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-yellow-500/20">
          {/* Fundo Fixo: Dia Claro e Inspirador (Céu Azul e Montanhas) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-white/10 to-yellow-300/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/20"></div> {/* Leve escurecimento para garantir leitura */}

          <AnimatePresence mode="wait">
            {currentSlide === 0 ? (
              <motion.div
                key="slide1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center px-8 text-center"
              >
                <p className="text-[#FDFBF7] font-serif text-lg md:text-xl leading-snug font-bold tracking-wider drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                  Novos conteúdos para edificar sua jornada.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="slide2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center p-5"
              >
                {/* Capa do Livro (Esquerda) com Sombra Profunda */}
                <div className="w-[35%] h-full relative rounded-xl overflow-hidden shadow-[0_15px_25px_rgba(0,0,0,0.8)] border border-white/20 z-10">
                  <img 
                    src="https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/capa-casamento.png.png" 
                    alt="Casamento Forjado" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Texto (Direita) */}
                <div className="w-[65%] pl-5 flex flex-col justify-center z-10">
                  <h3 className="text-[#FDFBF7] font-serif text-sm md:text-base font-bold tracking-wider mb-1 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                    EM BREVE: Casamento Forjado
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm font-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Transformações que fortalecem a união.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicadores do Carrossel */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
            {[0, 1].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSlide ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/40'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* GRADE DA BIBLIOTECA (VISUAL DE LUXO) */}
      <div className="flex-1 bg-gradient-to-b from-[#fdfbf7] to-white rounded-t-[40px] px-6 pt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative z-10">
        <h2 className="text-3xl font-serif text-[#b48c36] mb-8 drop-shadow-sm px-2">Sua Biblioteca</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 pb-10">
            {books.map((book) => (
              book.hasAccess ? (
                // CARD: ADQUIRIDO
                <div key={book.id} className="flex flex-col items-center group">
                  <Link href={`/reader`} className="w-full">
                    {/* Capa Limpa com Sombra Profunda */}
                    <div className="w-full aspect-[2/3] relative rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-gray-200/50 transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                      <Image src={book.cover} alt={book.title} fill className="object-cover" />
                    </div>
                  </Link>
                  {/* Botão Flutuante Abaixo */}
                  <div className="mt-5 w-[90%] bg-[#2e1065] border border-yellow-500/40 text-yellow-400 text-[10px] sm:text-xs font-bold py-3 px-2 rounded-full text-center flex items-center justify-center gap-1.5 shadow-lg">
                    <CheckCircle size={14} /> ADQUIRIDO
                  </div>
                </div>
              ) : (
                // CARD: BLOQUEADO
                <div key={book.id} className="flex flex-col items-center opacity-90">
                  {/* Capa Bloqueada (Casamento Forjado Desfocado) */}
                  <div className="w-full aspect-[2/3] relative rounded-2xl overflow-hidden shadow-md border border-gray-300">
                    <img 
                      src="https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/capa-casamento.png.png" 
                      alt="Casamento Forjado" 
                      className="w-full h-full object-cover blur-[3px] grayscale-[30%] opacity-90 scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  </div>
                  {/* Botão Flutuante Abaixo */}
                  <div className="mt-5 w-[90%] bg-gray-100 border border-gray-300 text-gray-500 text-[10px] sm:text-xs font-bold py-3 px-2 rounded-full text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Lock size={12} /> BLOQUEADO
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* NAVEGAÇÃO INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-4 px-6 z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1">
          <Home className="text-yellow-600" fill="currentColor" size={24} />
          <span className="text-yellow-700 text-[10px] font-bold">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <Search className="text-gray-800" size={24} />
          <span className="text-gray-800 text-[10px] font-medium">Buscar</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <User className="text-gray-800" size={24} />
          <span className="text-gray-800 text-[10px] font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
