'use client';

import React from 'react';
import { User, Search, Home, Play } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  // === LINKS REAIS DOS SEUS ARQUIVOS ===
  const URL_LOGO = "/icon.png"; // Puxando direto da raiz do GitHub/Vercel
  const URL_CAPA_TEMPO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/Design%20sem%20nome.png";
  const URL_CAPA_CASAMENTO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/capa-casamento.png.png";

  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center font-sans">
      {/* HEADER SUPERIOR */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center z-10">
        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center">
          <img 
            src={URL_LOGO} 
            alt="Logo" 
            className="h-10 w-auto object-contain px-2"
          />
        </div>
        <button className="bg-white/10 p-3 rounded-full text-yellow-500">
          <User size={24} />
        </button>
      </div>

      {/* BANNER PRINCIPAL (CASAMENTO FORJADO) */}
      <div className="w-[90%] max-w-md relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10 mt-[-20px] z-0">
        <img 
          src="https://images.unsplash.com/photo-1518191392211-1376d54d9c72?q=80&w=600" 
          className="w-full h-60 object-cover brightness-50"
          alt="Fundo"
        />
        <div className="absolute inset-0 p-6 flex items-center gap-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-left">
          <img 
            src={URL_CAPA_CASAMENTO} 
            className="w-22 h-32 object-cover rounded-xl shadow-2xl border-2 border-white/30"
            alt="Capa Casamento Forjado"
          />
          <div className="text-white">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 text-yellow-400">Em Breve:</h3>
            <h2 className="text-xl font-black leading-tight mt-1">Casamento Forjado</h2>
            <p className="text-[11px] opacity-90 leading-snug mt-1">Transformações que fortalecem a união.</p>
          </div>
        </div>
      </div>

      {/* SEÇÃO BIBLIOTECA (TEMPO A DOIS) */}
      <div className="flex-1 w-full bg-white rounded-t-[48px] px-8 py-10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)] relative z-10">
        <h2 className="text-3xl font-serif text-[#B28C3D] mb-12 text-left">Sua Biblioteca</h2>
        
        <div className="flex flex-col items-start w-40">
          <div className="relative mb-5 shadow-[0_15px_40px_rgba(0,0,0,0.2)] rounded-2xl">
            <img 
              src={URL_CAPA_TEMPO} 
              className="w-40 h-56 object-cover rounded-2xl"
              alt="Capa Tempo a Dois"
            />
          </div>
          
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
            <Play size={14} fill="currentColor" />
            Ler Agora
          </Link>
        </div>
      </div>

      {/* MENU INFERIOR */}
      <div className="w-full bg-white border-t border-gray-100 py-4 px-12 flex justify-between items-center sticky bottom-0 z-50">
        <div className="flex flex-col items-center gap-1 text-yellow-600">
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 opacity-30">
          <Search size={24} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Buscar</span>
        </div>
      </div>
    </div>
  );
}
