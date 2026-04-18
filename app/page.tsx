'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Home, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // === LINKS REAIS DO SEU SUPABASE E GITHUB ===
  const URL_LOGO = "/icon.png"; // GitHub
  const URL_TEMPO_A_DOIS = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/Design%20sem%20nome.png";
  const URL_CASAMENTO_FORJADO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/conteudo-ebook/capa-casamento.png.png";

  // DADOS DO CARROSSEL (Alternando as imagens de fundo e o texto)
  const slides = [
    {
      bg: "https://images.unsplash.com/photo-1518191392211-1376d54d9c72?auto=format&fit=crop&q=80",
      capa: URL_CASAMENTO_FORJADO,
      tag: "Em Breve:",
      titulo: "Casamento Forjado",
      desc: "Transformações que fortalecem a união.",
    },
    {
      bg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
      capa: URL_TEMPO_A_DOIS,
      tag: "Destaque do Mês:",
      titulo: "Tempo a Dois",
      desc: "Nutrindo o relacionamento a cada capítulo.",
    }
  ];

  // Lógica para mover o carrossel automaticamente a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Mude o tempo aqui (5000 = 5 segundos)
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center font-sans overflow-x-hidden relative">
      
      {/* HEADER SUPERIOR (BOTAO PERFIL + LOGO) */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center z-20">
        {/* LOGO (ICON.PNG) */}
        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center min-w-[50px] min-h-[50px]">
          <img 
            src={URL_LOGO} 
            alt="Logo Ser+ App" 
            className="h-10 w-auto object-contain"
          />
        </div>
        {/* BOTAO PERFIL */}
        <button className="bg-white/10 p-3 rounded-full text-yellow-500 hover:bg-white/20 transition-colors">
          <User size={24} />
        </button>
      </div>

      {/* ========================================================== */}
      {/* 🎡 CARROSSEL QUE SE MOVE COM O FUNDO BONITO (RESTAURADO) */}
      {/* ========================================================== */}
      <div className="w-[92%] max-w-md h-64 relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10 mt-[-20px] z-10 group">
        
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* IMAGEM DE FUNDO DO CARROSSEL */}
            <img 
              src={slide.bg} 
              className="w-full h-full object-cover brightness-[0.45]"
              alt="Fundo bonitp"
            />
            {/* CONTEÚDO DO SLIDE */}
            <div className="absolute inset-0 p-6 flex items-center gap-5 text-left bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <img 
                src={slide.capa} 
                className="w-22 h-32 object-cover rounded-xl shadow-2xl border-2 border-white/20"
                alt="Capa Destaque"
              />
              <div className="text-white">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-400 opacity-90">{slide.tag}</h3>
                <h2 className="text-xl font-black leading-tight mt-1">{slide.titulo}</h2>
                <p className="text-[11px] opacity-90 leading-snug mt-1.5">{slide.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {/* INDICADORES DO CARROSSEL (AQUELE TRACINHO AMARELO) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 📚 SEÇÃO BIBLIOTECA (VISUAL PREMIUM DO STUDIO RESTAURADO) */}
      {/* ========================================================== */}
      <div className="flex-1 w-full bg-white rounded-t-[48px] px-8 py-10 shadow-[0_-15px_60px_rgba(0,0,0,0.5)] relative z-20 mt-[-20px]">
        {/* TÍTULO DOURADO CONFORME STUDIO */}
        <h2 className="text-3xl font-serif font-black text-[#B28C3D] mb-12 text-left tracking-tighter">Sua Biblioteca</h2>
        
        {/* CARD DO LIVRO TEMPO A DOIS */}
        <div className="flex flex-col items-start w-40 group">
          {/* CAPA COM SOMBRA SUAVE (CONFORME STUDIO) */}
          <div className="relative mb-6 shadow-[0_15px_45px_rgba(0,0,0,0.18)] rounded-2xl overflow-hidden active:scale-95 transition-transform group-hover:shadow-[0_20px_55px_rgba(0,0,0,0.25)]">
            <img 
              src={URL_TEMPO_A_DOIS} 
              className="w-40 h-56 object-cover"
              alt="Capa Tempo a Dois"
            />
          </div>
          
          {/* BOTÃO "LER AGORA" COM ÍCONE (CONFORME STUDIO) */}
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-[#3d107a] active:bg-[#1a0636] transition-colors">
            <Play size={14} fill="currentColor" />
            Ler Agora
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 🏠 MENU INFERIOR (VISUAL CLEAN DO STUDIO) */}
      {/* ========================================================== */}
      <div className="w-full bg-white/95 backdrop-blur-sm border-t border-gray-100 py-4 px-12 flex justify-between items-center sticky bottom-0 z-50">
        <div className="flex flex-col items-center gap-1.5 text-yellow-600">
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400 opacity-40 hover:opacity-100 transition-opacity">
          <Search size={24} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Buscar</span>
        </div>
      </div>
    </div>
  );
}
