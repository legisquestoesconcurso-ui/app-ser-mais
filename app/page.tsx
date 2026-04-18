'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Home, Play } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // LINKS REAIS DO SEU SUPABASE E GITHUB
  const URL_LOGO = "/icon.png"; 
  const URL_TEMPO_A_DOIS = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/Design%20sem%20nome.png";
  const URL_CASAMENTO_FORJADO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/capa-casamento.png.png";

  const slides = [
    {
      bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
      capa: URL_CASAMENTO_FORJADO,
      tag: "EM BREVE:",
      titulo: "Casamento Forjado",
      desc: "Transformações que fortalecem a união."
    },
    {
      bg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      capa: URL_TEMPO_A_DOIS,
      tag: "DESTAQUE DO MÊS:",
      titulo: "Tempo a Dois",
      desc: "Nutrindo o relacionamento a cada capítulo."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center font-sans overflow-x-hidden">
      
      {/* HEADER PREMIUM */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center z-20">
        <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center min-w-[55px] min-h-[55px]">
          <img src={URL_LOGO} alt="Logo Ser+" className="h-10 w-auto object-contain px-1" />
        </div>
        <button className="bg-white/10 p-3 rounded-full text-yellow-500 shadow-lg border border-white/5">
          <User size={24} />
        </button>
      </div>

      {/* CARROSSEL DINÂMICO (RESTAURADO) */}
      <div className="w-[92%] max-w-md h-64 relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10 mt-[-10px] z-10">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.bg} className="w-full h-full object-cover brightness-[0.4]" alt="Fundo" />
            <div className="absolute inset-0 p-6 flex items-center gap-5 text-left bg-gradient-to-t from-black/90 via-transparent to-transparent">
              <img src={slide.capa} className="w-24 h-34 object-cover rounded-xl shadow-2xl border border-white/20" alt="Capa" />
              <div className="text-white">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-yellow-400">{slide.tag}</h3>
                <h2 className="text-2xl font-black mt-1 leading-tight">{slide.titulo}</h2>
                <p className="text-[12px] opacity-80 mt-1">{slide.desc}</p>
              </div>
            </div>
          </div>
        ))}
        {/* INDICADORES */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* SEÇÃO BIBLIOTECA (VISUAL BRANCO LIMPO) */}
      <div className="flex-1 w-full bg-white rounded-t-[50px] px-8 py-12 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] relative z-20 mt-[-20px]">
        <h2 className="text-4xl font-serif font-black text-[#B28C3D] mb-12 tracking-tighter">Sua Biblioteca</h2>
        
        <div className="flex flex-col items-start w-44 group">
          <div className="relative mb-6 shadow-2xl rounded-[24px] overflow-hidden active:scale-95 transition-transform duration-300">
            <img src={URL_TEMPO_A_DOIS} className="w-44 h-60 object-cover" alt="Livro Tempo a Dois" />
          </div>
          
          {/* BOTÃO CORRIGIDO: LER AGORA (SEM ACENTO) */}
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-2 hover:bg-[#3d107a] transition-colors">
            <Play size={14} fill="currentColor" />
            LER AGORA
          </Link>
        </div>
      </div>

      {/* MENU INFERIOR */}
      <div className="w-full bg-white border-t border-gray-100 py-5 px-14 flex justify-between items-center sticky bottom-0 z-50">
        <div className="flex flex-col items-center gap-1 text-yellow-600">
          <Home size={28} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300 opacity-40">
          <Search size={28} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Buscar</span>
        </div>
      </div>
    </div>
  );
}
