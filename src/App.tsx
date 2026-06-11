import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Compass,
  Sparkles,
  Trophy,
  Heart,
  RefreshCw,
  FolderOpen,
  Mail,
  Trash2,
  Maximize2,
  FileText,
  Volume2,
  VolumeX,
  Plus,
  Send,
  Download,
  AlertTriangle,
  Flame,
  HelpCircle,
  Activity,
  Calendar,
  Clock as ClockIcon,
  Power,
  RotateCcw,
  Moon,
  Settings,
  Check,
  PlusCircle
} from 'lucide-react';

import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';
import { WindowState, GuestbookEntry, ThemeConfig, ThemeId } from './types';
import { globalAudioSynth } from './utils/audio';

// DEFINE THEMES
const ALL_THEMES: ThemeConfig[] = [
  {
    id: 'lovely-pink',
    name: '🌸 러블리 핑크 (기본)',
    bgClass: 'bg-[#FFF2F6]',
    accentColor: '#FF699D',
    accentBgClass: 'bg-[#FF699D]',
    windowHeaderBg: '#FF699D',
    textClass: 'text-[#2C1820]',
    cardBg: 'bg-white',
  },
  {
    id: 'cream-orange',
    name: '🍊 크림 오렌지',
    bgClass: 'bg-[#FFF9F3]',
    accentColor: '#FF8A3D',
    accentBgClass: 'bg-[#FF8A3D]',
    windowHeaderBg: '#FF8A3D',
    textClass: 'text-[#222222]',
    cardBg: 'bg-white',
  },
  {
    id: 'retro-mint',
    name: '🌿 클래식 민트',
    bgClass: 'bg-[#F2FAF6]',
    accentColor: '#4CA77C',
    accentBgClass: 'bg-[#4CA77C]',
    windowHeaderBg: '#4CA77C',
    textClass: 'text-[#1D3227]',
    cardBg: 'bg-white',
  },
  {
    id: 'digital-lavender',
    name: '🔮 디지털 라벤더',
    bgClass: 'bg-[#F9F7FC]',
    accentColor: '#8C62FF',
    accentBgClass: 'bg-[#8C62FF]',
    windowHeaderBg: '#8C62FF',
    textClass: 'text-[#24133F]',
    cardBg: 'bg-white',
  },
  {
    id: 'classic-mac',
    name: '💻 클래식 맥 (회색)',
    bgClass: 'bg-[#DEE1E6]',
    accentColor: '#333333',
    accentBgClass: 'bg-[#555555]',
    windowHeaderBg: '#111111',
    textClass: 'text-[#111111]',
    cardBg: 'bg-[#F1F3F5]',
  }
];

export default function App() {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('lovely-pink');
  const [crtFilterOn, setCrtFilterOn] = useState<boolean>(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [topTime, setTopTime] = useState<string>('');
  
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [powerMode, setPowerMode] = useState<'normal' | 'sleep' | 'restart' | 'shutdown'>('normal');
  const [rebootProgress, setRebootProgress] = useState<number>(0);
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | 'special' | null>(null);

  const [scheduleTasks, setScheduleTasks] = useState([
    { id: 1, text: '🎓 한림대학교 1학기 기말고사 마감 및 성적 조회', done: false, date: '06.15' },
    { id: 2, text: '🎨 메이저맵 크리에이터 시즌2 활동 최종 피드백 보고', done: true, date: '06.24' },
    { id: 3, text: '🍊 KIKOC 패션 잡화 브랜드 SNS 운영 전략안 기획', done: false, date: '07.01' },
    { id: 4, text: '🏪 주말 편의점 리테일 물류 발주 조사 분석', done: false, date: '매주 수/금' },
  ]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newTodoDate, setNewTodoDate] = useState<string>('');

  useEffect(() => {
    const updateTopTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      };
      setTopTime(now.toLocaleDateString('ko-KR', options));
    };
    updateTopTime();
    const interval = setInterval(updateTopTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // WINDOW STATE MANAGEMENT
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'profile', title: 'PROFILE.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'side-quests', title: 'SIDEQUEST.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'kikoc-project', title: 'KIKOC_Project.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'achievements', title: 'ACHIEVEMENTS.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'stats', title: 'STATS.sys', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'future-update', title: 'FUTURE_UPDATE.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'guestbook', title: 'Guestbook.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'tutorial', title: 'READ_ME_FIRST.txt', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 60 },
    { id: 'letter', title: '💌 교수님께...', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'values', title: 'MY_VALUES.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
    { id: 'inventory', title: 'INVENTORY.exe', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 50 },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string>('tutorial');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('business');

  // GUESTBOOK REAL DATA STATE
  const [guestEntries, setGuestEntries] = useState<GuestbookEntry[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestMessage, setNewGuestMessage] = useState('');
  const [newGuestEmoji, setNewGuestEmoji] = useState('🧡');

  // Load guestbook on mount
  useEffect(() => {
    const saved = localStorage.getItem('yebin_guestbook');
    if (saved) {
      setGuestEntries(JSON.parse(saved));
    } else {
      // Default heartwarming mocked feedback for beautiful community feel!
      const initial: GuestbookEntry[] = [
        {
          id: '1',
          name: '포폴평가_교수님 🎓',
          content: '경영공학과 디지털아트의 융합이 신선하군! 가상 OS라는 아이디어 기획안이 기가 막힙니다. 스토리가 살아있어 지루하지 않은 완벽한 크리에이티브 점수 A+ 드립니다! 💯',
          createdAt: '2026.06.10',
          emoji: '💯'
        },
        {
          id: '2',
          name: '지피티양 (웹수석디자이너) 🎨',
          content: '예비나! 편의점 4년 짬에서 나오는 해결 능력과 대상 타이틀까지, 넌 진짜 어디가서도 사랑받을 인재야 🧡 KIKOC 브랜드 런칭하면 나 1호 멤버로 넣어줘!',
          createdAt: '2026.06.09',
          emoji: '🔥'
        },
        {
          id: '3',
          name: '동기 손주영 🐣',
          content: '과제 퀄리티 미쳤다 ㅋㅋㅋ 이거 어떻게 만든거냐?? 나도 포트폴리오 만드는 것 좀 도와줘!! 주황색 넘 이쁘다 🍊',
          createdAt: '2026.06.10',
          emoji: '⭐'
        }
      ];
      setGuestEntries(initial);
      localStorage.setItem('yebin_guestbook', JSON.stringify(initial));
    }
  }, []);

  const currentTheme = ALL_THEMES.find(t => t.id === currentThemeId) || ALL_THEMES[0];

  // AUDIO BGM SWITCH
  const handleToggleMusic = () => {
    const state = globalAudioSynth.toggle();
    setIsPlayingMusic(state);
  };

  // ACTIVATE WINDOW (UPFRONT IN Z-INDEX)
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      // Find the highest current z-index of open windows
      const maxZ = Math.max(...prev.map(w => w.zIndex || 50), 50);
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: maxZ + 1 };
        }
        return w;
      });
    });
  };

  // OPEN WINDOW
  const openWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex || 50), 50);
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 };
        }
        return w;
      });
    });
  };

  // CLOSE WINDOW
  const closeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, isOpen: false };
        }
        return w;
      })
    );
  };

  // MINIMIZE WINDOW
  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, isMinimized: true };
        }
        return w;
      })
    );
  };

  // MAXIMIZE WINDOW (EXPAND/RESTORE)
  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, isMaximized: !w.isMaximized };
        }
        return w;
      })
    );
  };

  // TOGGLE WINDOW FROM TASKBAR (MINIMIZE / RESTORE CYCLE)
  const toggleWindowFromTaskbar = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;

    if (win.isMinimized || activeWindowId !== id) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  // ADD NEW GUESTBOOK ENTRY
  const handleAddGuestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestMessage.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      content: newGuestMessage.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '.').slice(0, -1),
      emoji: newGuestEmoji
    };

    const updated = [newEntry, ...guestEntries];
    setGuestEntries(updated);
    localStorage.setItem('yebin_guestbook', JSON.stringify(updated));

    setNewGuestName('');
    setNewGuestMessage('');
  };

  // SCHEDULE TASK HANDLERS
  const handleToggleTask = (id: number) => {
    setScheduleTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTodoText.trim(),
      done: false,
      date: newTodoDate.trim() || '오늘'
    };
    setScheduleTasks(prev => [...prev, newTask]);
    setNewTodoText('');
    setNewTodoDate('');
  };

  const handleDeleteTask = (id: number) => {
    setScheduleTasks(prev => prev.filter(t => t.id !== id));
  };

  // POWER MODE HANDLERS
  const handleRestart = () => {
    setIsStartMenuOpen(false);
    setPowerMode('restart');
    setRebootProgress(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPowerMode('normal');
          // Reset windows to default, with tutorial open!
          setWindows(prev => prev.map(w => w.id === 'tutorial' ? { ...w, isOpen: true, isMinimized: false } : { ...w, isOpen: false }));
        }, 500);
      } else {
        setRebootProgress(current);
      }
    }, 120);
  };

  // TRASH BIN PURGE EASTER EGG
  const handlePurgeGuestbook = () => {
    if (confirm('모든 방문 후기를 초기화하고 오리지널 데이터 세트로 되돌릴까요?')) {
      localStorage.removeItem('yebin_guestbook');
      const initial: GuestbookEntry[] = [
        {
          id: '1',
          name: '포폴평가_교수님 🎓',
          content: '경영공학과 디지털아트의 융합이 신선하군! 가상 OS라는 아이디어 기획안이 기가 막힙니다. 스토리가 살아있어 지루하지 않은 완벽한 크리에이티브 점수 A+ 드립니다! 💯',
          createdAt: '2026.06.10',
          emoji: '💯'
        },
        {
          id: '2',
          name: '지피티양 (웹수석디자이너) 🎨',
          content: '예비나! 편의점 4년 짬에서 나오는 해결 능력과 대상 타이틀까지, 넌 진짜 어디가서도 사랑받을 인재야 🧡 KIKOC 브랜드 런칭하면 나 1호 멤버로 넣어줘!',
          createdAt: '2026.06.09',
          emoji: '🔥'
        }
      ];
      setGuestEntries(initial);
      alert('방명록이 초기의 영광스런 상태로 리턴되었습니다! ✨');
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bgClass} relative overflow-hidden transition-colors duration-500 font-sans`}
    >
      {/* CRT SCANLINES EFFECT */}
      {crtFilterOn && <div className="crt-lines pointer-events-none fixed inset-0 z-[99999] opacity-[0.12]" />}

      {/* MENU BACKDROP TO CLOSE POPUPS */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-[9990]" 
          onClick={() => setActiveMenu(null)} 
        />
      )}

      {/* SYSTEM TOP BAR */}
      <div className="h-8 w-full bg-white/80 backdrop-blur-md border-b border-[#E6DED5]/70 flex items-center justify-between px-6 select-none text-xs font-sans text-gray-700 fixed top-0 left-0 z-[10000] shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-extrabold tracking-tight cursor-default flex items-center gap-1.5 mr-2" style={{ color: currentTheme.accentColor }}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" style={{ backgroundColor: currentTheme.accentColor }} />
            YEBIN OS v21.0
          </span>
          <div className="hidden sm:flex items-center gap-4 text-gray-400 font-semibold text-[11px] uppercase tracking-wider relative">
            {/* File Menu */}
            <div className="relative">
              <span 
                onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
                className={`hover:text-gray-950 hover:bg-neutral-100 px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'file' ? 'bg-neutral-100 text-gray-850 font-black' : ''}`}
              >
                File
              </span>
              <AnimatePresence>
                {activeMenu === 'file' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-6 left-0 w-44 bg-white/95 backdrop-blur-md border border-[#E6DED5] rounded-xl shadow-xl p-1 z-[10100] text-left normal-case transform-none font-sans"
                  >
                    <button 
                      type="button"
                      onClick={() => { openWindow('tutorial'); setActiveMenu(null); }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>📝 README.txt 열기</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { handlePurgeGuestbook(); setActiveMenu(null); }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🗑️ 리스트 파일 정리</span>
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button 
                      type="button"
                      onClick={() => { setPowerMode('shutdown'); setActiveMenu(null); }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-[10px] font-bold text-red-500 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🔌 시스템 종료 (Shut Down)</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <span 
                onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
                className={`hover:text-gray-950 hover:bg-neutral-100 px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'edit' ? 'bg-neutral-100 text-gray-850 font-black' : ''}`}
              >
                Edit
              </span>
              <AnimatePresence>
                {activeMenu === 'edit' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-6 left-0 w-44 bg-white/95 backdrop-blur-md border border-[#E6DED5] rounded-xl shadow-xl p-1 z-[10100] text-left normal-case transform-none font-sans"
                  >
                    <button 
                      type="button"
                      onClick={() => { 
                        openWindow('guestbook'); 
                        setActiveMenu(null); 
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>✍️ 방명록 쓰기</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { 
                        alert('✨ 손예빈 포트폴리오 주소가 복사되었습니다!');
                        navigator.clipboard.writeText(window.location.href);
                        setActiveMenu(null); 
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🔗 포폴 주소 클립보드 복사</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Menu */}
            <div className="relative">
              <span 
                onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
                className={`hover:text-gray-950 hover:bg-neutral-100 px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'view' ? 'bg-neutral-100 text-gray-850 font-black' : ''}`}
              >
                View
              </span>
              <AnimatePresence>
                {activeMenu === 'view' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-6 left-0 w-48 bg-white/95 backdrop-blur-md border border-[#E6DED5] rounded-xl shadow-xl p-1 z-[10100] text-left normal-case transform-none font-sans"
                  >
                    <button 
                      type="button"
                      onClick={() => { setCrtFilterOn(!crtFilterOn); setActiveMenu(null); }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center justify-between cursor-pointer border-none bg-none"
                    >
                      <span>📺 CRT 레트로 필터 효과</span>
                      <span className="text-[9px] text-[#FF8A3D] font-mono">{crtFilterOn ? '켜짐' : '꺼짐'}</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { 
                        setWindows(prev => prev.map(w => ({ ...w, isOpen: false, isMinimized: false })));
                        setActiveMenu(null); 
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🧹 모든 실행 창 닫기</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { 
                        setWindows(prev => prev.map(w => w.id === 'tutorial' ? { ...w, isOpen: true, isMinimized: false } : { ...w, isOpen: false }));
                        setActiveMenu(null); 
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🔄 화면 정렬 초기화</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Special Menu */}
            <div className="relative">
              <span 
                onClick={() => setActiveMenu(activeMenu === 'special' ? null : 'special')}
                className={`hover:text-gray-950 hover:bg-neutral-100 px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'special' ? 'bg-neutral-100 text-gray-850 font-black' : ''}`}
              >
                Special
              </span>
              <AnimatePresence>
                {activeMenu === 'special' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-6 left-0 w-44 bg-white/95 backdrop-blur-md border border-[#E6DED5] rounded-xl shadow-xl p-1 z-[10100] text-left normal-case transform-none font-sans"
                  >
                    {ALL_THEMES.map(themeOption => (
                      <button 
                        key={themeOption.id}
                        type="button"
                        onClick={() => { setCurrentThemeId(themeOption.id); setActiveMenu(null); }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: themeOption.accentColor }} />
                        <span>{themeOption.name}</span>
                      </button>
                    ))}
                    <hr className="my-1 border-gray-100" />
                    <button 
                      type="button"
                      onClick={() => { handleRestart(); setActiveMenu(null); }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-amber-500/10 hover:text-amber-700 rounded-lg text-[10px] font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer border-none bg-none"
                    >
                      <span>🔄 시스템 시뮬레이터 재설정</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            YEBIN ACTIVE
          </span>
          <div className="h-3.5 w-[1px] bg-gray-200" />
          <span className="font-bold text-gray-500 text-[11px]">{topTime || '시간 로딩 중...'}</span>
        </div>
      </div>

      {/* FLOATING RETRO WATERMARKS */}
      <div className={`absolute top-16 right-16 opacity-5 select-none text-9xl font-display font-black tracking-tighter pointer-events-none ${currentThemeId === 'lovely-pink' ? 'text-pink-950' : 'text-orange-950'}`}>
        YEBIN OS
      </div>
      <div className={`absolute bottom-24 left-16 opacity-5 select-none text-8xl font-display font-black tracking-tighter pointer-events-none ${currentThemeId === 'lovely-pink' ? 'text-pink-950' : 'text-orange-950'}`}>
        v21.0
      </div>

      {/* MAIN DESKTOP AREA */}
      <div className="w-full h-screen pt-8 pb-12 overflow-hidden relative text-gray-800">
        
        {/* INNER FLEX CONTAINER FOR ICONS & SIDEBAR */}
        <div className="w-full h-full flex gap-6">
          
          {/* WORKSPACE LEFT/CENTER: Icons and Header */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* DESKTOP HEADER BRIEF */}
              <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-[#E6DED5]/60 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold animate-bounce filter drop-shadow">
                    {currentThemeId === 'lovely-pink' ? '🌸' : '🍊'}
                  </span>
                  <div>
                    <h1 className="font-sans font-black text-xl text-gray-800 tracking-tight uppercase flex items-center gap-1.5">
                      SON YEBIN.zip <span className="text-[9px] text-white rounded-full px-2.5 py-0.5 normal-case font-extrabold tracking-wide" style={{ backgroundColor: currentTheme.accentColor }}>VER 22.0</span>
                    </h1>
                    <p className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Created on Hallym Uni / Majored in Biz Admin & Digital Humanities
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0 font-sans">
                  {/* Quick action buttons on top desktop */}
                  <div className="flex flex-wrap items-center gap-1 bg-white/50 backdrop-blur-md border border-[#E6DED5]/60 p-1 rounded-2xl shadow-sm">
                    {/* Tutorial (Help) */}
                    <button
                      onClick={() => openWindow('tutorial')}
                      className="px-3 py-1 text-[10px] font-bold bg-white border border-gray-150 hover:bg-white rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95"
                      style={{ color: currentTheme.accentColor }}
                    >
                      <span>ℹ️ 도움말</span>
                    </button>

                    {/* Theme toggling */}
                    <button
                      onClick={() => setCurrentThemeId(currentThemeId === 'lovely-pink' ? 'cream-orange' : 'lovely-pink')}
                      className="px-3 py-1 text-[10px] font-bold bg-white border border-gray-150 hover:bg-white rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95"
                      style={{ color: currentTheme.accentColor }}
                    >
                      <span>{currentThemeId === 'lovely-pink' ? '🧡 오렌지 테마' : '🌸 핑크 테마'}</span>
                    </button>

                    {/* BGM Toggle */}
                    <button
                      onClick={handleToggleMusic}
                      className="px-3 py-1 text-[10px] font-bold bg-white border border-gray-150 hover:bg-white rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                      style={{ color: currentTheme.accentColor }}
                    >
                      {isPlayingMusic ? (
                        <Volume2 size={11} className="animate-pulse" style={{ color: currentTheme.accentColor }} />
                      ) : (
                        <VolumeX size={11} />
                      )}
                      <span>BGM {isPlayingMusic ? 'OFF' : 'ON'}</span>
                    </button>

                    {/* CRT shader Toggle */}
                    <button
                      onClick={() => setCrtFilterOn(!crtFilterOn)}
                      className="px-3 py-1 text-[10px] font-bold bg-white border border-gray-150 hover:bg-white rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95"
                      style={{ color: crtFilterOn ? currentTheme.accentColor : '#6b7280' }}
                    >
                      <span>📺 CRT {crtFilterOn ? 'OFF' : 'ON'}</span>
                    </button>
                  </div>
                </div>
              </header>

              {/* DESKTOP GRID ICONS */}
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 gap-y-6">
                <DesktopIcon
                  id="profile"
                  title="PROFILE.exe"
                  icon={<User size={26} className={currentThemeId === 'lovely-pink' ? "text-pink-500" : "text-orange-500"} />}
                  onClick={() => openWindow('profile')}
                  colorClass={currentThemeId === 'lovely-pink' ? "bg-pink-50" : "bg-orange-50"}
                />
                <DesktopIcon
                  id="stats"
                  title="STATS.sys"
                  icon={<Activity size={26} className="text-rose-500 animate-[pulse_3s_infinite]" />}
                  onClick={() => openWindow('stats')}
                  colorClass="bg-rose-50/50"
                />
                <DesktopIcon
                  id="side-quests"
                  title="SIDEQUEST.exe"
                  icon={<Compass size={26} className="text-emerald-500" />}
                  onClick={() => openWindow('side-quests')}
                  colorClass="bg-emerald-50"
                />
                <DesktopIcon
                  id="kikoc-project"
                  title="KIKOC_Project.exe"
                  icon={<Sparkles size={26} className="text-indigo-500" />}
                  onClick={() => openWindow('kikoc-project')}
                  colorClass="bg-indigo-50"
                />
                <DesktopIcon
                  id="achievements"
                  title="ACHIEVEMENTS.exe"
                  icon={<Trophy size={26} className="text-yellow-500" />}
                  onClick={() => openWindow('achievements')}
                  colorClass="bg-yellow-50"
                />
                <DesktopIcon
                  id="future-update"
                  title="FUTURE_UPDATE.exe"
                  icon={<RefreshCw size={26} className="text-sky-500" />}
                  onClick={() => openWindow('future-update')}
                  colorClass="bg-sky-50"
                />
                <DesktopIcon
                  id="guestbook"
                  title="Guestbook.exe"
                  icon={<FileText size={26} className="text-amber-500" />}
                  onClick={() => openWindow('guestbook')}
                  colorClass="bg-amber-50"
                />

                <DesktopIcon
                  id="tutorial"
                  title="READ_ME.txt"
                  icon={<FileText size={26} className="text-sky-500 animate-pulse" />}
                  onClick={() => openWindow('tutorial')}
                  colorClass="bg-sky-50"
                />

                <DesktopIcon
                  id="letter"
                  title="교수님께..."
                  icon={<Heart size={26} className="text-pink-500 fill-pink-100 animate-bounce" style={{ animationDuration: '3s' }} />}
                  onClick={() => openWindow('letter')}
                  colorClass="bg-red-50"
                />
                <DesktopIcon
                  id="values"
                  title="MY_VALUES.exe"
                  icon={
                    <div className="relative flex items-center justify-center w-full h-full select-none text-2xl font-black filter drop-shadow animate-pulse" style={{ animationDuration: '4s' }}>
                      🌷
                    </div>
                  }
                  onClick={() => openWindow('values')}
                  colorClass="bg-pink-50/70 border-pink-200"
                />
                <DesktopIcon
                  id="inventory"
                  title="INVENTORY.exe"
                  icon={
                    <div className="relative flex items-center justify-center w-full h-full select-none text-2xl font-black filter drop-shadow hover:scale-110 transition-transform">
                      🎒
                    </div>
                  }
                  onClick={() => openWindow('inventory')}
                  colorClass="bg-amber-50/70 border-amber-200"
                />

                {/* Desktop easteregg bin */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={handlePurgeGuestbook}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl cursor-pointer select-none w-22 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl border border-dashed border-red-300 flex items-center justify-center bg-red-50/20 hover:bg-red-50 transition-colors shadow-sm">
                    <Trash2 size={22} className="text-red-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className="mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-red-50/70 border border-red-200/50 text-red-500 shadow-sm">
                    수동 리셋통
                  </span>
                </motion.div>
              </div>

              {/* RETRO DYNAMIC DESKTOP WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pointer-events-auto">
                {/* WIDGET 1: APPLE COZY CLOCK & STATUS */}
                <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#E6DED5] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/10 rounded-full blur-xl -ml-8 -mb-8" />
                  
                  <div className="z-10">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <ClockIcon size={12} className="text-orange-400 animate-[spin_10s_linear_infinite]" />
                      <span>Cozy OS Desktop Clock</span>
                    </div>
                    <div className="font-display font-black text-4xl text-gray-800 tracking-tight flex items-baseline gap-1">
                      <span>{topTime ? topTime.split(' ').pop() : '00:00'}</span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold relative -top-3">AM/PM</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-tight">
                      📍 Hallym University (한림대학교 캠퍼스)
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#E6DED5]/60 z-10 flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-[9px] uppercase font-bold tracking-wider text-gray-400">TODAY'S MOTTO</div>
                      <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>"두려워 말고 다가가 채우라, 하나씩 쌓인 배움이 결국 거대한 성장을 이끈다." 🎓✨</span>
                      </div>
                    </div>
                    <span className="text-2xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer">🍊</span>
                  </div>
                </div>

                {/* WIDGET 2: AGENDA & MILESTONES */}
                <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#E6DED5] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="z-10 flex-1">
                    <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-[#E6DED5]/50">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <Calendar size={12} className="text-pink-500 animate-bounce" />
                        <span>Yebin's Active Agenda</span>
                      </div>
                      <span className="text-[9px] bg-white border border-gray-200 text-gray-500 font-bold px-2 py-0.5 rounded-full inline-block">
                        {scheduleTasks.filter(t => !t.done).length} Tasks Left
                      </span>
                    </div>

                    {/* Task rows */}
                    <div className="space-y-2 max-h-[105px] overflow-y-auto scrollbar-thin pr-1 text-left">
                      {scheduleTasks.map(task => (
                        <div key={task.id} className="flex items-start gap-2 group/task">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                              task.done
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                : 'bg-white border-[#E6DED5] hover:border-gray-400'
                            }`}
                          >
                            {task.done && <Check size={10} className="stroke-[3]" />}
                          </button>
                          <span
                            onClick={() => handleToggleTask(task.id)}
                            className={`text-[11px] select-none cursor-pointer flex-1 transition-all ${
                              task.done
                                ? 'text-gray-400 line-through'
                                : 'text-gray-700 font-medium group-hover/task:text-gray-900'
                            }`}
                          >
                            {task.text}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] whitespace-nowrap bg-white/70 font-mono font-bold text-gray-400 border border-gray-200 px-1 py-0.2 rounded">
                              {task.date}
                            </span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-[9px] font-bold text-red-400 opacity-0 group-hover/task:opacity-100 transition-opacity hover:text-red-600 px-1 py-0.5 rounded"
                              title="삭제"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add task quick form */}
                  <form onSubmit={handleAddTask} className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#E6DED5]/60 z-10">
                    <input
                      type="text"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      placeholder="새 일정 등록..."
                      className="flex-1 bg-white/60 border border-[#E6DED5]/60 px-2.5 py-1 text-xs rounded-xl focus:outline-none focus:border-amber-400 font-sans shadow-inner placeholder-gray-400"
                    />
                    <input
                      type="text"
                      value={newTodoDate}
                      onChange={(e) => setNewTodoDate(e.target.value)}
                      placeholder="날짜 (07.01)"
                      className="w-16 bg-white/60 border border-[#E6DED5]/60 px-1.5 py-1 text-[10px] font-bold rounded-xl focus:outline-none focus:border-amber-400 font-mono text-center shadow-inner placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded-full bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200 text-amber-500 cursor-pointer shadow-sm transition-transform active:scale-90 flex items-center justify-center"
                    >
                      <PlusCircle size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Interactive footer details watermark */}
            <div className="hidden md:block text-[10px] text-gray-400 font-sans tracking-wide">
              Double-click folders or applications to explore details. Experience is optimized in full width.
            </div>
          </div>

          {/* WORKSPACE RIGHT SIDEBAR: Sticky Widget Notes directly from Immersive UI mockup! */}
          <aside className="hidden lg:flex w-64 flex-col gap-4 border-l border-[#E6DED5]/60 pl-6 pr-4 py-6 overflow-y-auto select-none bg-white/20 backdrop-blur-sm">
            {/* Sticky target widget */}
            <div className="bg-[#FFFDF4] border border-[#F6EBD0] p-4.5 rounded-2xl shadow-sm rotate-1 hover:rotate-0 transition-transform duration-300">
              <span className="text-[9px] font-extrabold text-[#FF8A3D] uppercase tracking-widest block mb-1">MISSION TARGET</span>
              <p className="text-[11px] font-semibold text-gray-700 leading-relaxed">
                "브랜드 기획의 전방위 뼈대를 구축하면서도 눈을 사로잡는 시각 가치를 손수 창출하는 다재다능한 융합 마케터 소행이 되자!"
              </p>
            </div>

            {/* Status logs widget */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-4.5 rounded-2xl shadow-sm -rotate-1 hover:rotate-0 transition-transform duration-300">
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block mb-1">SYSTEM STATS</span>
              <div className="space-y-1 text-xs text-emerald-800">
                <div className="flex justify-between"><span>Core compile:</span> <span className="font-extrabold">v22.0</span></div>
                <div className="flex justify-between"><span>Active task:</span> <span className="font-extrabold truncate max-w-[100px]">KIKOC 런칭</span></div>
                <div className="flex justify-between"><span>Audio BGM:</span> <span className="font-extrabold">{isPlayingMusic ? 'SYNTH ON' : 'MUTED'}</span></div>
              </div>
            </div>

            {/* Guestbook counts widget */}
            <div className="bg-indigo-50/40 border border-indigo-100 p-4.5 rounded-2xl shadow-sm rotate-2 hover:rotate-0 transition-transform duration-300">
              <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">VISITOR LOGS</span>
              <p className="text-xs text-indigo-900 leading-relaxed text-left">
                격려 방명록 게시물 총 <strong className="text-sm font-black text-indigo-700">{guestEntries.length}개</strong>를 성공적으로 수집하여 안전 관리 중입니다.
              </p>
              <button
                onClick={() => openWindow('guestbook')}
                className="mt-2 text-[10px] font-bold text-indigo-600 bg-white border border-indigo-150 rounded-full px-3 py-1 cursor-pointer hover:bg-indigo-100 transition-colors w-full text-center"
              >
                후기 작성하러 가기
              </button>
            </div>

            {/* Pinned Failure-Experience Memo Note requested by user */}
            <div className="bg-[#FFFCE4] border-2 border-dashed border-amber-200 p-4 rounded-2xl shadow-sm -rotate-1 hover:rotate-0 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-1.5 right-2 sm:right-2.5 text-base select-none">📌</div>
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest block mb-1.5 font-sans text-left">MEMO FOR GROWTH</span>
              <p className="text-[11px] font-medium text-amber-950 font-sans leading-relaxed text-left whitespace-pre-wrap">
{`모든 프로젝트가 성공한 것은 아닙니다.

중간에 포기한 아이디어도 있었고
예상대로 되지 않았던 결과도 있었습니다.

하지만 그 경험들이
지금의 저를 만들었습니다.`}
              </p>
            </div>
          </aside>

        </div>

        {/* ========================================================= */}
        {/* WINDOWS LAYER ZONE                                        */}
        {/* ========================================================= */}
        
        {/* 0. TUTORIAL WINDOW */}
        <Window
          windowState={windows.find(w => w.id === 'tutorial')!}
          theme={currentTheme}
          onClose={() => closeWindow('tutorial')}
          onMinimize={() => minimizeWindow('tutorial')}
          onMaximize={() => toggleMaximizeWindow('tutorial')}
          onFocus={() => focusWindow('tutorial')}
          icon={<FileText size={16} className="text-slate-500" />}
          defaultWidth="max-w-md"
          defaultX={60}
          defaultY={120}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-xl">✨</span>
              <h2 className="font-display font-extrabold text-base text-gray-900 leading-tight">
                손예빈 가상 OS에 오신 것을 환영합니다!
              </h2>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              안녕하세요! <strong>영원히 업데이트 중인 기획자이자 콘텐츠 디자이너</strong> 손예빈의 공간을 담은 포트폴리오 OS입니다.<br /><br />
              바탕화면의 여러 아이콘을 클릭하여 재미있는 기획과 포트폴리오 전경을 여행해보세요.
            </p>
          </div>
        </Window>

        {/* 1. PROFILE WINDOW (PROFILE.exe) */}
        <Window
          windowState={windows.find(w => w.id === 'profile')!}
          theme={currentTheme}
          onClose={() => closeWindow('profile')}
          onMinimize={() => minimizeWindow('profile')}
          onMaximize={() => toggleMaximizeWindow('profile')}
          onFocus={() => focusWindow('profile')}
          icon={<User size={16} style={{ color: currentTheme.accentColor }} />}
          defaultWidth="max-w-2xl"
          defaultX={100}
          defaultY={100}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Visual Frame */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div 
                className="w-full aspect-square rounded-xl border-3 border-[#222222] retro-window-shadow overflow-hidden relative flex items-center justify-center text-7xl select-none transition-colors duration-300"
                style={{ backgroundColor: currentThemeId === 'lovely-pink' ? '#FFF0F4' : '#FFF2E6' }}
              >
                👩‍🎨
                <div 
                  className="absolute top-2 right-2 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-black/10 transition-colors duration-300 animate-pulse"
                  style={{ backgroundColor: currentTheme.accentColor }}
                >
                  LIVE PROFILE
                </div>
                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#222222] py-2 text-center">
                  <span className="text-[10px] font-mono font-bold text-[#FFF9F3] uppercase tracking-wide">
                    SON YEBIN.EXE
                  </span>
                </div>
              </div>

              {/* Sub-label */}
              <div 
                className="mt-4 border p-3 rounded-lg text-center w-full transition-colors duration-300"
                style={{
                  backgroundColor: currentThemeId === 'lovely-pink' ? '#FFEBF0' : '#FFEDDF',
                  borderColor: currentThemeId === 'lovely-pink' ? '#FFD0DD' : '#FFD2B8'
                }}
              >
                <span className="text-xs font-bold block" style={{ color: currentThemeId === 'lovely-pink' ? '#D03E6D' : '#BF5418' }}>
                  "생각에 그치지 않고 직접 실행!"
                </span>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="md:col-span-8 space-y-5 font-sans">
              <div>
                <span className="text-[9px] font-bold text-gray-400 block uppercase font-display tracking-wider">
                  USER PROFILE INFO
                </span>
                <h2 className="font-display font-black text-2xl text-gray-900 tracking-tight flex items-center gap-2">
                  손예빈 <span className="text-xs font-medium text-gray-400 font-mono">(Hallym Uni)</span>
                </h2>
              </div>

              {/* Academic Details */}
              <div className="bg-gray-50 border border-black/5 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-[#222222]">🏛️ 소속</span>
                  <span className="text-gray-700 font-medium">한림대학교 경영학과</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#222222]">🎨 부전공</span>
                  <span className="font-bold transition-colors" style={{ color: currentTheme.accentColor }}>디지털인문예술 (DHA)</span>
                </div>
              </div>

              {/* Introduction */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-[#FF8A3D] uppercase tracking-widest block">INTRODUCTION</span>
                <p className="text-xs text-gray-700 leading-relaxed font-normal bg-amber-50/30 p-4 border border-amber-100 rounded-xl whitespace-pre-line font-sans">
                  {`안녕하세요!

저는 손예빈입니다.

한림대학교 경영학과에 재학 중이며
디지털인문예술을 부전공하고 있습니다.

기획과 디자인,
그리고 브랜딩에 관심이 많습니다.

새로운 아이디어를 떠올리는 것뿐 아니라
실제로 구현해보는 과정을 좋아합니다.

생각은 많지만
결국 실행하는 사람입니다.`}
                </p>
              </div>

              {/* Character Tags */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block font-sans">CHARACTER</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '호기심 많음',
                    '새로운 도전 좋아함',
                    '실행력이 좋은 편',
                    '브랜드와 디자인에 관심 많음',
                    '여행 좋아함',
                    '야식의 유혹에 약함'
                  ].map((char, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 rounded-full border border-gray-200/80 text-xs font-semibold flex items-center gap-1.5 shadow-sm bg-[#FFFDF9] text-gray-600 hover:border-amber-300 transition-colors"
                    >
                      <span className="text-orange-500 font-bold">✔</span>
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career major flow track requested by user */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold text-[#FF8A3D] uppercase tracking-widest block font-sans">
                  🚀 GROWTH TRAJECTORY (배움과 가치의 여정)
                </span>
                <div className="overflow-x-auto pb-1 scrollbar-thin">
                  <div className="flex items-center gap-2 min-w-max p-2.5 bg-neutral-50/50 rounded-xl border border-neutral-100">
                    <div className="flex flex-col items-center px-2 py-1 bg-neutral-100 border border-neutral-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-neutral-400">00</span>
                      <span className="text-[11px] font-extrabold text-neutral-600 font-sans">START</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-amber-500">01 MAJOR</span>
                      <span className="text-[11px] font-extrabold text-amber-800 font-sans">경영학과</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-2 py-1 bg-pink-50 border border-pink-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-pink-500">02 DIGI-ART</span>
                      <span className="text-[11px] font-extrabold text-pink-800 font-sans">디지털인문예술</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-orange-500">03 BRAND</span>
                      <span className="text-[11px] font-extrabold text-orange-850 font-sans">브랜딩</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-2 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-indigo-550">04 DESIGN</span>
                      <span className="text-[11px] font-extrabold text-indigo-800 font-sans">콘텐츠 디자인</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-center">
                      <span className="text-[8px] font-mono font-bold text-teal-500">05 COMMERCE</span>
                      <span className="text-[11px] font-extrabold text-teal-800 font-sans">마케팅</span>
                    </div>

                    <span className="text-gray-300 text-xs select-none">➔</span>

                    <div className="flex flex-col items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-400 border border-transparent rounded-lg text-center text-white font-extrabold animate-pulse">
                      <span className="text-[8px] font-mono font-bold text-pink-100">06 FUTURE</span>
                      <span className="text-[11px] font-sans">???</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Window>

        {/* 1.5. STATS WINDOW (STATS.sys) */}
        <Window
          windowState={windows.find(w => w.id === 'stats')!}
          theme={currentTheme}
          onClose={() => closeWindow('stats')}
          onMinimize={() => minimizeWindow('stats')}
          onMaximize={() => toggleMaximizeWindow('stats')}
          onFocus={() => focusWindow('stats')}
          icon={<Activity size={16} className="text-rose-500 animate-[pulse_1.5s_infinite]" />}
          defaultWidth="max-w-xl"
          defaultX={120}
          defaultY={110}
        >
          <div className="space-y-6 font-sans">
            <div className="border-b border-[#222222]/10 pb-2">
              <span className="text-[10px] font-bold text-rose-600 block font-display tracking-widest uppercase">
                SYSTEM REGISTER STATUS
              </span>
              <h2 className="font-display font-black text-2xl text-gray-900 tracking-tight flex items-center gap-1.5">
                📊 STATS.sys <span className="text-xs font-normal text-gray-400 font-mono">(User Stats & Specs)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              {/* PROGRESS STATUS BARS */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-[#FF8A3D] uppercase tracking-wider">
                  USER STATUS
                </h3>

                {/* Progress Group 1: 기획력 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>💡 기획력 (Planning)</span>
                    <span className="text-indigo-600">80% [████████░░]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      className="h-full bg-indigo-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Progress Group 2: 실행력 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>⚡ 실행력 (Execution)</span>
                    <span className="text-emerald-600">90% [█████████░]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      className="h-full bg-emerald-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Progress Group 3: 창의력 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>🎨 창의력 (Creativity)</span>
                    <span className="text-pink-600">95% [█████████░]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      className="h-full bg-pink-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Progress Group 4: 호기심 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>🔍 호기심 (Curiosity)</span>
                    <span className="text-sky-600">100% [██████████]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="h-full bg-sky-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Progress Group 5: 체력 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>💤 체력 (Stamina)</span>
                    <span className="text-red-500">40% [████░░░░░░]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '40%' }}
                      className="h-full bg-red-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Progress Group 6: 야식참기 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span>🍕 야식참기 (Late Snack Resistance)</span>
                    <span className="text-orange-500">20% [██░░░░░░░░]</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#222222]/10 flex items-center p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '20%' }}
                      className="h-full bg-orange-400 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* SPECIAL SKILLS */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-[#FF8A3D] uppercase tracking-wider">
                  SPECIAL SKILLS
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { title: "아이디어 발상", desc: "남들이 지나치는 디테일을 포착하여 기획으로 연계" },
                    { title: "콘텐츠 기획", desc: "독자 중심의 가치를 타겟팅하는 트렌디 스토리보딩" },
                    { title: "브랜드 분석", desc: "브랜드만의 깊은 성격과 감각적 마케팅 포지션 수립" },
                    { title: "디자인 툴 활용", desc: "Figma, Illustrator, Photoshop 등을 활용한 비주얼 구현" },
                    { title: "SNS 콘텐츠 제작", desc: "눈길을 사로잡는 레이아웃과 카드뉴스 및 홍보 포스팅" }
                  ].map((skill, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-[#FFFDF9] border border-gray-200/80 rounded-xl shadow-sm hover:border-amber-300 transition-colors flex items-start gap-2.5"
                    >
                      <span className="text-[#FF8A3D] font-bold">✔</span>
                      <div>
                        <span className="font-bold text-xs block text-gray-800">{skill.title}</span>
                        <span className="text-[10px] text-gray-400 leading-tight block mt-0.5">{skill.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Window>

        {/* 2. SIDE QUESTS WINDOW (SIDE_QUESTS.lnk) */}
        <Window
          windowState={windows.find(w => w.id === 'side-quests')!}
          theme={currentTheme}
          onClose={() => closeWindow('side-quests')}
          onMinimize={() => minimizeWindow('side-quests')}
          onMaximize={() => toggleMaximizeWindow('side-quests')}
          onFocus={() => focusWindow('side-quests')}
          icon={<Compass size={16} className="text-emerald-500" />}
          defaultWidth="max-w-xl"
          defaultX={160}
          defaultY={110}
        >
          <div className="space-y-6">
            <div className="border-b border-[#222222]/10 pb-2">
              <span className="text-[10px] font-bold text-emerald-600 block font-display tracking-widest uppercase">
                SUCCESSFULLY CLEARED
              </span>
              <h2 className="font-display font-black text-2xl text-gray-900 tracking-tight">
                Side Quests (경험 및 경력)
              </h2>
            </div>

            <div className="space-y-4">
              {/* Quest 1: 편의점 */}
              <div className="p-4 border-2 border-[#222222] rounded-xl bg-amber-50/50 hover:bg-amber-50/80 transition-colors flex gap-4">
                <div className="text-3xl flex-shrink-0">🏪</div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-center sm:items-start flex-col sm:flex-row">
                    <span className="font-bold text-sm text-[#222222]">
                      [편의점 근무] CU/GS25 캐셔 마스터
                    </span>
                    <span className="text-[10px] bg-emerald-500 text-white font-semibold font-mono rounded px-1.5 py-0.2">
                      4년 동안 근무
                    </span>
                  </div>
                  <div className="text-xs text-[#222222]/80 leading-relaxed font-sans space-y-1 bg-white/40 p-3 rounded-lg border border-amber-900/10">
                    <div className="font-bold text-[#FF8A3D] mb-1">🏪 주요 축적 역량:</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>고객 응대 및 다각도 타협 소통 지능</li>
                      <li>재고 관리 및 철저한 로직 발주 시스템 관리</li>
                      <li>위기 대면 시 실시간 문제 해결 능력 습득 완료</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quest 2: 메이저맵 */}
              <div className="p-4 border-2 border-[#222222] rounded-xl bg-sky-50/50 hover:bg-sky-50/80 transition-colors flex gap-4">
                <div className="text-3xl flex-shrink-0">🗺️</div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-center sm:items-start flex-col sm:flex-row">
                    <span className="font-bold text-sm text-[#222222]">
                      [메이저맵 크리에이터] 콘텐츠 기획
                    </span>
                    <span className="text-[10px] bg-sky-500 text-white font-semibold font-mono rounded px-1.5 py-0.2">
                      콘텐츠 제작 활동
                    </span>
                  </div>
                  <div className="text-xs text-[#222222]/80 leading-relaxed font-sans space-y-1 bg-white/40 p-3 rounded-lg border border-sky-900/10">
                    <div className="font-bold text-sky-600 mb-1">🗺️ 독자 대상 가치 기획:</div>
                    <p className="mb-1 leading-normal font-medium">사용자의 눈높이와 입장에서 가장 필요한 형태로 정보를 선별, 가공하여 전달하는 능동적인 스토리보드 기획 및 제작 경험 축적</p>
                  </div>
                </div>
              </div>

              {/* Quest 3: AI Creative */}
              <div className="p-4 border-2 border-[#222222] rounded-xl bg-pink-50/50 hover:bg-pink-50/80 transition-colors flex gap-4">
                <div className="text-3xl flex-shrink-0">🤖</div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-center sm:items-start flex-col sm:flex-row">
                    <span className="font-bold text-sm text-[#222222]">
                      [AI Creative] 에이아이 이미지 제작 및 하이테크 디자인
                    </span>
                    <span className="text-[10px] bg-pink-550 bg-pink-500 text-white font-semibold font-mono rounded px-1.5 py-0.2">
                      우수한 생성형 AI 활용능력
                    </span>
                  </div>
                  <div className="text-xs text-[#222222]/80 leading-relaxed font-sans space-y-2 bg-white/40 p-3 rounded-lg border border-pink-900/10">
                    <div className="font-bold text-pink-600 mb-1">🤖 축적 역량 및 프롬프팅 기술:</div>
                    <p className="leading-normal font-medium">
                      생성형 에이아이(AI) 툴과 미드저니/DALL-E 기술을 다루며, 아이디어를 초고화질 아트로 상상 이상으로 신속 정교하게 실체화하는 크리에이티브 시각화 역량을 보유하고 있습니다.
                    </p>
                    <div className="pt-1">
                      <a 
                        href="https://youtube.com/shorts/iSu9VclBLwQ?si=2N7pbq5-tZH9ySZe" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-black px-3.5 py-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-[10px] select-none"
                      >
                        <span>🎬 손예빈 AI 시각화 쇼츠 비디오 보기 🔗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Window>

        {/* 3. KIKOC PROJECT WINDOW (KIKOC_Project.app) */}
        <Window
          windowState={windows.find(w => w.id === 'kikoc-project')!}
          theme={currentTheme}
          onClose={() => closeWindow('kikoc-project')}
          onMinimize={() => minimizeWindow('kikoc-project')}
          onMaximize={() => toggleMaximizeWindow('kikoc-project')}
          onFocus={() => focusWindow('kikoc-project')}
          icon={<Sparkles size={16} className="text-indigo-500" />}
          defaultWidth="max-w-2xl"
          defaultX={220}
          defaultY={120}
        >
          <div className="space-y-5">
            {/* Visual Header */}
            <div className="relative rounded-xl border-2 border-[#222222] h-40 overflow-hidden bg-gradient-to-tr from-orange-400 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white space-y-1 z-10 px-4">
                <h3 className="font-display font-black text-3xl tracking-tighter uppercase">
                  KIKOC BRAND PROJECT
                </h3>
                <p className="font-sans text-xs tracking-wider opacity-95">
                  자체 패션/잡화 라이프스타일 브랜드 아이덴티티 구축 기획
                </p>
              </div>
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            </div>

            {/* Launch Status Loading Bar */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-900 font-display">
                <span>⚡ BRAND INJECTING STATUS</span>
                <span>70% COMPILING...</span>
              </div>
              <div className="h-6 bg-white border-2 border-indigo-900 rounded-md p-0.5 overflow-hidden flex items-center relative">
                {/* Simulated bar text */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-950">
                  기획 90% | 비주얼 BI 디자인 80% | SNS 홍보 구축 40%
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  className="h-full bg-indigo-400 rounded-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 font-sans">
              <h4 className="font-display font-black text-sm text-[#222222] uppercase tracking-wider">
                현재 진행 중인 브랜드 구축 프로젝트
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                MZ 세대에 어필하는 세련된 무드의 자체 캐주얼 브랜드 구축 프로젝트를 설계 및 운영하고 있습니다. 한림대학교 DHA 활동과 결합하여 탁월한 콘텐츠 스토리보드를 제공합니다.
              </p>

              {/* YouTube Native Video Frame */}
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 font-display">
                    <span className="animate-ping rounded-full w-2 h-2 bg-red-500" />
                    <span>🎬 KIKOC BRAND SPOTLIGHT VIDEO</span>
                  </div>
                  <span className="text-[10px] bg-red-500 text-white font-mono rounded px-1.5 py-0.5 uppercase tracking-wider font-extrabold">
                    YOUTUBE
                  </span>
                </div>
                
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-orange-300 shadow-sm bg-neutral-950">
                  <iframe
                    title="KIKOC Showcase YouTube Video"
                    src="https://www.youtube.com/embed/tODir-9uiwI"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-gray-500 leading-tight">
                    프로젝트 브랜딩 홍보 및 핵심 비전의 가이드 영상이 포함되어 있습니다.
                  </span>
                  <a 
                    href="https://youtu.be/tODir-9uiwI?si=UcisOSiq6LHLziIz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-black bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg active:scale-95 transition-transform select-none"
                  >
                    <span>유튜브 직접 보기 🔗</span>
                  </a>
                </div>
              </div>

              {/* Brand Story magical section requested by user */}
              <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 border-2 border-indigo-200 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group text-left">
                {/* Decorative magical aura background */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-300/10 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-300/20 transition-all duration-700" />
                
                <div className="flex items-center justify-between border-b border-indigo-150 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse">🔮</span>
                    <div>
                      <span className="text-[9px] font-bold text-indigo-500 tracking-widest block uppercase font-mono">
                        SECRET BRAND STORY
                      </span>
                      <h4 className="font-sans font-black text-[#2e1065] text-xs sm:text-[13px] tracking-tight">
                        kikoc : 마녀의 비밀 연구실, 당신을 위한 마법의 포션
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full select-none">
                    STORY.log
                  </span>
                </div>

                <div className="bg-[#FAF8FF] border border-purple-100 rounded-xl p-4 space-y-3.5 relative">
                  {/* Pull-quote with larger serif typography style */}
                  <p className="text-center font-semibold text-purple-950 text-xs sm:text-[12.5px] border-b border-purple-50/50 pb-3 leading-normal font-sans italic selection:bg-purple-200">
                    "오늘 당신은 어떤 마법을 걸고 싶나요?" ✨🔮🧪
                  </p>

                  <div className="text-xs text-[#2e1065]/90 space-y-3 font-sans leading-relaxed">
                    <p className="font-medium">
                      깊은 숲속, 시간의 흐름조차 멈춰버린 비밀스러운 곳에 <strong className="text-indigo-700 font-extrabold">'kikoc(키콕)'</strong>의 연구실이 있습니다. 이곳은 세상의 모든 아름다움이 응축된 곳이자, 일상에 지친 이들에게 잊혔던 설렘을 되찾아주는 마녀의 아지트입니다.
                    </p>
                    
                    <p className="font-medium">
                      마녀는 생각했습니다. <span className="bg-purple-100/60 px-1.5 py-0.5 rounded font-black text-purple-800">"세상의 모든 사람은 매일 다른 감정을 느끼는데, 왜 화장은 늘 똑같아야 할까?"</span>
                    </p>

                    <p className="font-medium">
                      그날부터 마녀는 거울 너머 당신의 기분과 날씨, 그리고 그날의 다짐을 담아낼 수 있는 특별한 <strong>'포션(Potion)'</strong>을 만들기 시작했습니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5">
                      <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
                        <span className="text-[10px] bg-red-100 text-red-750 font-extrabold px-1.5 py-0.5 rounded inline-block font-sans mb-1">
                          🧙‍♀️ 대담한 마녀의 날
                        </span>
                        <p className="text-[11px] text-red-950 font-bold leading-normal">
                          깊고 강렬한 색감의 립 포션을. 💄✨
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1">
                        <span className="text-[10px] bg-purple-100 text-purple-750 font-extrabold px-1.5 py-0.5 rounded inline-block font-sans mb-1">
                          👑 우아한 공주의 날
                        </span>
                        <p className="text-[11px] text-purple-950 font-bold leading-normal">
                          투명하고 영롱한 펄이 섞인 베이스 포션을. 💎✨
                        </p>
                      </div>
                    </div>

                    <p className="font-medium pt-1 border-t border-purple-50">
                      kikoc의 제품은 단순한 화장품이 아닙니다. 당신이 아침마다 거울 앞에서 kikoc의 포션을 고르는 시간은, 평범한 일상을 특별한 동화로 바꾸는 <strong className="text-purple-700 font-extrabold">'마법의 의식'</strong>입니다. kikoc은 매일 당신이 원하는 모습으로 자유롭게 변신할 수 있도록, 당신만의 고유한 세계관을 완성해 줄 마법을 처방합니다.
                    </p>
                  </div>

                  <div className="pt-2 text-center border-t border-purple-100/50 mt-1">
                    <span className="inline-block text-[11.5px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-sans">
                      "오늘의 나를 완성할 당신만의 포션, 이제 kikoc에서 찾아보세요." 🔮💜
                    </span>
                  </div>
                </div>
              </div>
              
              <ul className="text-xs text-gray-700 bg-indigo-50/20 p-4 border border-indigo-100 rounded-xl space-y-2 list-disc pl-5">
                <li><strong>브랜드 아이덴티티:</strong> 심볼 디자인 및 로고 타이포 연계 시스템 구축</li>
                <li><strong>콘텐츠 기획:</strong> 스토리 중심의 트렌디 카드뉴스 기획 및 인스타 레이아웃 설계</li>
                <li><strong>SNS 운영 전략:</strong> 자발적인 바이럴 확산을 유인하는 챌린지 및 마케팅 캠페인 기획</li>
                <li><strong>디자인 시스템 구축:</strong> 소장 욕구를 불러일으키는 키치한 패키지 및 디자인 시스템 가이드 확립</li>
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white border border-[#222222]/10 rounded-lg">
                  <span className="block text-xl mb-1">🏷️</span>
                  <span className="font-bold text-xs block text-[#222222]">브랜드 아이덴티티</span>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-1">심볼 개발, 슬로건 수립 및 디자인 톤앤매너 구성</span>
                </div>
                <div className="p-3 bg-white border border-[#222222]/10 rounded-lg">
                  <span className="block text-xl mb-1">📐</span>
                  <span className="font-bold text-xs block text-[#222222]">콘텐츠 디자인</span>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-1">인스타그램 템플릿 제작 및 패키지 레이아웃 기획</span>
                </div>
                <div className="p-3 bg-white border border-[#222222]/10 rounded-lg">
                  <span className="block text-xl mb-1">📢</span>
                  <span className="font-bold text-xs block text-[#222222]">마케터 전략</span>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-1">MZ 세대의 시선을 사로잡을 언택트 챌린지 홍보 아이디어</span>
                </div>
              </div>
            </div>
          </div>
        </Window>

        {/* 4. ACHIEVEMENTS WINDOW (Achievements_unlocked.zip) */}
        <Window
          windowState={windows.find(w => w.id === 'achievements')!}
          theme={currentTheme}
          onClose={() => closeWindow('achievements')}
          onMinimize={() => minimizeWindow('achievements')}
          onMaximize={() => toggleMaximizeWindow('achievements')}
          onFocus={() => focusWindow('achievements')}
          icon={<Trophy size={16} className="text-yellow-500" />}
          defaultWidth="max-w-xl"
          defaultX={280}
          defaultY={130}
        >
          <div className="space-y-6">
            <div className="border-b border-[#222222]/10 pb-2">
              <span className="text-[10px] font-bold text-yellow-600 block font-display tracking-widest uppercase">
                ACHIEVEMENTS UNLOCKED
              </span>
              <h2 className="font-display font-black text-2xl text-gray-900 tracking-tight flex items-center gap-1.5">
                Awards & Achievements (게임 업적창)
              </h2>
            </div>

            {/* Achievement Badges Loop */}
            <div className="space-y-3.5">
              {/* Achievement 1 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-[#222222] rounded-xl bg-[#FFFDF0] flex items-start gap-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400 border border-black flex items-center justify-center text-xl flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-[#222222]">
                      AI 교육포털 공모전 대상
                    </h3>
                    <span className="text-[9px] bg-red-100 text-red-600 font-bold rounded px-1.5 py-0.5">
                      GRAND PRIZE
                    </span>
                  </div>
                  <p className="text-xs text-[#222222]/75 leading-relaxed">
                    창의적인 아이디어를 바탕으로 기획 및 제작을 진행하여 대상을 수상했습니다.
                  </p>
                </div>
              </motion.div>

              {/* Achievement 2 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-[#222222] rounded-xl bg-slate-50 flex items-start gap-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 border border-black flex items-center justify-center text-xl flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-[#222222]">
                      장서표 공모전 우수상
                    </h3>
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-bold rounded px-1.5 py-0.5">
                      EX LIBRIS
                    </span>
                  </div>
                  <p className="text-xs text-[#222222]/75 leading-relaxed">
                    시각적 표현과 스토리텔링을 활용한 작품 제작으로 장서표 대전 우수상을 성취하였습니다.
                  </p>
                </div>
              </motion.div>

              {/* Achievement 3 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-[#222222] rounded-xl bg-orange-50/50 flex items-start gap-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-orange-300 border border-black flex items-center justify-center text-xl flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-[#222222]">
                      포스터 공모전 우수상
                    </h3>
                    <span className="text-[9px] bg-orange-100 text-orange-700 font-bold rounded px-1.5 py-0.5">
                      POSTER DESIGN
                    </span>
                  </div>
                  <p className="text-xs text-[#222222]/75 leading-relaxed">
                    주제를 효과적으로 전달하는 디자인 제작 역량을 입증하여 우수상을 수상했습니다.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Window>


        {/* 6. FUTURE UPDATE WINDOW (FUTURE_UPDATE.exe) */}
        <Window
          windowState={windows.find(w => w.id === 'future-update')!}
          theme={currentTheme}
          onClose={() => closeWindow('future-update')}
          onMinimize={() => minimizeWindow('future-update')}
          onMaximize={() => toggleMaximizeWindow('future-update')}
          onFocus={() => focusWindow('future-update')}
          icon={<RefreshCw size={16} className="text-sky-500" />}
          defaultWidth="max-w-lg"
          defaultX={200}
          defaultY={150}
        >
          <div className="space-y-5 font-sans">
            <div className="border-b border-sky-200 pb-2 flex justify-between items-center bg-sky-50 p-3 rounded-lg border border-sky-100">
              <span className="font-mono text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                SYSTEM UPDATE ENGINE v22.0
              </span>
              <span className="text-[10px] bg-sky-600 text-white font-mono px-1.5 py-0.5 rounded font-bold">
                READY TO COMPILE
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* NEXT VERSION (Target Goal) */}
              <div className="space-y-1.5 bg-[#FFFDF2] border border-amber-200/60 p-5 rounded-xl text-center">
                <span className="text-[10px] font-extrabold text-[#FF8A3D] uppercase tracking-widest block font-mono mb-2">// NEXT UPDATE</span>
                <p className="text-sm font-bold text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                  {`브랜드를 기획하고

디자인으로 표현할 수 있는

마케터가 되기.`}
                </p>
              </div>

              {/* TO DO LIST WITH CHECKBOXES */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#222222] font-display text-xs uppercase tracking-wider block font-mono">// TO DO LIST</h4>
                <div className="space-y-2 pl-1 bg-amber-50/20 border border-amber-100 p-3.5 rounded-xl">
                  {[
                    "더 많은 프로젝트 경험하기",
                    "다양한 브랜드 분석하기",
                    "디자인 역량 강화하기",
                    "기억에 남는 브랜드 만들기",
                    "재미있는 일을 끝까지 해내기"
                  ].map((todo, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={false} 
                        className="w-3.5 h-3.5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 accent-sky-400 cursor-not-allowed pointer-events-none" 
                      />
                      <span className="font-medium text-gray-700">{todo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SYSTEM MESSAGE Terminal */}
              <div className="p-3.5 bg-[#222222] rounded-xl text-emerald-400 font-mono text-xs shadow-md">
                <div className="text-gray-400 font-bold mb-1">// SYSTEM MESSAGE</div>
                <div className="text-white space-y-1 mt-1 border-t border-gray-700 pt-1.5 leading-relaxed">
                  <div>YEBIN OS v22.0</div>
                  <div className="flex items-center gap-1.5">
                    <span>Status :</span>
                    <span className="text-amber-400 animate-pulse font-bold font-mono">Updating...</span>
                  </div>
                  <div className="text-gray-300">Next update coming soon.</div>
                </div>
              </div>
            </div>
          </div>
        </Window>

        {/* 8. LETTER TO PROFESSOR WINDOW (Letter.txt) */}
        <Window
          windowState={windows.find(w => w.id === 'letter')!}
          theme={currentTheme}
          onClose={() => closeWindow('letter')}
          onMinimize={() => minimizeWindow('letter')}
          onMaximize={() => toggleMaximizeWindow('letter')}
          onFocus={() => focusWindow('letter')}
          icon={<Heart size={16} className="text-pink-500 fill-pink-100" />}
          defaultWidth="max-w-2xl"
          defaultX={160}
          defaultY={110}
        >
          <div className="space-y-6 font-sans">
            <div className="border-b border-[#E6DED5]/70 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-pink-500 block font-sans tracking-widest uppercase">
                  GRATITUDE LETTER MEMO
                </span>
                <h2 className="font-sans font-black text-xl text-gray-800 tracking-tight">
                  교수님께 드리는 감사 편지 💌
                </h2>
              </div>
              <span className="text-3xl selection:bg-transparent">🎓</span>
            </div>

            {/* Letter Body Block with warm notebook style */}
            <div className="p-6 sm:p-8 bg-amber-50/40 border border-amber-200/60 rounded-3xl relative overflow-hidden shadow-inner text-left">
              {/* Paper lines decoration background */}
              <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.06]" 
                   style={{ 
                     backgroundImage: 'linear-gradient(#222 1px, transparent 1px)', 
                     backgroundSize: '100% 2.2rem',
                     lineHeight: '2.2rem'
                   }} 
              />

              <div className="relative z-10 space-y-4">
                {/* Salutation */}
                <div className="font-sans font-black text-sm text-gray-800 border-b border-amber-900/10 pb-1 w-fit">
                  친애하는 교수님께,
                </div>

                {/* Letter paragraph 1 */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line font-sans">
                  안녕하세요, 교수님! 
                  
                  처음에 부전공으로 디지털인문예술을 선택해 이 수업을 들었을 시절에는 스스로 너무 위축되어 있었습니다. 주변의 전공자 학생들이나 뛰어난 분들이 다들 너무 완벽해 보이고 저보다 저 멀리 앞서 있는 것 같아 지레 겁이 나고 무척 무서웠습니다. '내가 그들 틈에서 무사히 배움을 이어갈 수 있을까' 하는 걱정에 잔뜩 움츠려 피하고 싶은 마음도 컸습니다.
                </p>

                {/* Letter paragraph 2 */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line font-sans">
                  하지만 그런 주저함의 기로에서 교수님께서 수업 중에 해 주셨던 다정한 말씀 한마디가 제 배움의 방향을 완전히 바꿔 놓았습니다. 
                  
                  <strong>"주변에 잘하는 사람들이 많다면 두려워하는 대신, 기쁘게 그들 옆으로 다가가서 편하게 하나씩 하나씩 나만의 꿀팁을 전수받고 차근차근 배워나가면 된다"</strong>고 말씀해 주셨던 것입니다.
                  
                  눈앞의 높은 산처럼 여겨지던 난제들을 그저 귀중한 ‘배움의 친구이자 선생님’으로 바라보고, 한 번에 하나씩 팁을 습득해 가며 용기 있게 부딪히라는 말씀은 막막했던 제 전진의 열쇠가 되었습니다.
                </p>

                {/* Letter paragraph 3 */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line font-sans">
                  그 가르침을 마음에 품고 적극적으로 실천했습니다. 두려움을 떨친 채 뛰어난 동료들 곁에서 가르침을 구하고 저만의 지평을 채워나간 결과, 어느 순간 고개를 들어보니 믿기 힘든 꿈만 같은 풍경을 대면할 수 있었습니다. 
                  
                  예전에는 제가 멀리서 경외하며 올려다보기만 했던 그 뛰어난 사람들과 어느새 어깨를 대등하게 나란히 하고, 함께 배움을 넓히며 이토록 자부심 가득한 가상 OS 포트폴리오 프로젝트까지 성취해 난 저 자신을 마주하게 되었습니다!
                </p>

                {/* Letter paragraph 4 */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line font-sans">
                  만약 그 순간, 저를 따뜻하게 구해주고 성장 불꽃을 당겨 준 교수님의 말씀이 없었더라면 저는 혼자 지레 절망해 이미 진작 어딘가로 멀리 도망쳤을지도 모릅니다. 낙오와 중도 탈락 대신 끝내 완주하여 놀라운 배움을 깨우치고 여기까지 성장하며 도달하게 해 주셔서 마음 깊이 고맙습니다.
                </p>

                {/* Future orientation section */}
                <div className="bg-white/70 border border-pink-200/50 rounded-2xl p-4 mt-6 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-500 uppercase tracking-wider mb-1.5">
                    <Sparkles size={12} className="animate-spin text-amber-500" />
                    <span>배움의 미래를 향한 포부</span>
                  </div>
                  <p className="text-xs font-black text-gray-800 leading-relaxed font-sans">
                    "교수님이 심어 주신 ‘배움의 지혜와 다가가는 용기’를 평생의 모토로 삼고, 앞으로 마주할 어떠한 험난한 도전 앞에서도 절대 도망치거나 피하지 않겠습니다. 늘 배움의 자세로 당당히 돌파하며, 끝없이 더 높은 곳을 향해 멀리 전진해 나아가겠습니다!" 💪💥✨
                  </p>
                </div>

                {/* Signature */}
                <div className="text-right font-sans font-bold text-xs text-gray-700 pt-4 border-t border-amber-900/10 mt-6 flex justify-end items-center gap-1">
                  <span>제자</span>
                  <span className="text-sm font-black text-gray-900 bg-amber-200/30 px-2 py-0.5 rounded border border-amber-200">손예빈</span>
                  <span>올림 🙇‍♀️</span>
                </div>
              </div>
            </div>

            {/* Micro interaction button */}
            <div className="flex justify-center pt-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  alert('💌 진심이 가득 실린 손예빈 학생의 포부 엽서가 마음으로 전해졌습니다! "앞으로 더 굳건하게 나아가겠습니다!"');
                  focusWindow('letter');
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-sans font-black text-xs rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/20 select-none"
              >
                <span>앞으로 계속 나아가겠습니다! 🏃‍♀️🔥</span>
              </motion.button>
            </div>
          </div>
        </Window>

        {/* 7. GUESTBOOK WINDOW (Guestbook.exe) */}
        <Window
          windowState={windows.find(w => w.id === 'guestbook')!}
          theme={currentTheme}
          onClose={() => closeWindow('guestbook')}
          onMinimize={() => minimizeWindow('guestbook')}
          onMaximize={() => toggleMaximizeWindow('guestbook')}
          onFocus={() => focusWindow('guestbook')}
          icon={<FileText size={16} className="text-amber-500" />}
          defaultWidth="max-w-xl"
          defaultX={120}
          defaultY={140}
        >
          <div className="space-y-5">
            <div className="border-b border-[#E6DED5]/70 pb-3">
              <span className="text-[10px] font-bold text-[#FF8A3D] block font-sans tracking-widest uppercase">
                GUESTBOOK UTILITY
              </span>
              <h2 className="font-sans font-black text-xl text-gray-800 tracking-tight">
                격려와 응원의 한마디 (방명록)
              </h2>
            </div>

            {/* Note entry form */}
            <form onSubmit={handleAddGuestMessage} className="p-5 border border-[#E6DED5] bg-[#FFFDF9] rounded-2xl space-y-3.5 shadow-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block uppercase font-sans mb-1 tracking-wide">
                    방문자 닉네임 (Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="교수님 / 이름 / 별명"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E6DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/25 focus:border-[#FF8A3D] text-gray-700 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block uppercase font-sans mb-1 tracking-wide">
                    대표 이모지
                  </label>
                  <select
                    value={newGuestEmoji}
                    onChange={(e) => setNewGuestEmoji(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-white border border-[#E6DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/25 focus:border-[#FF8A3D] text-gray-700 font-bold cursor-pointer transition-all font-sans"
                  >
                    <option value="🧡">🧡 오렌지</option>
                    <option value="🎓">🎓 교수님</option>
                    <option value="💯">💯 A플러스</option>
                    <option value="🔥">🔥 화이팅</option>
                    <option value="⭐">⭐ 스타</option>
                    <option value="🌿">🌿 새싹</option>
                    <option value="💻">💻 코딩</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 block uppercase font-sans mb-1 tracking-wide">
                  응원 메시지 (Message)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newGuestMessage}
                  onChange={(e) => setNewGuestMessage(e.target.value)}
                  placeholder="예빈님! 이번 한림대 과제물이 진짜 끝내주게 참신하네요! 멋진 학점 대박 나기를 기원합니다!"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/25 focus:border-[#FF8A3D] text-gray-700 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF8A3D] hover:bg-[#e0742f] text-white font-sans font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow"
              >
                <Send size={12} />
                <span>방명록 한 줄 남기기</span>
              </button>
            </form>

            {/* List entries scroll */}
            <div className="space-y-2.5 max-h-[25vh] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase font-sans tracking-wide">
                게시된 응원 후기 ({guestEntries.length}개)
              </span>

              {guestEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 bg-white border border-[#E6DED5]/80 hover:border-orange-200 rounded-xl text-xs space-y-1.5 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5 bg-orange-50/50 px-2 py-0.5 rounded-lg text-[10.5px] border border-orange-100">
                      <span>{entry.emoji}</span>
                      {entry.name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono font-medium">{entry.createdAt}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed pl-1 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Window>

        {/* VALUES WINDOW (MY_VALUES.exe) */}
        <Window
          windowState={windows.find(w => w.id === 'values')!}
          theme={currentTheme}
          onClose={() => closeWindow('values')}
          onMinimize={() => minimizeWindow('values')}
          onMaximize={() => toggleMaximizeWindow('values')}
          onFocus={() => focusWindow('values')}
          icon={<span className="text-sm select-none">🌷</span>}
          defaultWidth="max-w-2xl"
          defaultX={160}
          defaultY={100}
        >
          <div className="space-y-6 font-sans">
            <div className="border-b border-[#E6DED5]/70 pb-3 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold text-pink-500 block font-sans tracking-widest uppercase">
                  CORE PRINCIPLES & PHILOSOPHY
                </span>
                <h2 className="font-sans font-black text-xl text-gray-800 tracking-tight">
                  예빈이의 철학과 핵심 가치 🌷
                </h2>
              </div>
              <span className="text-3xl selection:bg-transparent">🧡</span>
            </div>

            <p className="text-xs text-gray-500 text-left leading-relaxed">
              기획안을 정교하게 다듬는 경영학도이자, 아이디어를 실탄 삼아 손수 멋진 디바이스를 빚어내는 크리에이터로서 절대 타협하지 않고 가슴에 품어 온 4가지 불꽃입니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Value 1: 실행 */}
              <div className="p-4 bg-orange-50/40 border border-orange-200/50 rounded-2xl text-left space-y-2 hover:bg-orange-50/70 transition-colors shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏃‍♀️</span>
                  <span className="font-extrabold text-sm text-[13px] text-orange-950 font-sans">🧡 실행 (Action & Doer)</span>
                </div>
                <div className="text-[11px] font-bold text-orange-600">"생각만 하는 사람이 아니라 직접 해보는 사람"</div>
                <p className="text-[11px] text-gray-600 leading-normal font-sans font-medium">
                  아무리 멋진 아이디어도 머릿속에만 머문다면 가치가 결코 빛나지 않습니다. 손가락을 움직여 즉시 코딩하고, 실패하더라도 빠르게 실체를 구현하여 해답을 주저 없이 찾아냅니다.
                </p>
              </div>

              {/* Value 2: 성장 */}
              <div className="p-4 bg-pink-50/40 border border-pink-200/50 rounded-2xl text-left space-y-2 hover:bg-pink-50/70 transition-colors shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  <span className="font-extrabold text-sm text-[13px] text-pink-950 font-sans">🧡 성장 (Growth & Iteration)</span>
                </div>
                <div className="text-[11px] font-bold text-pink-600">"결과보다 과정에서 배우는 굳건한 경험"</div>
                <p className="text-[11px] text-gray-600 leading-normal font-sans font-medium">
                  단순한 성공만이 성장은 아닙니다. 막다른 길에 부딪혀 씨름했던 수많은 디버깅 과정, 깨진 시안을 고치면서 얻어낸 소중한 오답 노트가 저를 단단하게 만드는 핵심 연료입니다.
                </p>
              </div>

              {/* Value 3: 기록 */}
              <div className="p-4 bg-blue-50/40 border border-blue-200/50 rounded-2xl text-left space-y-2 hover:bg-blue-50/70 transition-colors shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✍</span>
                  <span className="font-extrabold text-sm text-[13px] text-blue-950 font-sans">🧡 기록 (Documentation & Trail)</span>
                </div>
                <div className="text-[11px] font-bold text-blue-600">"아이디어와 찰나의 순간을 영구히 남기는 것"</div>
                <p className="text-[11px] text-gray-600 leading-normal font-sans font-medium">
                  흐려지는 생각들을 영구적 기록으로 포착합니다. 꾸준하게 작성한 전공 탐구글, 블로그 회고 및 포트폴리오는 수면 위로 올라오는 또다른 도전을 헤쳐나갈 찬란한 나침반입니다.
                </p>
              </div>

              {/* Value 4: 사람 */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-200/50 rounded-2xl text-left space-y-2 hover:bg-emerald-50/70 transition-colors shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  <span className="font-extrabold text-sm text-[13px] text-emerald-950 font-sans">🧡 사람 (Branding & Connection)</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-600">"브랜드도 결국 사람과 사림을 연결하는 것"</div>
                <p className="text-[11px] text-gray-600 leading-normal font-sans font-medium">
                  브랜딩과 마케팅의 본질은 진심에서 우러나오는 다정한 대화입니다. 소비자의 숨은 필요를 민감하게 관찰하고, 마음을 어루만져 주는 따스함을 브랜드 심볼 속에 정성껏 담아냅니다.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <button 
                onClick={() => closeWindow('values')}
                className="px-6 py-2.5 bg-[#222222] hover:bg-gray-800 text-[#FFF9F3] font-bold text-[11px] tracking-wide rounded-xl shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 font-sans"
              >
                <span>가치 확인 완료 🙋‍♀️</span>
              </button>
            </div>
          </div>
        </Window>

        {/* INVENTORY WINDOW (INVENTORY.exe) */}
        <Window
          windowState={windows.find(w => w.id === 'inventory')!}
          theme={currentTheme}
          onClose={() => closeWindow('inventory')}
          onMinimize={() => minimizeWindow('inventory')}
          onMaximize={() => toggleMaximizeWindow('inventory')}
          onFocus={() => focusWindow('inventory')}
          icon={<span className="text-sm select-none">🎒</span>}
          defaultWidth="max-w-2xl"
          defaultX={180}
          defaultY={130}
        >
          <div className="space-y-5 font-sans">
            <div className="border-b border-[#E6DED5]/70 pb-3 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold text-[#FF8A3D] block font-sans tracking-widest uppercase">
                  GAME STATUS & ITEMS INVENTORY
                </span>
                <h2 className="font-sans font-black text-xl text-gray-800 tracking-tight">
                  예빈이의 보유 역량 인벤토리 🎒
                </h2>
              </div>
              <span className="text-xs bg-[#FF8A3D] text-white font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                LEVEL MAX
              </span>
            </div>

            <p className="text-xs text-gray-500 text-left">
              슬롯에서 아이템을 클릭해 상세 능력치 버프와 획득한 보물 아이템의 맛보기 가이드를 확인해보세요!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
              {/* Left Side: 3x3 Slots Grid */}
              <div className="md:col-span-12 lg:col-span-7 space-y-3">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block font-mono">
                  🎒 BACKPACK SLOTS (아이템 가방)
                </span>
                
                <div className="grid grid-cols-4 gap-2.5 p-4 bg-gray-100/60 border border-[#E6DED5] rounded-2xl shadow-inner">
                  {[
                    { id: 'business', name: '경영학 지식', emoji: '📖', tier: 'RARE' },
                    { id: 'design', name: '디자인 감각', emoji: '🎨', tier: 'EPIC' },
                    { id: 'notebook', name: '아이디어 노트', emoji: '💡', tier: 'RARE' },
                    { id: 'caffeine', name: '아이스 카페인', emoji: '☕', tier: 'COMMON' },
                    { id: 'content', name: '콘텐츠 제작 경험', emoji: '📱', tier: 'LEGENDARY' },
                    { id: 'awards', name: '공모전 경험', emoji: '🏆', tier: 'LEGENDARY' },
                    { id: 'spirit', name: '불굴 도전정신', emoji: '✨', tier: 'UNIQUE' }
                  ].map((item) => {
                    const isSelected = selectedInventoryId === item.id;
                    let tierColor = 'border-gray-300';
                    if (item.tier === 'EPIC') tierColor = 'border-purple-300 bg-purple-50/20';
                    if (item.tier === 'RARE') tierColor = 'border-blue-300 bg-blue-50/20';
                    if (item.tier === 'LEGENDARY') tierColor = 'border-orange-300 bg-orange-50/20';
                    if (item.tier === 'UNIQUE') tierColor = 'border-amber-300 bg-amber-50/20';

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedInventoryId(item.id)}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-200 select-none ${
                          isSelected 
                            ? 'ring-4 ring-orange-400 border-orange-500 scale-105 bg-white shadow-md' 
                            : 'hover:border-amber-400 hover:bg-white border-dashed bg-white/40'
                        } ${tierColor}`}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform filter drop-shadow">
                          {item.emoji}
                        </span>
                        <span className="text-[8px] font-mono font-black text-gray-400/80 mt-1 uppercase text-center block max-w-[55px] truncate">
                          {item.name}
                        </span>
                        
                        {/* Rarity Micro Indicator Dot */}
                        <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                          item.tier === 'LEGENDARY' ? 'bg-orange-500' :
                          item.tier === 'EPIC' ? 'bg-purple-500' :
                          item.tier === 'RARE' ? 'bg-blue-500' :
                          item.tier === 'UNIQUE' ? 'bg-amber-500' : 'bg-gray-400'
                        }`} />
                      </button>
                    );
                  })}

                  {/* Empty Slots to complete retro bento style */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={`empty-${i}`}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/30 flex items-center justify-center select-none text-gray-300 font-mono text-[10px]"
                    >
                      🔒 LOCK
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-indigo-50/40 border border-indigo-150 rounded-xl text-[10.5px] text-indigo-950 font-medium font-sans">
                  💡 <strong>포폴평가 꿀요소:</strong> 예빈이의 인벤토리는 편의점 4년의 탄탄한 기본기에 한림대 경영 정보 및 디지털아트 수업 등을 통해 융합된 실전 마스터 세트를 뜻합니다.
                </div>
              </div>

              {/* Right Side: Detailed Stats Descriptor Inspect Panel */}
              <div className="md:col-span-12 lg:col-span-5 space-y-3">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block font-mono">
                  🔍 ITEM HOVER INSPECT (세부 능력치)
                </span>

                {(() => {
                  const items = [
                    {
                      id: 'business',
                      name: '경영학 지식',
                      emoji: '📖',
                      rarity: 'RARE (희귀 보물)',
                      rarityColor: 'text-blue-600 bg-blue-50 border-blue-100',
                      stats: [
                        { label: '기획 분석력', val: '+45' },
                        { label: '프로젝트 조율', val: '+50' },
                        { label: '시장 기획 구조화', val: '+65' }
                      ],
                      flavor: '한림대학교 경영학과 핵심 전공을 수학하면서 연마한 전략적 프레임워크와 비즈니스 분석 툴 기획 능력입니다.'
                    },
                    {
                      id: 'design',
                      name: '디자인 감각',
                      emoji: '🎨',
                      rarity: 'EPIC (특급 시각화)',
                      rarityColor: 'text-purple-600 bg-purple-50 border-purple-100',
                      stats: [
                        { label: '시각 미려함/레이아웃', val: '+80' },
                        { label: '브랜드 디자인 통합', val: '+65' },
                        { label: '컴포넌트 조화도', val: '+85' }
                      ],
                      flavor: '사용자의 사용 경험을 정교하게 분석한 후, 시선을 한 눈에 잡아끄는 환상적인 색채 밸런스와 레트로 감성 테이프 디자인으로 뽑아내는 능력.'
                    },
                    {
                      id: 'notebook',
                      name: '아이디어 노트',
                      emoji: '💡',
                      rarity: 'RARE (상상 도구)',
                      rarityColor: 'text-blue-600 bg-blue-50 border-blue-100',
                      stats: [
                        { label: '기획 상상력', val: '+95' },
                        { label: '스토리텔링 구체화', val: '+75' }
                      ],
                      flavor: '길을 걷다가 문득 번뜩인 참신한 브랜드 실뜨기 및 마케팅 시나리오를 고이 응집하여 적어 둔 오리지널 리소스 카드.'
                    },
                    {
                      id: 'caffeine',
                      name: '카페인 부스터',
                      emoji: '☕',
                      rarity: 'COMMON (소모성 묘약)',
                      rarityColor: 'text-gray-600 bg-gray-100 border-gray-200',
                      stats: [
                        { label: '밤샘 집중 지속력', val: '+120' },
                        { label: '디버깅 대응 속도', val: '+40' }
                      ],
                      flavor: '디자이너의 끊겨버린 집중을 부활시켜 주며 온 새벽 내내 화려한 속도로 포트폴리오 기틀을 밤새 닦게 보조해준 고마운 카페인 각성제.'
                    },
                    {
                      id: 'content',
                      name: '콘텐츠 제작 경험',
                      emoji: '📱',
                      rarity: 'LEGENDARY (전설급 유물)',
                      rarityColor: 'text-orange-600 bg-orange-50 border-orange-100',
                      stats: [
                        { label: '영상 시나리오 구성', val: '+85' },
                        { label: 'MZ 세대 공감 유도', val: '+90' },
                        { label: 'DHA 미디어 크리틱', val: '+95' }
                      ],
                      flavor: '디지털인문예술 전공의 적극적인 프로젝트 주도로 생성된 숏크리트 및 바이럴 크리에이티브 시각 자산을 자유자재로 다루며 다져진 최정상급 경험치.'
                    },
                    {
                      id: 'awards',
                      name: '공모전 경험의 증표',
                      emoji: '🏆',
                      rarity: 'LEGENDARY (전설적 업적)',
                      rarityColor: 'text-orange-600 bg-orange-50 border-orange-100',
                      stats: [
                        { label: '실전 기획 경쟁력', val: '+200' },
                        { label: '전략 구조 도출', val: '+85' },
                        { label: '클라이언트 조화', val: '+70' }
                      ],
                      flavor: '편의점 4년의 현실 장사 데이터 짬에서 발원한 세련된 전략과 기틀을 토대로 전국 경제 마케팅 공모전 대상의 명예를 달성한 보물급 훈장.'
                    },
                    {
                      id: 'spirit',
                      name: '도전 정신 버프',
                      emoji: '✨',
                      rarity: 'UNIQUE (마스터 버프)',
                      rarityColor: 'text-amber-700 bg-amber-50 border-amber-200/50',
                      stats: [
                        { label: '추진 실행 속도', val: '+150' },
                        { label: '오답 수렴 & 회복 탄성', val: 'MAX' },
                        { label: '교수님 애정도 수치', val: '+999' }
                      ],
                      flavor: '실망이나 좌절에 후퇴하거나 숨지 않고, 매번 즐기는 마음으로 부딪혀 기어코 한 단계를 무사히 성장시켜 내고 마는 자립형 파워 아이템.'
                    }
                  ];

                  const activeItem = items.find(x => x.id === selectedInventoryId) || items[0];

                  return (
                    <div className="p-4 bg-white border border-[#E6DED5] rounded-2xl shadow-sm space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow">{activeItem.emoji}</span>
                        <div>
                          <div className="font-extrabold text-sm text-[13px] text-gray-800">{activeItem.name}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 uppercase tracking-wider font-mono ${activeItem.rarityColor}`}>
                            {activeItem.rarity}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wide font-mono">STA MODIFIERS (보유 버프)</span>
                        <div className="space-y-1 text-[11px] font-bold text-gray-700 font-mono">
                          {activeItem.stats.map((st, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                              <span>📊 {st.label}</span>
                              <span className="text-emerald-600 font-extrabold">{st.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-[#FFFDF7] border border-[#FBEED7] rounded-xl text-[10.5px] leading-relaxed text-yellow-950 font-medium font-sans">
                        📣 <strong>아이템 설명:</strong> {activeItem.flavor}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="text-center pt-1 border-t border-[#E6DED5]/60">
              <button 
                onClick={() => closeWindow('inventory')}
                className="px-5 py-2 bg-neutral-900 hover:bg-[#222222] text-[#FFF9F3] font-bold text-[10px] tracking-wide rounded-xl shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 font-sans"
              >
                <span>인벤토리 백팩 닫기 🎒</span>
              </button>
            </div>
          </div>
        </Window>

        {/* START MENU POPUP BACKDROP */}
        {isStartMenuOpen && (
          <div 
            className="fixed inset-0 z-[99998]" 
            onClick={() => setIsStartMenuOpen(false)} 
          />
        )}

        {/* MACBOOK APPLE-STYLE START POPUP */}
        <AnimatePresence>
          {isStartMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-14 left-6 w-64 bg-white/95 backdrop-blur-md border border-[#E6DED5] rounded-2xl shadow-2xl p-2.5 z-[99999] font-sans"
            >
              {/* Header / Brand info */}
              <div className="px-3.5 py-2.5 border-b border-[#E6DED5]/60 flex items-center gap-2.5">
                <span className="text-xl">🍏</span>
                <div className="text-left">
                  <div className="text-xs font-black text-gray-800">Yebin OS Menu</div>
                  <div className="text-[10px] font-bold text-gray-400 font-mono">MACBOOK PRO SILICON</div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1.5 space-y-0.5 text-xs text-left">
                {/* About This Mac / Readme */}
                <button
                  type="button"
                  onClick={() => {
                    openWindow('tutorial');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left font-semibold text-gray-700 hover:bg-amber-500/10 hover:text-amber-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">💻</span>
                  <span>이 Mac에 관하여 (About)</span>
                </button>

                {/* All System apps list */}
                <div className="px-3 py-1 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mt-1.5 mb-1">
                  기능 바로가기
                </div>

                <div className="px-2">
                  <button
                    type="button"
                    onClick={() => { openWindow('profile'); setIsStartMenuOpen(false); }}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-neutral-200 hover:border-amber-300 rounded-xl font-bold text-xs text-gray-700 hover:text-amber-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>👤 손예빈 프로필 바로가기</span>
                  </button>
                </div>

                {/* Quick Themes */}
                <div className="px-3 py-1 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mt-1.5 mb-1">
                  테마 간편 변경
                </div>

                <div className="flex items-center gap-2 px-3 py-1">
                  {ALL_THEMES.map(themeOption => (
                    <button
                      key={themeOption.id}
                      type="button"
                      onClick={() => {
                        setCurrentThemeId(themeOption.id);
                        setIsStartMenuOpen(false);
                      }}
                      className={`w-6 h-6 rounded-full border transition-all relative transform flex items-center justify-center cursor-pointer ${
                        currentThemeId === themeOption.id ? 'scale-110 border-gray-800 shadow-md ring-2 ring-amber-300' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: themeOption.accentColor }}
                      title={themeOption.name}
                    >
                      {currentThemeId === themeOption.id && <span className="text-[10px] text-white">✓</span>}
                    </button>
                  ))}
                </div>

                <hr className="my-2 border-gray-200" />

                {/* MAC POWER CONTROLS */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStartMenuOpen(false);
                      setPowerMode('sleep');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg text-left hover:bg-indigo-50 hover:text-indigo-650 font-bold transition-colors flex items-center gap-2.5 cursor-pointer text-gray-700"
                  >
                    <Moon size={13} className="text-indigo-500" />
                    <span>잠자기 (Sleep Mode)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full px-3 py-1.5 rounded-lg text-left hover:bg-sky-50 hover:text-sky-650 font-bold transition-colors flex items-center gap-2.5 cursor-pointer text-gray-700"
                  >
                    <RotateCcw size={13} className="text-sky-500" />
                    <span>재시작 (Restart...)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsStartMenuOpen(false);
                      setPowerMode('shutdown');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg text-left hover:bg-red-50 hover:text-red-650 font-extrabold transition-colors flex items-center gap-2.5 cursor-pointer text-red-600"
                  >
                    <Power size={13} className="text-red-500" />
                    <span>시스템 종료 (Shut Down...)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MACBOOK POWER OVERLAYS */}
        <AnimatePresence>
          {powerMode === 'sleep' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPowerMode('normal')}
              className="fixed inset-0 bg-neutral-950/95 backdrop-blur-sm z-[999999] flex flex-col items-center justify-center text-white cursor-pointer select-none font-sans"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="flex flex-col items-center gap-4 text-center px-6"
              >
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/30 text-indigo-400">
                  <Moon size={32} className="fill-indigo-400" />
                </div>
                <h2 className="text-lg font-black tracking-tight text-neutral-200">잠자기 모드가 활성화되었습니다</h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
                  맥북이 잠의 세계로 빠져들었습니다.<br />
                  아무 곳이나 한 번 클릭하면 손예빈 OS 데스크탑으로 복귀합니다.
                </p>
                <span className="text-[10px] font-bold px-3 py-1 bg-white/10 rounded-full border border-white/5 font-mono text-gray-500 mt-2">
                  CLICK ANYWHERE TO WAKE UP
                </span>
              </motion.div>
            </motion.div>
          )}

          {powerMode === 'restart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#161616] z-[999999] flex flex-col items-center justify-center text-white select-none font-sans"
            >
              <div className="flex flex-col items-center gap-6 max-w-xs w-full px-6 text-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] block"
                >
                  🍏
                </motion.span>
                
                <div className="w-full space-y-2.5 mt-2">
                  <div className="flex justify-between text-[9px] font-mono text-gray-400 font-bold">
                    <span>SYSTEM REBOOTING...</span>
                    <span>{rebootProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/30">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100" 
                      style={{ width: `${rebootProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-tight block">
                    가상 메모리 수집 및 OS 커널 리로드 중...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {powerMode === 'shutdown' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[999999] flex flex-col items-center justify-center text-white select-none font-sans"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-5 max-w-sm text-center px-6"
              >
                <div className="p-4 bg-red-500/10 rounded-full border border-red-550/20 text-red-500">
                  <Power size={28} />
                </div>
                
                <h3 className="text-md font-black tracking-tight text-neutral-300">시스템이 수동으로 종료되었습니다</h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
                  손예빈 포트폴리오 OS를 방문해 주셔서 감사합니다.<br />
                  다시 기동하려면 본체의 구동 버튼을 눌러 부팅 프로세스를 실행하여 주십시오.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPowerMode('normal');
                    setWindows(prev => prev.map(w => w.id === 'tutorial' ? { ...w, isOpen: true, isMinimized: false } : { ...w, isOpen: false }));
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all border border-amber-300"
                >
                  <Power size={13} className="stroke-[2.5]" />
                  <span>Apple Silicon 본체 수동 켜기 (Power On)</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SYSTEM TASKBAR */}
      <Taskbar
        theme={currentTheme}
        allThemes={ALL_THEMES}
        currentThemeId={currentThemeId}
        onThemeChange={(id) => setCurrentThemeId(id)}
        windows={windows}
        onToggleWindow={toggleWindowFromTaskbar}
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        isCrtOn={crtFilterOn}
        onToggleCrt={() => setCrtFilterOn(!crtFilterOn)}
      />
    </div>
  );
}
