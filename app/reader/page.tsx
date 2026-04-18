'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Quote } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Conexão Direta
const supabase = createClient(
  'https://gelrtnknowueuzsrjphe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbHJ0bmtub3d1ZXV6c3JqcGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMDUzOTMsImV4cCI6MjAzMDc4MTM5M30.S0Z2X1VfRndfX1VfRndfX1VfRndfX1VfRndfX1VfRndfX1VfRndfX1V' 
);

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [capitulo, setCapitulo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCapitulo() {
      try {
        const { data, error } = await supabase
          .from('capitulos')
          .select('*')
          .eq('ordem', 1) 
          .single();

        if (data) {
          setCapitulo(data);
        } else {
          // Texto de segurança caso o banco não responda
          setCapitulo({
            titulo_capitulo: "Capítulo 1: O Altar do Tempo",
            frase_destaque: "O amor não sobrevive de sobras de tempo; ele floresce na prioridade do agora.",
            conteudo: "<p>Carregando conteúdo do banco...</p>"
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCapitulo();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FDF9F3] text-[#2D0B5A]'}`}>
      
      {/* HEADER ROXO ORIGINAL DO STUDIO */}
      <div className="bg-[#4C1D95] text-white p-6 flex justify-between items-center sticky top-0 z-30 shadow-lg">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xs font-black uppercase tracking-[0.2em]">Tempo a Dois</h1>
        <button><List size={24} /></button>
      </div>

      <div className="max-w-md mx-auto px-8 py-10 pb-32">
        {/* TÍTULO ROXO DO CAPÍTULO */}
        <h2 className={`text-[28px] font-black leading-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#4C1D95]'}`}>
          {capitulo?.titulo_capitulo || "Carregando..."}
        </h2>

        {/* VERSÍCULO COM ASPAS DOURADAS */}
        <div className="flex gap-4 mb-10">
          <Quote size={40} className="text-[#B28C3D] opacity-80 flex-shrink-0" fill="currentColor" />
          <p className="text-xl font-serif italic font-medium leading-relaxed text-[#B28C3D]">
            "{capitulo?.frase_destaque || "Priorize quem você ama."}"
          </p>
        </div>

        {/* CONTEÚDO DO TEXTO */}
        <div 
          className="leading-relaxed font-serif space-y-6 text-lg text-justify"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: capitulo?.conteudo || "" }}
        />
      </div>

      {/* FERRAMENTAS INFERIORES */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-around items-center border-t backdrop-blur-md z-40 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
        <div className="flex items-center gap-8">
          <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="text-xl font-bold">- A</button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-4 rounded-full shadow-2xl transition-transform active:scale-90 ${isDarkMode ? 'bg-yellow-400 text-black' : 'bg-[#4C1D95] text-white'}`}
          >
            {isDarkMode ? <Sun size={26} /> : <Moon size={26} />}
          </button>

          <button onClick={() => setFontSize(prev => Math.min(28, prev + 2))} className="text-xl font-bold">+ A</button>
        </div>
      </div>
    </div>
  );
}
