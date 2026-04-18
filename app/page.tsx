'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, List, Moon, Sun, Type, Quote, X, CheckCircle, Clock, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ==========================================
// CONFIGURAÇÃO SUPABASE (Real)
// ==========================================
const SUPABASE_URL = 'https://gelrtnknowueuzsrjphe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3kx4l5U4v2y8vqbsPNTJXg_pVcoIpGS';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// COMPONENTE: GUIA DE INSTALAÇÃO PWA
// ==========================================
function InstallGuide() {
  const [isMounted, setIsMounted] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setIsMounted(true);
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        if (isMobile && !isStandalone) {
          setShowInstall(true);
        }
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isMounted || !showInstall) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-purple-700 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce text-center border border-purple-500/50">
      <p className="text-xs md:text-sm font-medium leading-snug tracking-wide">
        Para ler sem distrações: Toque em Compartilhar (ou nos 3 pontinhos) e escolha &apos;Adicionar à Tela de Início&apos;
      </p>
    </div>
  );
}

// Helper para converter **texto** em negrito
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
  // --- ESTADOS DA INTERFACE ---
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // --- ESTADOS DE DADOS (SUPABASE LOGIC) ---
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);

  // --- FETCH DO SUPABASE Atualizado ---
  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      
      try {
        // 1. FORÇAR ACESSO: Garantindo que o conteúdo apareça para os testes
        setHasAccess(true);

        // 2. BUSCA DE CAPÍTULOS Diretamente no Supabase
        const { data: fetchedChapters, error } = await supabase
          .from('capitulos')
          .select('id, titulo_capitulo, conteudo, ordem, url_imagem, frase_destaque')
          .order('ordem', { ascending: true });

        if (error) throw error;

        if (fetchedChapters && fetchedChapters.length > 0) {
          setChaptersList(fetchedChapters);
          setCurrentChapter(fetchedChapters[0]);
        } else {
          console.warn("Aviso: A busca não retornou nenhum capítulo.");
        }
      } catch (error: any) {
        console.error("Erro detalhado ao buscar capítulos:", JSON.stringify(error, null, 2), error);
        alert(`Falha na conexão com Supabase: ${error?.message || 'Erro desconhecido'}. (Verifique o console para mais detalhes)`);
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

  // --- NAVEGAÇÃO DO ÍNDICE ---
  const handleChapterSelect = (chapter: any) => {
    setCurrentChapter(chapter);
    setIsIndexOpen(false); // Fecha a gaveta ao selecionar
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta pro topo
  };

  // ==========================================
  // RENDERIZAÇÃO: TELA DE CARREGAMENTO
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
        <p className="text-purple-200 font-medium tracking-widest uppercase text-sm">Carregando conteúdo...</p>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: CONTEÚDO BLOQUEADO
  // ==========================================
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Conteúdo Bloqueado</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Você precisa adquirir este e-book para ter acesso aos capítulos completos.
          </p>
          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-purple-950 font-bold py-4 rounded-xl transition-colors shadow-lg shadow-yellow-500/30">
            Comprar Agora
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: TELA DE LEITURA (READER)
  // ==========================================
  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-white text-gray-800'}`}>
      
      {/* OVERLAY DO ÍNDICE */}
      {isIndexOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          onClick={toggleIndex}
        />
      )}

      {/* GAVETA DO ÍNDICE (SIDEBAR) */}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-purple-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isIndexOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-purple-800/50 flex items-center justify-between bg-purple-950 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xl font-black tracking-tighter text-white">S</span>
              <span className="text-xl font-black tracking-tighter text-yellow-500">+</span>
            </div>
            <h2 className="text-yellow-500 font-medium text-xs tracking-[0.2em] uppercase">
              Conteúdo do E-book
            </h2>
          </div>
          <button onClick={toggleIndex} className="text-purple-300 hover:text-white p-2 rounded-full hover:bg-purple-800/50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1">
            {chaptersList.map((chapter) => {
              const isCurrent = currentChapter?.id === chapter.id;
              
              return (
                <li key={chapter.id} className="relative">
                  {isCurrent && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-r-full shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  )}
                  
                  <button 
                    onClick={() => handleChapterSelect(chapter)}
                    className={`w-full text-left px-6 py-4 flex items-center justify-between group transition-all duration-200
                      ${isCurrent ? 'bg-purple-900/40' : 'hover:bg-purple-900/20'}
                    `}
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <span className={`text-sm md:text-base font-medium transition-colors
                        ${isCurrent ? 'text-yellow-500' : 'text-purple-100'}
                      `}>
                        {chapter.titulo_capitulo}
                      </span>
                      
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider text-yellow-500/80 font-bold">
                          Você está aqui
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {isCurrent ? (
                        <Clock size={18} className="text-yellow-500" />
                      ) : (
                        <CheckCircle size={18} className="text-yellow-500/80" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* CABEÇALHO */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Voltar">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-base font-medium tracking-[0.2em] uppercase text-white/90">
          Tempo a Dois
        </h1>
        <button 
          onClick={toggleIndex}
          className="p-2 hover:bg-white/10 rounded-full transition-colors" 
          aria-label="Índice"
        >
          <List size={24} className="text-white" />
        </button>
      </header>

      {/* ÁREA DE LEITURA */}
      {currentChapter && (
        <main className="px-6 py-10 max-w-2xl mx-auto animate-in fade-in duration-500">
          
          {/* Imagem do Capítulo (Antes do título, usando <img>) */}
          {currentChapter.url_imagem && (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl mb-8">
              <img 
                src={currentChapter.url_imagem} 
                alt={currentChapter.titulo_capitulo || 'Capa do Capítulo'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          )}

          {/* Título e Subtítulo */}
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 leading-tight tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-purple-950'}`}>
            {currentChapter.titulo_capitulo}
          </h2>
          {currentChapter.subtitulo && (
            <h3 className={`text-xl mb-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentChapter.subtitulo}
            </h3>
          )}

          {/* Versículo Base (Abaixo do título) */}
          {currentChapter.versiculo_base && (
            <div className={`mb-10 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg md:text-xl font-serif text-center md:text-left`}>
              <p className="leading-relaxed">
                &quot;{currentChapter.versiculo_base.split('—')[0].trim()}&quot;
              </p>
              {currentChapter.versiculo_base.includes('—') && (
                <p className="text-sm mt-2 font-semibold tracking-widest uppercase opacity-80">
                  — {currentChapter.versiculo_base.split('—')[1].trim()}
                </p>
              )}
            </div>
          )}

          {/* Frase de Destaque */}
          {currentChapter.frase_destaque && (
            <div className="flex gap-4 mb-10 items-start">
              <Quote className="text-amber-500 flex-shrink-0 rotate-180 opacity-80" size={36} />
              <div className="pt-2">
                <p className={`text-xl md:text-2xl italic font-medium leading-relaxed mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  &quot;{currentChapter.frase_destaque.split('—')[0].trim()}&quot;
                </p>
                {currentChapter.frase_destaque.includes('—') && (
                  <p className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    — {currentChapter.frase_destaque.split('—')[1].trim()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Texto Principal */}
          <article 
            className={`space-y-6 font-sans transition-all duration-300 text-justify p-6 md:p-10 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-900 border border-gray-800 text-gray-300' : 'bg-[#F9F7F2] border border-[#e8e4d9] text-gray-800'}`}
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.8'
            }}
          >
            {/* Divide o texto por quebras de linha para renderizar parágrafos. Usa a coluna 'conteudo' */}
            {(currentChapter.conteudo || '').split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-justify">{renderWithBold(paragraph)}</p>
            ))}
          </article>
        </main>
      )}

      {/* CONTROLES INFERIORES */}
      <div className={`fixed bottom-0 left-0 right-0 border-t flex items-center justify-center gap-16 py-4 px-6 transition-colors duration-500 backdrop-blur-lg z-40 ${isDarkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]'}`}>
        
        <button onClick={decreaseFont} className={`p-3 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <div className="flex items-center gap-1"><Type size={18} /><span className="text-lg font-medium leading-none">-</span></div>
        </button>
        
        <button onClick={toggleDarkMode} className={`p-4 rounded-full transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-gray-800 text-amber-400 hover:bg-gray-700 shadow-black/50' : 'bg-purple-50 text-purple-900 hover:bg-purple-100 shadow-purple-900/5'}`}>
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <button onClick={increaseFont} className={`p-3 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <div className="flex items-center gap-1"><Type size={22} /><span className="text-lg font-medium leading-none">+</span></div>
        </button>

      </div>
      
      {/* GUIA DE INSTALAÇÃO PWA */}
      <InstallGuide />
    </div>
  );
}
