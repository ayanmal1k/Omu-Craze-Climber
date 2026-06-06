'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/retro-climber';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Trophy, 
  Coins, 
  Gamepad2, 
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  // Game state mirroring
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load high score
      const savedHighScore = localStorage.getItem('omu_climber_high_score');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Instantiate game engine
    const engine = new GameEngine(canvasRef.current, {
      onScoreChange: (newScore) => setScore(newScore),
      onCoinChange: (newCoins) => setCoins(newCoins),
      onStateChange: (state) => setGameState(state),
      onGameOver: (finalScore) => {
        // Save high score if beaten
        const currentHigh = parseInt(localStorage.getItem('omu_climber_high_score') || '0', 10);
        if (finalScore > currentHigh) {
          localStorage.setItem('omu_climber_high_score', finalScore.toString());
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

  // Update mute state in engine when React state changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.audio.setMute(isMuted);
    }
  }, [isMuted]);

  // Button Action Handlers
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

  // Virtual Gamepad Handlers (Touch & Click)
  const handleTouchStart = (key: 'left' | 'right' | 'jump') => {
    if (engineRef.current) {
      engineRef.current.setKeyState(key, true);
    }
  };

  const handleTouchEnd = (key: 'left' | 'right' | 'jump') => {
    if (engineRef.current) {
      engineRef.current.setKeyState(key, false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-sky-300 via-sky-100 to-emerald-50 text-slate-800 antialiased font-sans">
      
      {/* Decorative fluffy clouds background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)] pointer-events-none" />

      {/* 2D Pixelation Happy Logo */}
      <header className="mb-6 text-center select-none z-10 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-sky-500 animate-bounce" />
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wider font-press-start text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-400 to-emerald-400 drop-shadow-[0_4px_6px_rgba(14,165,233,0.2)]">
            OMU CLIMBER
          </h1>
        </div>
        <p className="text-xs sm:text-sm font-bold text-sky-600/90 tracking-widest uppercase font-mono">
          ☁ Climb to the Clouds ☁
        </p>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-xl flex flex-col items-center gap-5 z-10">
        
        {/* Stats Dashboard Grid (Plump & Friendly Cards) */}
        <section className="w-full grid grid-cols-3 gap-3">
          {/* Score */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-md border border-white flex flex-col items-center text-center">
            <span className="text-[9px] font-press-start text-sky-500 uppercase font-semibold">Score</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-700 mt-1">{score}</span>
          </div>

          {/* Coins */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-md border border-white flex flex-col items-center text-center">
            <span className="text-[9px] font-press-start text-amber-500 uppercase font-semibold flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-500" /> Coins
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-500 mt-1">{coins}</span>
          </div>

          {/* High Score */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-md border border-white flex flex-col items-center text-center relative overflow-hidden">
            <span className="text-[9px] font-press-start text-indigo-500 uppercase font-semibold flex items-center gap-1 justify-center">
              <Trophy className="w-3 h-3 text-indigo-500 fill-indigo-500/10" /> Best
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 mt-1">{highScore}</span>
          </div>
        </section>

        {/* Clean, Framed Game Screen */}
        <section className="w-full relative flex flex-col items-center">
          <div className="w-full relative bg-sky-950 rounded-3xl p-3 shadow-[0_20px_40px_rgba(14,165,233,0.18)] border-8 border-white bg-clip-border overflow-hidden">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0284c7]">
              <canvas
                ref={canvasRef}
                width={480}
                height={640}
                className="w-full h-full pixelated select-none pointer-events-none"
              />

              {/* OVERLAYS based on game states */}
              
              {/* 1. START OVERLAY */}
              {gameState === 'START' && (
                <div className="absolute inset-0 bg-sky-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center animate-bounce">
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </div>
                  <h2 className="text-xl font-extrabold font-press-start text-cyan-300 mb-2">READY TO JUMP?</h2>
                  <p className="text-[10px] font-mono text-slate-300 mb-6 uppercase max-w-xs leading-relaxed">
                    Use A/D or arrows to guide the climber. Collect coins on platforms.
                  </p>
                  <button 
                    onClick={handleStartRestart}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white font-bold font-press-start text-xs rounded-2xl border-4 border-white shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    PLAY NOW
                  </button>
                </div>
              )}

              {/* 2. PAUSED OVERLAY */}
              {gameState === 'PAUSED' && (
                <div className="absolute inset-0 bg-sky-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                  <h2 className="text-xl font-extrabold font-press-start text-amber-400 mb-2 animate-pulse">GAME PAUSED</h2>
                  <p className="text-[10px] font-mono text-slate-300 mb-6">READY TO RESUME CLIMBING?</p>
                  <button 
                    onClick={handlePauseResume}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold font-press-start text-xs rounded-2xl border-4 border-white shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    RESUME
                  </button>
                </div>
              )}

              {/* 3. GAME OVER OVERLAY */}
              {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
                  <h2 className="text-2xl font-extrabold font-press-start text-rose-400 mb-2 drop-shadow-md">OH NO!</h2>
                  <p className="text-[10px] font-press-start text-slate-300 mt-2 mb-1">SCORE: {score}</p>
                  <p className="text-[10px] font-press-start text-yellow-400 mb-6">COINS: {coins}</p>
                  <button 
                    onClick={handleStartRestart}
                    className="px-6 py-3 bg-gradient-to-r from-rose-450 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold font-press-start text-xs rounded-2xl border-4 border-white shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {/* Floating pause button */}
              {gameState === 'PLAYING' && (
                <button
                  onClick={handlePauseResume}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white cursor-pointer z-20 backdrop-blur-xs transition-all"
                  aria-label="Pause Game"
                >
                  <Pause className="w-4 h-4 fill-white" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Happy Bubble Control Buttons (Always Available below Canvas) */}
        <section className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white flex justify-between items-center gap-3">
          
          {/* Audio toggle button */}
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center ${
              isMuted 
                ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100 shadow-[0_4px_0_rgba(244,63,94,0.1)]' 
                : 'bg-emerald-50 border-emerald-250 text-emerald-600 hover:bg-emerald-100 shadow-[0_4px_0_rgba(16,185,129,0.1)]'
            }`}
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Touch Gamepad Bubble Buttons */}
          <div className="flex items-center gap-3">
            <button
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              className="w-14 h-14 bg-sky-100 active:bg-sky-200 border-2 border-sky-300 rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_0_#bae6fd] select-none touch-none text-sky-600 active:translate-y-0.5 active:shadow-[0_2px_0_#bae6fd] transition-all"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Jump button */}
            <button
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
              onTouchStart={() => handleTouchStart('jump')}
              onTouchEnd={() => handleTouchEnd('jump')}
              className="w-20 h-14 bg-gradient-to-r from-pink-400 to-rose-450 hover:from-pink-300 hover:to-rose-400 border-2 border-pink-200 rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_0_#f472b6] select-none touch-none text-white font-bold active:translate-y-0.5 active:shadow-[0_2px_0_#f472b6] transition-all"
              aria-label="Jump"
            >
              <ArrowUp className="w-6 h-6 animate-bounce" />
            </button>

            <button
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              className="w-14 h-14 bg-sky-100 active:bg-sky-200 border-2 border-sky-300 rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_0_#bae6fd] select-none touch-none text-sky-600 active:translate-y-0.5 active:shadow-[0_2px_0_#bae6fd] transition-all"
              aria-label="Move Right"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Clean Controls & Information Panels below canvas */}
        <section className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white flex flex-col gap-3 font-mono text-slate-600 text-xs sm:text-sm">
          
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-bold font-press-start text-sky-600 uppercase flex items-center gap-1.5 border-b border-sky-100 pb-1.5">
              🎮 How to Play
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <div className="flex items-center justify-between bg-sky-50/50 p-2 rounded-xl border border-sky-100/50">
                <span>Move Left</span>
                <div className="flex gap-0.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">A</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">◀</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between bg-sky-50/50 p-2 rounded-xl border border-sky-100/50">
                <span>Move Right</span>
                <div className="flex gap-0.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">D</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">▶</kbd>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-between bg-pink-50/50 p-2 rounded-xl border border-pink-100/50">
                <span>Jump / Launch</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[9px]">SPACEBAR</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">W</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-slate-500 font-sans font-bold text-[10px]">▲</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold font-press-start text-emerald-600 uppercase flex items-center gap-1.5">
              ☘ Tips & Tricks
            </h3>
            <ul className="list-disc pl-4 text-xs flex flex-col gap-1.5 text-slate-500 leading-relaxed mt-1">
              <li>Loot <strong className="text-amber-500 font-bold">Spinning Gold Coins</strong> for a sweet <strong className="text-emerald-600">+50 points</strong> boost!</li>
              <li>Bounce on <strong className="text-cyan-500 font-bold">Spring Coils</strong> to shoot up into the stratosphere.</li>
              <li>Watch out for cracked <strong className="text-rose-400 font-bold">Crumbling Blocks</strong>; they break under your weight!</li>
              <li>Wrap around screen edges (going off-screen wraps you to the opposite side!).</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
