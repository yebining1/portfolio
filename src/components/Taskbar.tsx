import React, { useState, useEffect } from 'react';
import { Menu, Clock, Volume2, Wifi, Battery } from 'lucide-react';
import { WindowState, ThemeConfig, ThemeId } from '../types';

interface TaskbarProps {
  theme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentThemeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  windows: WindowState[];
  onToggleWindow: (id: string) => void;
  onStartClick: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isCrtOn: boolean;
  onToggleCrt: () => void;
}

export default function Taskbar({
  theme,
  windows,
  onToggleWindow,
  onStartClick,
  isPlayingMusic,
  onToggleMusic,
}: TaskbarProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${ampm} ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 w-full bg-white/60 backdrop-blur-md border-t border-[#E6DED5] fixed bottom-0 left-0 z-[9999] flex items-center justify-between px-6 select-none font-sans">
      
      {/* START BUTTON & WINDOW TABS */}
      <div className="flex items-center gap-3">
        {/* START BUTTON */}
        <button
          onClick={onStartClick}
          className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-full border text-xs font-bold uppercase cursor-pointer transition-all duration-150 shadow-sm hover:-translate-y-0.5"
          style={{
            backgroundColor: theme.accentColor,
            color: 'white',
            borderColor: theme.accentColor,
          }}
          title="START - 도움말 및 인사말 열기"
        >
          <Menu size={13} className="stroke-[2.5]" />
          <span>START</span>
        </button>

        {/* DIVIDER */}
        <div className="hidden sm:block h-5 w-[1px] bg-[#E6DED5] mx-1" />

        {/* WINDOW TABS */}
        <div className="flex items-center gap-2 max-w-[50vw] overflow-x-auto scrollbar-none">
          {windows.map((win) => {
            if (!win.isOpen) return null;
            return (
              <button
                key={win.id}
                onClick={() => onToggleWindow(win.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold max-w-[130px] truncate cursor-pointer transition-all duration-150 border`}
                style={!win.isMinimized ? {
                  backgroundColor: `${theme.accentColor}18`,
                  color: theme.accentColor,
                  borderColor: `${theme.accentColor}40`,
                  fontWeight: 'bold',
                } : {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#6b7280',
                  borderColor: 'rgba(230, 222, 213, 0.6)',
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span 
                    className="w-1.5 h-1.5 rounded-full transition-colors" 
                    style={{ backgroundColor: !win.isMinimized ? theme.accentColor : '#9ca3af' }}
                  />
                  {win.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SYSTEM TRAY */}
      <div className="flex items-center gap-4">
        {/* Current status marquee ticker */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-gray-400 max-w-[180px] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System active</span>
        </div>

        {/* LoFi music control directly in taskbar for ease of access */}
        <button
          onClick={onToggleMusic}
          className="p-1.5 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-sm hover:shadow active:scale-95"
          style={isPlayingMusic ? {
            color: theme.accentColor,
            backgroundColor: `${theme.accentColor}15`,
            borderColor: `${theme.accentColor}40`,
          } : {
            color: '#4b5563',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderColor: '#e5e7eb',
          }}
          title={isPlayingMusic ? "BGM 끄기" : "BGM 켜기 (Lo-Fi)"}
        >
          <Volume2 size={15} className={`${isPlayingMusic ? 'animate-bounce' : ''}`} />
        </button>

        {/* Network & Battery */}
        <div className="hidden xs:flex items-center gap-3 text-gray-500 font-mono text-xs opacity-90 border-l border-[#E6DED5] pl-3.5">
          <Wifi size={13} className="hover:text-gray-800 transition-colors" />
          <Battery size={13} className="hover:text-gray-800 transition-colors" />
        </div>

        {/* TIME DISPLAY (Now static and non-clickable as requested) */}
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200/60 bg-white/60 font-sans text-xs font-bold text-gray-700"
        >
          <Clock size={13} style={{ color: theme.accentColor }} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
