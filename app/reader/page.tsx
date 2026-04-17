'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, CheckCircle, Clock, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx415U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        const userHasPaid = true; 
        setHasAccess(userHasPaid);

        const { data: fetchedChapters, error } = await supabase
          .from('capitulos')
          .select('*')
          .order('ordem', { ascending: true });

        if (error) throw error;

        if (fetchedChapters && fetchedChapters.length > 0) {
          setChaptersList(fetchedChapters);
          setCurrentChapter(fetchedChapters[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar capítulos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, []);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 4, 32));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 4, 14));
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleIndex = () => setIsIndexOpen(!isIndexOpen);

  const handleChapterSelect = (chapter: any) => {
    setCurrentChapter(chapter);
    setIsIndexOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center text-white">
        <p className="animate-pulse">Carregando conteúdo...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-[#F9F7F2] text-gray-800'}`}>
      
      {isIndexOpen && <div className="fixed inset-0 bg-black/60 z-[60]" onClick={toggleIndex} />}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-purple-950 z-[70] transform transition-transform duration-300 ${isIndexOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-purple-800/50 flex items-center justify-between text-white">
          <span className="font-bold">ÍNDICE</span>
          <button onClick={toggleIndex}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chaptersList.map((chapter) => (
            <button key={chapter.id} onClick={() => handleChapterSelect(chapter)} className={`w-full text-left px-6 py-4 border-b border-purple-900/20 ${currentChapter?.id === chapter.id ? 'text-yellow-500 bg-purple-900/40' : 'text-purple-100'}`}>
              {chapter.titulo_capitulo}
            </button>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-purple-950 text-white px-4 py-4 flex items-center justify-between">
        <Link href="/" className="p-2"><ArrowLeft size={24} /></Link>
        <h1 className="text-xs font-bold tracking-widest uppercase">Tempo a Dois</h1>
        <button onClick={toggleIndex} className="p-2"><List size={24} /></button>
      </header>

      {currentChapter && (
        <main className="px-8 py-10 max-w-2xl mx-auto">
          {currentChapter.url_imagem && (
            <img src={currentChapter.url_imagem} alt="Capa" className="w-full h-64 object-cover rounded-3xl mb-10 shadow-lg" />
          )}

          <h2 className={`text-3xl font-serif font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>
            {currentChapter.titulo_capitulo}
          </h2>

          {/* AJUSTE DE DIAGRAMAÇÃO AQUI */}
          <article 
            className="text-justify" 
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8', hyphens: 'auto' }}
          >
            {(currentChapter.conteudo || '').split('\n').map((paragraph: string, index: number) => (
              paragraph.trim() !== "" && (
                <p key={index} className="mb-8">{paragraph.trim()}</p>
              )
            ))}
          </article>
        </main>
      )}

      <div className={`fixed bottom-0 left-0 right-0 border-t flex items-center justify-center gap-10 py-4 px-6 backdrop-blur-lg ${isDarkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100'}`}>
        <button onClick={decreaseFont} className="text-gray-400"><Type size={18} />-</button>
        <button onClick={toggleDarkMode} className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-amber-400' : 'bg-purple-100 text-purple-900'}`}>
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button onClick={increaseFont} className="text-gray-400"><Type size={22} />+</button>
      </div>
    </div>
  );
}
