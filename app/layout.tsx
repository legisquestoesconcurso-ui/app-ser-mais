'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="pt-br">
      <head>
        <link rel="manifest" href="/manifest.json" />
        
        {/* COR DO TEMA E BARRA DE STATUS */}
        <meta name="theme-color" content="#2D0B5A" />
        <meta name="msapplication-TileColor" content="#2D0B5A" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* CSS FORÇADO NO HEAD PARA EVITAR O CLARÃO BRANCO */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { 
            background-color: #2D0B5A !important; 
            margin: 0;
            padding: 0;
          }
        `}} />

        <title>Casamento Duradouro</title>
      </head>
      
      <body suppressHydrationWarning className="bg-[#2D0B5A]">
        {loading ? (
          /* TELA DE ABERTURA (SPLASH SCREEN) */
          <div className="fixed inset-0 z-[999] bg-[#2D0B5A] flex flex-col items-center justify-center">
            <div className="relative">
              {/* Efeito de brilho atrás da logo */}
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              
              <img 
                src="/icon.png" 
                alt="Logo Casamento Duradouro" 
                className="w-40 h-40 object-contain relative z-10 animate-in zoom-in duration-700"
              />
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <h1 className="text-white font-serif text-xl tracking-[0.2em] font-light opacity-80 uppercase">
                Casamento
              </h1>
              <h2 className="text-yellow-500 font-sans text-xs tracking-[0.4em] font-black mt-1 uppercase">
                Duradouro
              </h2>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            {children}
          </div>
        )}

        {/* Registro do Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.worker = navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
