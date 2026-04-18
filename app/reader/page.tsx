'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Quote, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Suas chaves de conexão oficiais
const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx4l5U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [capitulo, setCapitulo] = useState<any>(null);
  const [todosCapitulos, setTodosCapitulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Busca a lista para o índice
        const { data: lista } = await supabase.from('capitulos').select('*').order('ordem', { ascending: true });
        if (lista) setTodosCapitulos(lista);

        // Busca o capítulo 1 inicial
        const { data: inicial } = await supabase.from('capitulos').select('*').eq('ordem', 1).single();
        if (inicial) setCapitulo(inicial);
      } catch (err) {
        console.error("Erro ao carregar banco:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mudarCapitulo = (novoCap: any) => {
    setCapitulo(novoCap);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FDF9F3] text-[#2D0B5A]'}`}>
      
      {/* HEADER ROXO */}
      <div className="bg-[#4C1D95] text-white p-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xs font-black uppercase tracking-[0.2em]">Tempo a Dois</h1>
        <button onClick={() => setIsMenuOpen(true)}>
          <List size={24} />
        </button>
      </div>

      {/* ÁREA DE LEITURA */}
      <div className="max-w-md mx-auto px-8 py-10 pb-32">
        {loading ? (
          <div className="text-center py-20 italic opacity-50">Sincronizando...</div>
        ) : (
          <>
            {/* IMAGEM DO CAPÍTULO (AJUSTADO PARA url_imagem) */}
            {capitulo?.url_imagem && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={capitulo.url_imagem} 
                  alt="Imagem do Capítulo"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* TÍTULO ROXO */}
            <h2 className={`text-[28px] font-black leading-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#4C1D95]'}`}>
              {capitulo?.titulo_capitulo}
            </h2>

            {/* FRASE DE DESTAQUE COM ASPAS DOURADAS */}
            {capitulo?.frase_destaque && (
              <div className="flex gap-4 mb-10">
                <Quote size={40} className="text-[#B28C3D] opacity-80 flex-shrink-0" fill="currentColor" />
                <p className="text-xl font-serif italic font-medium leading-relaxed text-[#B28C3D]">
                  "{capitulo.frase_destaque}"
                </p>
              </div>
            )}

            {/* CONTEÚDO PRINCIPAL */}
            <div 
              className="leading-relaxed font-serif space-y-6 text-justify"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: capitulo?.conteudo || "" }}
            />
          </>
        )}
      </div>

      {/* BARRA DE FERRAMENTAS INFERIOR */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-around items-center border-t backdrop-blur-md z-40 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
        <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="text-xl font-bold p-2">- A</button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-4 rounded-full shadow-xl ${isDarkMode ? 'bg-yellow-400 text-black' : 'bg-[#4C1D95] text-white'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button onClick={() => setFontSize(prev => Math.min(28, prev + 2))} className="text-xl font-bold p-2">+ A</button>
      </div>

      {/* ÍNDICE (MENU LATERAL) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-80 bg-[#2D0B5A] h-full p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-yellow-500 font-bold uppercase text-xs tracking-widest">Capítulos</h2>
              <button onClick={() => setIsMenuOpen(false)}><X className="text-white" /></button>
            </div>
            {todosCapitulos.map((item) => (
              <button 
                key={item.id} 
                onClick={() => mudarCapitulo(item)} 
                className={`w-full text-left py-3 border-b border-white/5 transition-colors ${capitulo?.id === item.id ? 'text-yellow-500 font-bold' : 'text-white hover:text-yellow-500'}`}
              >
                {item.titulo_capitulo}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
