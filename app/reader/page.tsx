'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx4l5U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// AVISO DE INSTALAÇÃO PERSISTENTE
function InstallGuide() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isMobile && !isStandalone) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-28 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10">
      <div className="bg-purple-900/98 text-white p-5 rounded-2xl shadow-2xl border-2 border-yellow-500/50 flex items-center gap-4">
        <div className="bg-yellow-500 p-2 rounded-xl text-purple-900 animate-pulse"><Smartphone size={24} /></div>
        <div className="flex-1 text-left text-[11px] leading-tight">
          <p className="font-bold text-yellow-400 text-sm">Instale o App</p>
          Toque nos <span className="underline">3 pontinhos</span> e escolha <span className="underline">"Adicionar à tela de início"</span>.
        </div>
        <button onClick={() => setShow(false)} className="bg-white/10 p-2 rounded-full"><X size={20} /></button>
      </div>
    </div>
  );
}

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('capitulos').select('*').order('ordem', { ascending: true });
      if (data) { setChaptersList(data); setCurrentChapter(data[0]); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-purple-950 flex items-center justify-center text-white font-bold tracking-widest">CARREGANDO...</div>;

  return (
    <div className={`min-h-screen pb-28 transition-colors ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-white text-gray-800'}`}>
      
      <header className="sticky top-0 z-50 bg-purple-950 text-white px-4 py-4 flex items-center justify-between">
        <Link href="/" className="p-2"><ArrowLeft size={24} /></Link>
        <h1 className="text-xs font-bold tracking-widest uppercase">Tempo a Dois</h1>
        <button onClick={() => setIsIndexOpen(!isIndexOpen)} className="p-2"><List size={24} /></button>
      </header>

      {currentChapter && (
        <main className="px-6 py-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 leading-tight">{currentChapter.titulo_capitulo}</h2>
          <article className="space-y-6 text-justify" style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}>
            {currentChapter.conteudo?.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
          </article>
        </main>
      )}

      {/* GAVETA DE ÍNDICE */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-purple-950 z-[70] transition-transform ${isIndexOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between text-white font-bold">ÍNDICE <X onClick={() => setIsIndexOpen(false)}/></div>
        {chaptersList.map(ch => (
          <button key={ch.id} onClick={() => {setCurrentChapter(ch); setIsIndexOpen(false); window.scrollTo(0,0);}} className="w-full text-left p-4 text-white border-b border-white/5 text-sm hover:bg-white/5">
            {ch.titulo_capitulo}
          </button>
        ))}
      </div>

      {/* CONTROLES */}
      <div className={`fixed bottom-0 left-0 right-0 py-4 flex justify-center gap-12 border-t z-40 backdrop-blur-md ${isDarkMode ? 'bg-black/90' : 'bg-white/90'}`}>
        <button onClick={() => setFontSize(f => Math.max(f - 2, 14))} className="p-2 font-bold">- A</button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-4 rounded-full bg-purple-100 text-purple-900">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
        <button onClick={() => setFontSize(f => Math.min(f + 2, 32))} className="p-2 font-bold">+ A</button>
      </div>

      <InstallGuide />
    </div>
  );
}
