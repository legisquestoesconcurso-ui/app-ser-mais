'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, CheckCircle, Clock, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURAÇÃO SUPABASE (Real)
// ==========================================
const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx415U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ReaderScreen() {
  // --- ESTADOS DA INTERFACE ---
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // --- ESTADOS DE DADOS (SUPABASE LOGIC) ---
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);

  // --- BUSCA DE DADOS ---
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

  // --- FUNÇÕES DE CONTROLE ---
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
        <p className="text-purple-200 font-medium tracking-widest uppercase text-sm">Carregando conteúdo...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Conteúdo Bloqueado</h2>
          <button className="w-full bg-yellow-500 text-purple-950 font-bold py-4 rounded-xl">Comprar Agora</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-[#F9F7F2] text-gray-800'}`}>
      
      {/* OVERLAY DO ÍNDICE */}
      {isIndexOpen && <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={toggleIndex} />}

      {/* GAVETA DO ÍNDICE - CORRIGIDA */}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-purple-950 shadow-2xl z-[70] transform transition-transform duration-300 ${isIndexOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-purple-800/50 flex items-center justify-between bg-purple-950 sticky top-0 z-10">
          <h2 className="text-yellow-500 font-medium text-xs tracking-[0.2em] uppercase">Conteúdo do E-book</h2>
          <button onClick={toggleIndex} className="text-purple-300"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {chaptersList.map((chapter) => (
              <li key={chapter.id}>
                <button 
                  onClick={() => handleChapterSelect(chapter)}
                  className={`w-full text-left px-6 py-4 flex items-center justify-between ${currentChapter?.id === chapter.id ? 'bg-purple-900/40' : ''}`}
                >
                  <span className={`text-sm font-medium ${currentChapter?.id === chapter.id ? 'text-yellow-500' : 'text-purple-100'}`}>
                    {chapter.titulo_capitulo}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CABEÇALHO */}
      <header className="sticky top-0 z-50 bg-purple-950 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={24} /></Link>
        <h1 className="text-base font-medium tracking-[0.2em] uppercase">Tempo a Dois</h1>
        <button onClick={toggleIndex} className="p-2 hover:bg-white/10 rounded-full"><List size={24} /></button>
      </header>

      {/* ÁREA DE LEITURA COM DIAGRAMAÇÃO */}
      {currentChapter && (
        <main className="px-8 py-10 max-w-2xl mx-auto">
          {currentChapter.url_imagem && (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl mb-8">
              <img src={currentChapter.url_imagem} alt="Capa" className="w-full h-full object-cover" />
            </div>
          )}

          <h2 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight text-center ${isDarkMode ? 'text-gray-100' : 'text-purple-950'}`}>
            {currentChapter.titulo_capitulo}
          </h2>

          {/* TEXTO JUSTIFICADO E COM RESPIRO */}
          <article 
            className="text-justify transition-all duration-300"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          >
            {(currentChapter.conteudo || '').split('\n').map((paragraph: string, index: number) => (
              paragraph.trim() !== "" && (
                <p key={index} className="mb-8">{paragraph.trim()}</p>
              )
            ))}
          </article>
        </main>
      )}

      {/* CONTROLES INFERIORES */}
      <div className={`fixed bottom-0 left-0 right-0 border-t flex items-center justify-center gap-16 py-4 px-6 backdrop-blur-lg z-40 ${isDarkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100 shadow-lg'}`}>
        <button onClick={decreaseFont} className="p-3 text-gray-500"><Type size={18} />-</button>
        <button onClick={toggleDarkMode} className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-amber-400' : 'bg-purple-100 text-purple-900'}`}>
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button onClick={increaseFont} className="p-3 text-gray-500"><Type size={22} />+</button>
      </div>
    </div>
  );
}
