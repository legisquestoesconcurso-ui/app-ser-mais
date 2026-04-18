'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Quote, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Conexão com suas credenciais reais do Supabase
const supabase = createClient(
  'https://gelrtnknowueuzsrjphe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbHJ0bmtub3d1ZXV6c3JqcGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMDUzOTMsImV4cCI6MjAzMDc4MTM5M30.S0Z2X1VfRndfX1VfRndfX1VfRndfX1VfRndfX1VfRndfX1VfRndfX1V'
);

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [capitulo, setCapitulo] = useState<any>(null);
  const [todosCapitulos, setTodosCapitulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carregar Dados do Banco (Conteúdo e Lista para o Índice)
  useEffect(() => {
    async function loadData() {
      try {
        // Busca todos para o índice
        const { data: lista } = await supabase.from('capitulos').select('*').order('ordem', { ascending: true });
        if (lista) setTodosCapitulos(lista);

        // Busca o capítulo 1 por padrão
        const { data: inicial } = await supabase.from('capitulos').select('*').eq('ordem', 1).single();
        if (inicial) setCapitulo(inicial);
      } catch (err) {
        console.error("Erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Função para mudar de capítulo pelo índice
  const mudarCapitulo = (cap: any) => {
    setCapitulo(cap);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FDF9F3] text-[#2D0B5A]'}`}>
      
      {/* HEADER FIXO ROXO */}
      <div className="bg-[#4C1D95] text-white p-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xs font-black uppercase tracking-[0.2em]">Tempo a Dois</h1>
        <button onClick={() => setIsMenuOpen(true)}>
          <List size={24} />
        </button>
      </div>

      {/* ÍNDICE LATERAL (SIDEBAR) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-80 bg-[#2D0B5A] h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-yellow-500 font-bold tracking-widest text-sm uppercase">Conteúdo do E-book</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/50"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {todosCapitulos.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => mudarCapitulo(item)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${capitulo?.id === item.id ? 'bg-white/10 border-l-4 border-yellow-500' : 'hover:bg-white/5'}`}
                >
                  <p className={`text-xs font-bold ${capitulo?.id === item.id ? 'text-yellow-500' : 'text-white/70'}`}>
                    Capítulo {item.ordem}
                  </p>
                  <p className="text-white font-medium text-sm mt-1">{item.titulo_capitulo}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE LEITURA */}
      <div className="max-w-md mx-auto px-8 py-10 pb-32">
        {loading ? (
          <p className="text-center italic opacity-50">Sincronizando com o altar...</p>
        ) : (
          <>
            <h2 className={`text-[28px] font-black leading-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#4C1D95]'}`}>
              {capitulo?.titulo_capitulo}
            </h2>

            {capitulo?.frase_destaque && (
              <div className="flex gap-4 mb-10">
                <Quote size={40} className="text-[#B28C3D] opacity-80 flex-shrink-0" fill="currentColor" />
                <p className="text-xl font-serif italic font-medium leading-relaxed text-[#B28C3D]">
                  "{capitulo.frase_destaque}"
                </p>
              </div>
            )}

            <div 
              className="leading-relaxed font-serif space-y-6 text-justify mb-10"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: capitulo?.conteudo || "" }}
            />
            
            {capitulo?.versiculo_base && (
              <div className="mt-12 pt-8 border-t border-[#B28C3D]/20">
                <p className="text-center font-serif italic text-[#B28C3D] opacity-80">
                  — {capitulo.versiculo_base}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* FERRAMENTAS INFERIORES */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-around items-center border-t backdrop-blur-md z-40 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
        <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="font-bold">- A</button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-4 rounded-full shadow-xl ${isDarkMode ? 'bg-yellow-400 text-black' : 'bg-[#4C1D95] text-white'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button onClick={() => setFontSize(prev => Math.min(28, prev + 2))} className="font-bold">+ A</button>
      </div>
    </div>
  );
}
