'use client';

import React from 'react';
import { User, Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  // === CONFIGURAÇÃO DE IMAGENS REAIS DO SEU SUPABASE ===
  const URL_LOGO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/logo-ser-mais.png"; // Certifique-se que o arquivo existe neste caminho
  const URL_CAPA_ LIVRO = "https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/capa-tempo-a-dois.jpg";
  const URL_BG_BANNER = "https://images.unsplash.com/photo-1518191392211-1376d54d9c72?q=80&w=600"; // Um background elegante de montanha

  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center">
      {/* HEADER SUPERIOR */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center z-10">
        {/* LOGO REAL NOVO */}
        <div className="bg-white p-2 rounded-2xl shadow-lg">
          <img 
            src={URL_LOGO} 
            alt="Logo Ser Mais" 
            className="h-9 w-auto" // Ajuste de altura para ficar elegante
            onError={(e) => {
              // Caso a imagem falhe, mostra o S+ temporário
              e.currentTarget.style.display = 'none';
              if(e.currentTarget.nextSibling) (e.currentTarget.nextSibling as HTMLElement).style.display = 'block';
            }}
          />
          <span className="hidden text-purple-900 font-black text-xl px-2">S+</span>
        </div>
        <button className="bg-white/10 p-3 rounded-full text-yellow-500 hover:bg-white/20 transition-colors">
          <User size={24} />
        </button>
      </div>

      {/* BANNER PRINCIPAL (CASAMENTO FORJADO REESTILIZADO) */}
      <div className="w-[90%] max-w-md relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10 mt-[-20px] z-0">
        <img 
          src={URL_BG_BANNER} 
          className="w-full h-60 object-cover brightness-50" // Aumentei a altura para destacar a capa
          alt="Background Banner"
        />
        <div className="absolute inset-0 p-6 flex items-center gap-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* CAPA DO LIVRO TEMPO A DOIS NO BANNER */}
          <img 
            src={URL_CAPA_LIVRO} 
            className="w-22 h-32 object-cover rounded-xl shadow-2xl border-2 border-white/30"
            alt="Capa Destaque"
          />
          <div className="text-white">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 text-yellow-400">Destaque do Mês:</h3>
            <h2 className="text-xl font-black leading-tight mt-1">Tempo a Dois</h2>
            <p className="text-[11px] opacity-90 leading-snug mt-1">Nutrindo o relacionamento. Criando memórias.</p>
          </div>
        </div>
      </div>

      {/* SEÇÃO BIBLIOTECA (BRANCA) */}
      <div className="flex-1 w-full bg-white rounded-t-[48px] px-8 py-10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)] relative z-10">
        <h2 className="text-3xl font-serif text-[#B28C3D] mb-12">Sua Biblioteca</h2>
        
        {/* CARD DO LIVRO ATUAL CORRIGIDO */}
        <div className="flex flex-col items-start w-40 group">
          <div className="relative mb-5 shadow-[0_15px_40px_rgba(0,0,0,0.2)] rounded-2xl transition-transform group-active:scale-95">
            <img 
              src={URL_CAPA_LIVRO} 
              className="w-40 h-56 object-cover rounded-2xl"
              alt="Capa do Ebook Tempo a Dois"
            />
          </div>
          
          {/* BOTÃO QUE ENVIA PARA O LEITOR (CORRIGIDO PARA LER AGORA) */}
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-[#3d107a] transition-colors">
            {/* Ícone simplificado de play ou check */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Ler Agora
          </Link>
        </div>
      </div>

      {/* MENU INFERIOR LIMPO E OBJETIVO */}
      <div className="w-full bg-white/95 backdrop-blur-md border-t border-gray-100 py-4 px-12 flex justify-between items-center sticky bottom-0 z-50">
        <div className="flex flex-col items-center gap-1 text-yellow-600">
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 opacity-40">
          <Search size={24} />
          <span className="text-[10px] font-medium uppercase">Buscar</span>
        </div>
      </div>
    </div>
  );
}
