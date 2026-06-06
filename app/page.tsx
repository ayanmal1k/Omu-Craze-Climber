'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/retro-climber';
import { 
  Pause, 
  Volume2, 
  VolumeX, 
  Trophy
} from 'lucide-react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('omu_crazy_climber_high_score');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onScoreChange: (newScore) => setScore(newScore),
      onCoinChange: (newCoins) => setCoins(newCoins),
      onStateChange: (state) => setGameState(state),
      onGameOver: (finalScore) => {
        const currentHigh = parseInt(localStorage.getItem('omu_crazy_climber_high_score') || '0', 10);
        if (finalScore > currentHigh) {
          localStorage.setItem('omu_crazy_climber_high_score', finalScore.toString());
          setHighScore(finalScore);
        }
      }
    });

    engineRef.current = engine;
    engine.audio.setMute(isMuted);

    return () => {
      engine.cleanUp();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.audio.setMute(isMuted);
    }
  }, [isMuted]);

  const handleStartRestart = () => {
    if (engineRef.current) {
      engineRef.current.startGame();
    }
  };

  const handlePauseResume = () => {
    if (engineRef.current) {
      if (gameState === 'PLAYING') {
        engineRef.current.pauseGame();
      } else if (gameState === 'PAUSED') {
        engineRef.current.resumeGame();
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-8 bg-gradient-to-b from-[#1a0505] via-[#2d0a0a] to-[#1a0505] text-[#e8d5c4] antialiased font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,30,30,0.3),transparent_60%)] pointer-events-none" />

      <header className="mb-5 text-center select-none z-10 flex flex-col items-center gap-1">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider font-press-start text-transparent bg-clip-text bg-gradient-to-r from-[#e85d3a] via-[#f4a259] to-[#e85d3a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          OMU CRAZY CLIMBER
        </h1>
        <p className="text-[9px] sm:text-xs font-bold text-[#a06050]/80 tracking-widest uppercase font-mono">
          How high can you climb?
        </p>
      </header>

      <div className="w-full max-w-xl flex flex-col items-center gap-4 z-10">
        
        {/* Best Score */}
        <div className="w-full text-center">
          <span className="text-[9px] font-press-start text-[#705040] tracking-widest uppercase">
            Best Score: <span className="text-[#f4a259]">{highScore}</span>
          </span>
        </div>

        {/* Game Screen */}
        <section className="w-full relative flex flex-col items-center">
          <div className="w-full relative bg-[#0d0505] rounded-2xl p-2 shadow-[0_16px_32px_rgba(0,0,0,0.6)] border-2 border-[#3a1510] overflow-hidden">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0a0a12]">
              <canvas
                ref={canvasRef}
                width={480}
                height={640}
                className="w-full h-full pixelated select-none pointer-events-none"
              />

              {/* START OVERLAY */}
              {gameState === 'START' && (
                <div className="absolute inset-0 bg-[#0a0202]/85 flex flex-col items-center justify-center p-6 text-center text-white">
                  <h2 className="text-lg font-extrabold font-press-start text-[#f4a259] mb-2">READY TO CLIMB?</h2>
                  <p className="text-[9px] font-mono text-[#a08070] mb-5 uppercase max-w-xs leading-relaxed">
                    Use A/D or arrows to move. Collect coins and climb higher!
                  </p>
                  <p className="text-[7px] font-mono text-[#705040] mb-3">Press any key to start</p>
                  <button 
                    onClick={handleStartRestart}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#e85d3a] to-[#c04020] hover:from-[#f06d4a] hover:to-[#d05030] text-white font-bold font-press-start text-[10px] rounded-xl border-2 border-[#e85d3a]/50 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    PLAY NOW
                  </button>
                </div>
              )}

              {/* PAUSED OVERLAY */}
              {gameState === 'PAUSED' && (
                <div className="absolute inset-0 bg-[#0a0202]/85 flex flex-col items-center justify-center p-6 text-center text-white">
                  <h2 className="text-lg font-extrabold font-press-start text-[#f4a259] mb-2 animate-pulse">PAUSED</h2>
                  <p className="text-[9px] font-mono text-[#a08070] mb-5">TAKE A BREATH</p>
                  <button 
                    onClick={handlePauseResume}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#f4a259] to-[#d08030] hover:from-[#f5b269] hover:to-[#e09040] text-white font-bold font-press-start text-[10px] rounded-xl border-2 border-[#f4a259]/50 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    RESUME
                  </button>
                </div>
              )}

              {/* GAME OVER OVERLAY */}
              {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-[#0a0202]/90 flex flex-col items-center justify-center p-6 text-center text-white">
                  <h2 className="text-xl font-extrabold font-press-start text-[#d04030] mb-2 drop-shadow-md">FELL!</h2>
                  <p className="text-[9px] font-press-start text-[#a08070] mt-1 mb-1">SCORE: {score}</p>
                  <p className="text-[9px] font-press-start text-[#f4a259] mb-5">COINS: {coins}</p>
                  <p className="text-[7px] font-mono text-[#705040] mb-3">Press W / ▲ / Space to retry</p>
                  <button 
                    onClick={handleStartRestart}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#d04030] to-[#a03020] hover:from-[#e05040] hover:to-[#b04030] text-white font-bold font-press-start text-[10px] rounded-xl border-2 border-[#d04030]/50 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {/* Floating buttons: mute + pause */}
              {gameState === 'PLAYING' && (
                <div className="absolute top-3 right-3 flex gap-1.5 z-20">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/15 text-white/80 cursor-pointer transition-all"
                    aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handlePauseResume}
                    className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/15 text-white/80 cursor-pointer transition-all"
                    aria-label="Pause Game"
                  >
                    <Pause className="w-3.5 h-3.5 fill-white/80" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="w-full bg-[#120606]/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-[#3a1510] flex flex-col gap-2.5 font-mono text-[#c0a090] text-xs">
          <h3 className="text-[10px] font-bold font-press-start text-[#f4a259] uppercase tracking-wider text-center border-b border-[#3a1510] pb-2">
            Controls
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 col-span-2">
              <span className="text-[10px]">Move</span>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">A</kbd>
                <span className="text-[7px] text-[#605040] self-center">/</span>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">D</kbd>
                <span className="text-[7px] text-[#605040] self-center mx-0.5">or</span>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">◀</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">▶</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50">
              <span className="text-[10px]">Jump</span>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">W</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">▲</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[7px]">SPACE</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50">
              <span className="text-[10px]">Power Jump <span className="text-[#ffd700]">(costs 20 coins)</span></span>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#f4a259] font-sans font-bold text-[9px]">SHIFT</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#f4a259] font-sans font-bold text-[9px]">▲</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 col-span-2">
              <span className="text-[10px]">Start / Retry</span>
              <kbd className="px-1.5 py-0.5 bg-[#1a0808] border border-[#3a1510] rounded text-[#c0a090] font-sans font-bold text-[9px]">ANY KEY</kbd>
            </div>
          </div>
        </section>

        {/* Mechanics & Platforms Guide */}
        <section className="w-full bg-[#120606]/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-[#3a1510] flex flex-col gap-2.5 font-mono text-[#c0a090] text-xs">
          <h3 className="text-[10px] font-bold font-press-start text-[#f4a259] uppercase tracking-wider text-center border-b border-[#3a1510] pb-2">
            Platforms & Collectibles
          </h3>
          <div className="flex flex-row flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 flex-1 min-w-[160px]">
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" style={{imageRendering:'pixelated'}}>
                <rect x="0" y="8" width="24" height="16" fill="#5d4037"/>
                <rect x="0" y="8" width="24" height="4" fill="#4caf50"/>
                <rect x="2" y="8" width="6" height="5" fill="#2e7d32"/>
                <rect x="16" y="8" width="6" height="5" fill="#2e7d32"/>
                <rect x="0" y="22" width="24" height="2" fill="#3e2723"/>
              </svg>
              <div className="min-w-0">
                <span className="text-[#4caf50] font-bold text-[9px]">Standard</span>
                <p className="text-[7px] text-[#807060] leading-tight">Mossy grass-topped dirt blocks. Safe to jump on.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 flex-1 min-w-[160px]">
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" style={{imageRendering:'pixelated'}}>
                <rect x="0" y="8" width="24" height="16" fill="#4b6584"/>
                <rect x="0" y="8" width="24" height="3" fill="#90caf9"/>
                <rect x="0" y="22" width="24" height="2" fill="#2f3542"/>
                <rect x="0" y="8" width="2" height="16" fill="#2f3542"/>
                <rect x="22" y="8" width="2" height="16" fill="#2f3542"/>
                <rect x="5" y="13" width="2" height="2" fill="#dcdde1"/>
                <rect x="17" y="13" width="2" height="2" fill="#dcdde1"/>
              </svg>
              <div className="min-w-0">
                <span className="text-[#90caf9] font-bold text-[9px]">Moving</span>
                <p className="text-[7px] text-[#807060] leading-tight">Sliding steel platforms that bounce off edges.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 flex-1 min-w-[160px]">
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" style={{imageRendering:'pixelated'}}>
                <rect x="0" y="8" width="24" height="16" fill="#d2b48c"/>
                <rect x="0" y="22" width="24" height="2" fill="#8d6e63"/>
                <rect x="6" y="8" width="2" height="5" fill="#4e342e"/>
                <rect x="6" y="13" width="5" height="2" fill="#4e342e"/>
                <rect x="11" y="13" width="2" height="5" fill="#4e342e"/>
                <rect x="17" y="8" width="2" height="4" fill="#4e342e"/>
                <rect x="15" y="12" width="4" height="2" fill="#4e342e"/>
              </svg>
              <div className="min-w-0">
                <span className="text-[#d2b48c] font-bold text-[9px]">Crumbling</span>
                <p className="text-[7px] text-[#807060] leading-tight">Cracked sandstone. Breaks after you land!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#2a0f0a]/50 flex-1 min-w-[160px]">
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" style={{imageRendering:'pixelated'}}>
                <rect x="0" y="14" width="24" height="10" fill="#8d6e63"/>
                <rect x="0" y="22" width="24" height="2" fill="#5d4037"/>
                <rect x="9" y="4" width="6" height="3" fill="#b2bec3"/>
                <rect x="6" y="7" width="12" height="3" fill="#b2bec3"/>
                <rect x="8" y="10" width="8" height="3" fill="#b2bec3"/>
                <rect x="10" y="2" width="4" height="2" fill="#e67e22"/>
              </svg>
              <div className="min-w-0">
                <span className="text-[#b2bec3] font-bold text-[9px]">Spring</span>
                <p className="text-[7px] text-[#807060] leading-tight">Coiled launcher. Bounces you sky-high!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0a0202]/50 p-1.5 rounded-lg border border-[#f4a259]/20 flex-1 min-w-[160px]">
              <div className="w-5 h-5 shrink-0 rounded-full" style={{backgroundImage:'url(/coin.png)',backgroundSize:'600% 100%',backgroundPosition:'0% 0%',imageRendering:'pixelated'}} />
              <div className="min-w-0">
                <span className="text-[#ffd700] font-bold text-[9px]">Gold Coin</span>
                <p className="text-[7px] text-[#807060] leading-tight">+50 pts. Spend 5 for Shift mega jump!</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
