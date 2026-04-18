'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Quote } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase (usando suas credenciais)
const supabase = createClient(
  'https://gelrtnknowueuzsrjphe.supabase.co',
  'SUA_ANON_KEY_AQUI' // Lembre-se de manter sua chave real aqui
);

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [capitulo, setCapitulo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCapitulo() {
      // Busca o primeiro capítulo (ou você pode passar um ID via URL depois)
      const { data, error } = await supabase
        .from('capitulos')
        .select('titulo_capitulo, frase_destaque, versiculo_base, conteudo')
        .eq('ordem', 1) 
        .single();

      if (data) setCapitulo(data);
      setLoading(false);
    }
    fetchCapitulo();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">Carregando...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FDF9F3] text-[#2D0B5A]'}`}>
      
      {/* HEADER ROXO PREMIUM */}
      <div className="bg-[#4C1D95] text-white p-6 flex justify-between items-center sticky top-0 z-30 shadow-lg">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-sm font-black uppercase tracking-[0.2em]">Tempo a Dois</h1>
        <button><List size={24} /></button>
      </div>

      <div className="max-w-md mx-auto px-8 py-10 pb-32">
        {/* TÍTULO ROXO DINÂMICO */}
        <h2 className={`text-[28px] font-black leading-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#4C1D95]'}`}>
          {capitulo?.titulo_capitulo}
        </h2>

        {/* VERSÍCULO/FRASE DESTAQUE COM ASPAS DOURADAS */}
        {capitulo?.frase_destaque && (
          <div className="flex gap-4 mb-10">
            <Quote size={40} className="text-[#B28C3D] opacity-80 flex-shrink-0" fill="currentColor" />
            <p className="text-xl font-serif italic font-medium leading-relaxed text-[#B28C3D]">
              "{capitulo.frase_destaque}"
            </p>
          </div>
        )}

        {/* CONTEÚDO DO EBOOK */}
        <div 
          className="leading-relaxed font-serif space-y-6 text-justify"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: capitulo?.conteudo }}
        />
      </div>

      {/* BARRA DE FERRAMENTAS INFERIOR */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-around items-center border-t backdrop-blur-md z-40 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
        <div className="flex items-center gap-6">
          <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="p-2 font-bold">- A</button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-4 rounded-full shadow-lg ${isDarkMode ? 'bg-yellow-400 text-black' : 'bg-[#4C1D95] text-white'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <button onClick={() => setFontSize(prev => Math.min(26, prev + 2))} className="p-2 font-bold">+ A</button>
        </div>
      </div>
    </div>
  );
}
