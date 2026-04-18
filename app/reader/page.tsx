'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Quote, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// === CONEXÃO OFICIAL COM AS SUAS CHAVES CORRETAS ===
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

  // 1. CARREGAR DADOS REAIS DO BANCO
  useEffect(() => {
    async function loadData() {
      try {
        // Busca a lista completa para o Índice (Menu Lateral)
        const { data: lista } = await supabase
          .from('capitulos')
          .select('*')
          .order('ordem', { ascending: true });
        
        if (lista) setTodosCapitulos(lista);

        // Busca o Capítulo 1 para abrir logo de cara
        const { data: inicial } = await supabase
          .from('capitulos')
          .select('*')
          .eq('ordem', 1)
          .single();

        if (inicial) setCapitulo(inicial);
      } catch (err) {
        console.error("Erro na conexão:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Função para trocar de capítulo ao clicar no índice
  const mudarCapitulo = (novoCap: any) => {
    setCapitulo(novoCap);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FDF9F3] text-[#2D0B5A]'}`}>
      
      {/* HEADER ROXO FIXO (PADRÃO STUDIO) */}
      <div className="bg-[#4C1D95] text-white p-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xs font-black uppercase tracking-[0.2em]">Tempo a Dois</h1>
        <button onClick={() => setIsMenuOpen(true)}>
          <List size={24} />
        </button>
      </div>

      {/* MENU LATERAL (ÍNDICE) - AGORA VAI APARECER COM OS DADOS */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-80 bg-[#2D0B5A] h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-yellow-500 font-bold tracking-widest text-xs uppercase">Índice</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/50"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {todosCapitulos.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => mudarCapitulo(item)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${capitulo?.id === item.id ? 'bg-white/10 border-l-4 border-yellow-500' : 'hover:bg-white/5'}`}
                >
                  <p className="text-white font-medium text-sm">{item.titulo_capitulo}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE LEITURA REESTABELECIDA */}
      <div className="max-w-md mx-auto px-8 py-10 pb-32">
        {loading ? (
          <div className="text-center py-20 italic opacity-50">Sincronizando capítulos...</div>
        ) : (
          <>
            {/* TÍTULO ROXO DINÂMICO */}
            <h2 className={`text-[28px] font-black leading-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#4C1D95]'}`}>
              {capitulo?.titulo_capitulo}
            </h2>

            {/* VERSÍCULO COM ASPAS DOURADAS (PEGANDO DO BANCO) */}
            {capitulo?.frase_destaque && (
              <div className="flex gap-4 mb-10">
                <Quote size={40} className="text-[#B28C3D] opacity-80 flex-shrink-0" fill="currentColor" />
                <p className="text-xl font-serif italic font-medium leading-relaxed text-[#B28C3D]">
                  "{capitulo.frase_destaque}"
                </p>
              </div>
            )}

            {/* CONTEÚDO DO TEXTO COM FUNDO CREME */}
            <div 
              className="leading-relaxed font-serif space-y-6 text-justify"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: capitulo?.conteudo || "" }}
            />

            {/* VERSÍCULO DE RODAPÉ */}
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

      {/* BARRA DE FERRAMENTAS INFERIOR */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-around items-center border-t backdrop-blur-md z-40 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
        <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="text-xl font-bold p-2">- A</button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-4 rounded-full shadow-xl transition-transform active:scale-90 ${isDarkMode ? 'bg-yellow-400 text-black' : 'bg-[#4C1D95] text-white'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button onClick={() => setFontSize(prev => Math.min(28, prev + 2))} className="text-xl font-bold p-2">+ A</button>
      </div>
    </div>
  );
}
