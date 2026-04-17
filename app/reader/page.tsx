'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, CheckCircle, Clock, Lock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

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
        setHasAccess(true); // Simulação de acesso liberado

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
      <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
        <p>Carregando conteúdo...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-[#F9F7F2] text-gray-800'}`}>
      
      {isIndexOpen && <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={toggleIndex} />}

      {/* ÍNDICE CORRIGIDO */}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-purple-950 shadow-2xl z-[70] transform transition-transform duration-300 ${isIndexOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-purple-800/50 flex items-center justify-between">
          <span className="text-yellow-500 font-bold">ÍNDICE</span>
          <button onClick={toggleIndex} className="text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {chaptersList.map((chapter) => (
            <button 
              key={chapter.id} 
              onClick={() => handleChapterSelect(chapter)} 
              className={`w-full text-left px-6 py-4 border-b border-purple-900/30 ${currentChapter?.id === chapter.id ? 'bg-purple-900 text-yellow-500' : 'text-purple-100'}`}
            >
              {chapter.titulo_capitulo}
            </button>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-purple-950 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <Link href="/" className="p-2"><ArrowLeft size={24} /></Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Tempo a Dois</h1>
        <button onClick={toggleIndex} className="p-2"><List size={24} /></button>
      </header>

      {currentChapter ? (
        <main className="px-8 py-10 max-w-2xl mx-auto">
          {currentChapter.url_imagem && (
            <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-xl mb-10">
              <img src={currentChapter.url_imagem} alt="Capa" className="w-full h-full object-cover" />
            </div>
          )}

          <h2 className={`text-3xl font-serif font-bold mb-8 text-center leading-tight ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>
            {currentChapter.titulo_capitulo}
          </h2>

          <article 
            className="text-justify leading-relaxed" 
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* CORREÇÃO AQUI: split por '\n' simples atende qualquer formato do banco */}
            {(currentChapter.conteudo || '').split('\n').map((paragraph: string, index: number) => (
              paragraph.trim() !== "" && (
                <p key={index} className="mb-6">{paragraph.trim()}</p>
              )
            ))}
          </article>
        </main>
      ) : (
        <div className="p-10 text-center">Nenhum capítulo disponível no banco de dados.</div>
      )}

      {/* CONTROLES */}
      <div className={`fixed bottom-0 left-0 right-0 border-t flex items-center justify-center gap-10 py-4 px-6 backdrop-blur-lg z-40 ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
        <button onClick={decreaseFont} className="text-gray-500"><Type size={16} />-</button>
        <button onClick={toggleDarkMode} className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-amber-400' : 'bg-purple-100 text-purple-900'}`}>
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button onClick={increaseFont} className="text-gray-500"><Type size={20} />+</button>
      </div>
    </div>
  );
}
