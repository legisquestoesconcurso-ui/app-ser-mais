'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, CheckCircle, Clock, Lock, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx4l5U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// COMPONENTE: AVISO DE INSTALAÇÃO PERSISTENTE (SÓ SOME NO X)
function InstallGuide() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (isMobile && !isStandalone) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-purple-900/98 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border-2 border-yellow-500/50 flex items-center gap-4">
        <div className="bg-yellow-500 p-2 rounded-xl text-purple-900 animate-pulse">
          <Smartphone size={24} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-yellow-400">Instale o Aplicativo</p>
          <p className="text-[11px] text-white leading-tight mt-1">
            Toque nos <span className="font-bold underline">3 pontinhos</span> (ou compartilhar) e escolha <span className="font-bold underline">"Adicionar à tela de início"</span> para ler sempre que quiser.
          </p>
        </div>
        <button onClick={() => setShow(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

const renderWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function ReaderScreen() {
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        setHasAccess(true);
        const { data: fetchedChapters, error } = await supabase
          .from('capitulos')
          .select('id, titulo_capitulo, conteudo, ordem, url_imagem, frase_destaque')
          .order('ordem', { ascending: true });

        if (error) throw error;
        if (fetchedChapters && fetchedChapters.length > 0) {
          setChaptersList(fetchedChapters);
          setCurrentChapter(fetchedChapters[0]);
        }
      } catch (error: any) {
        console.error("Erro Supabase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleIndex = () => setIsIndexOpen(!isIndexOpen);

  if (loading) return (
    <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
      <p className="text-purple-200 uppercase text-xs tracking-widest">Carregando...</p>
    </div>
  );

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-white text-gray-800'}`}>
      
      {isIndexOpen && <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={toggleIndex} />}

      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white px-4 py-4 flex items-center justify-between shadow-md">
        {/* AQUI A CORREÇÃO DA SETA: VOLTA PARA A HOME */}
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1">
          <ArrowLeft size={24} />
          <span className="text-[10px] font-bold uppercase opacity-70">Início</span>
        </Link>
        <h1 className="text-sm font-medium tracking-[0.2em] uppercase">Tempo a Dois</h1>
        <button onClick={toggleIndex} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <List size={24} />
        </button>
      </header>

      {currentChapter && (
        <main className="px-6 py-10 max-w-2xl mx-auto animate-in fade-in duration-500">
          {currentChapter.url_imagem && (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl mb-8">
              <img src={currentChapter.url_imagem} alt="Capa" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="text-3xl font-bold mb-6 leading-tight">{currentChapter.titulo_capitulo}</h2>
          <article 
            className={`space-y-6 text-justify p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-[#F9F7F2] border-[#e8e4d9]'}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          >
            {(currentChapter.conteudo || '').split('\n').map((paragraph: string, i: number) => (
              <p key={i}>{renderWithBold(paragraph)}</p>
            ))}
          </article>
        </main>
      )}

      {/* CONTROLES */}
      <div className={`fixed bottom-0 left-0 right-0 border-t flex items-center justify-center gap-16 py-4 px-6 backdrop-blur-lg z-40 ${isDarkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100 shadow-lg'}`}>
        <button onClick={() => setFontSize(f => Math.max(f - 2, 14))} className="p-2 text-xl font-bold">- A</button>
        <button onClick={toggleDarkMode} className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-purple-50 text-purple-900'}`}>
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button onClick={() => setFontSize(f => Math.min(f + 2, 30))} className="p-2 text-xl font-bold">+ A</button>
      </div>

      <InstallGuide />
    </div>
  );
}
