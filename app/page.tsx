'use client';

import React from 'react';
import { User, Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function LibraryScreen() {
  return (
    <div className="min-h-screen bg-[#2D0B5A] flex flex-col items-center">
      {/* HEADER SUPERIOR */}
      <div className="w-full max-w-md px-6 pt-12 pb-6 flex justify-between items-center">
        <div className="bg-white p-2 rounded-2xl shadow-lg">
          <span className="text-purple-900 font-black text-xl px-2">S+</span>
        </div>
        <button className="bg-white/10 p-3 rounded-full text-yellow-500">
          <User size={24} />
        </button>
      </div>

      {/* BANNER PRINCIPAL */}
      <div className="w-[90%] max-w-md relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-white/10">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80" 
          className="w-full h-56 object-cover brightness-75"
          alt="Background"
        />
        <div className="absolute inset-0 p-6 flex items-center gap-4 bg-gradient-to-t from-black/60 to-transparent">
          <img 
            src="https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/capa-tempo-a-dois.jpg" 
            className="w-20 h-28 object-cover rounded-lg shadow-xl border border-white/20"
            alt="Capa"
          />
          <div className="text-white">
            <h3 className="text-[10px] font-bold tracking-widest uppercase opacity-70">Destaque:</h3>
            <h2 className="text-lg font-bold">Tempo a Dois</h2>
            <p className="text-[10px] opacity-80 leading-tight">Fortalecendo sua união.</p>
          </div>
        </div>
      </div>

      {/* SEÇÃO BIBLIOTECA (BRANCA) */}
      <div className="flex-1 w-full bg-white rounded-t-[48px] px-8 py-10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <h2 className="text-3xl font-serif text-[#B28C3D] mb-10">Sua Biblioteca</h2>
        
        <div className="flex flex-col items-start w-36 group">
          <div className="relative mb-4">
            <img 
              src="https://gelrtnknowueuzsrjphe.supabase.co/storage/v1/object/public/capas/capa-tempo-a-dois.jpg" 
              className="w-36 h-52 object-cover rounded-2xl shadow-2xl group-active:scale-95 transition-transform"
              alt="Tempo a Dois"
            />
          </div>
          
          {/* BOTÃO QUE ENVIA PARA O LEITOR */}
          <Link href="/reader" className="w-full bg-[#2D0B5A] text-[#FFD700] py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-lg flex items-center justify-center gap-2">
            Lêr Agora
          </Link>
        </div>
      </div>

      {/* MENU INFERIOR */}
      <div className="w-full bg-gray-50/90 backdrop-blur-md border-t border-gray-200 py-4 px-10 flex justify-between items-center sticky bottom-0">
        <div className="flex flex-col items-center gap-1 text-yellow-600">
          <Home size={24} />
          <span className="text-[10px] font-bold">Início</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 text-center opacity-30">
          <Search size={24} />
          <span className="text-[10px]">Buscar</span>
        </div>
      </div>
    </div>
  );
}
