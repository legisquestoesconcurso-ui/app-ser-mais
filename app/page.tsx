'use client';

import React, { useState, useEffect } from 'react';
import { User, Play, Download, X } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ESTADOS PARA O BANNER DE INSTALAÇÃO
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // LINKS REAIS
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

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowInstallBanner(true), 1500);
    });

    return () => clearInterval(timer);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center font-sans overflow-x-hidden relative pb-10">
      
      {/* BANNER DE ORIENTAÇÃO PARA INSTALAÇÃO */}
      {showInstallBanner && (
        <div className="fixed top-6 left-4 right-4 z-[100] bg-[#4C1D95] text-white p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-yellow-500/40 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <img src={URL_LOGO} alt="App Icon" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-[14px] font-black tracking-tight text-white">Instalar Casamento Duradouro</p>
              <p className="text-[11px] text-yellow-500/90 font-medium">Leia offline e com melhor experiência</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowInstallBanner(false)} className="p-1 opacity-40 hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>
            <button onClick={handleInstallClick} className="bg-yellow-500 text-[#2D0B5A] text-[11px] font-black px-5 py-2.5 rounded-full shadow-lg active:scale-90 transition-transform flex items-center gap-2">
              <Download size={14} />
              BAIXAR
            </button>
          </div>
        </div>
      )}

      {/* HEADER PREMIUM */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center z-20">
        <div className="flex items-center justify-center min-w-[65px] min-h-[65px]">
          <img 
            src={URL_LOGO} 
            alt="Logo Casamento Duradouro" 
            className="h-16 w-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" 
          />
        </div>
        <button className="bg-white/10 p-4 rounded-full text-yellow-500 shadow-lg border border-white/5 active:scale-90 transition-transform">
          <User size={24} />
        </button>
      </div>

      {/* CARROSSEL DINÂMICO */}
      <div className="w-[92%] max-w-md h-64 relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10 mt-[-10px] z-10">
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
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
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* SEÇÃO BIBLIOTECA - AJUSTADA PARA CAPA INTEIRA */}
      <div className="flex-1 w-full bg-white rounded-t-[50px] px-8 py-12 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] relative z-20 mt-[-20px]">
        <h2 className="text-4xl font-serif font-black text-[#B28C3D] mb-12 tracking-tighter">Sua Biblioteca</h2>
        <div className="flex flex-col items-start w-44 group">
          <div className="relative mb-6 shadow-2xl rounded-[24px] overflow-hidden active:scale-95 transition-transform duration-300 bg-gray-50 border border-gray-100">
            <img 
              src={URL_TEMPO_A_DOIS} 
              className="w-44 h-64 object-contain" // Garante que a capa apareça inteira
              alt="Livro Tempo a Dois" 
            />
          </div>
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-2 hover:bg-[#3d107a] transition-colors">
            <Play size={14} fill="currentColor" />
            LER AGORA
          </Link>
        </div>
      </div>

      {/* MENU INFERIOR REMOVIDO PARA UM VISUAL MAIS LIMPO */}
    </div>
  );
}
