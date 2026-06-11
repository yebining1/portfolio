import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Minus, Square, X, RotateCcw } from 'lucide-react';
import { WindowState, ThemeConfig } from '../types';

interface WindowProps {
  windowState: WindowState;
  theme: ThemeConfig;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultWidth?: string;
  defaultHeight?: string;
  defaultX?: number;
  defaultY?: number;
}

export default function Window({
  windowState,
  theme,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
  icon,
  defaultWidth = 'max-w-2xl',
  defaultHeight = 'h-auto max-h-[75vh]',
  defaultX = 40,
  defaultY = 80,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  // Handles double click on headers to toggle maximized state
  const handleHeaderDoubleClick = () => {
    onMaximize();
  };

  return (
    <motion.div
      ref={windowRef}
      initial={
        windowState.isMaximized
          ? { x: 0, y: 0, width: '100%', height: 'calc(100vh - 80px)' }
          : { scale: 0.95, opacity: 0 }
      }
      animate={{
        scale: 1,
        opacity: 1,
        zIndex: windowState.zIndex,
        ...(windowState.isMaximized
          ? {
              x: 0,
              y: 0,
              width: '100%',
              height: 'calc(100vh - 80px)', // leave space for top bar (32px) and taskbar (48px)
              transition: { type: 'spring', damping: 25, stiffness: 300 },
            }
          : {
              width: 'auto',
              height: 'auto',
              transition: { type: 'spring', damping: 20, stiffness: 250 },
            }),
      }}
      drag={!windowState.isMaximized}
      dragMomentum={false}
      dragElastic={0.1}
      onPointerDown={onFocus}
      className={`absolute ${
        windowState.isMaximized
          ? 'rounded-none border-0'
          : `rounded-2xl border border-[#E6DED5] ${defaultWidth} ${defaultHeight}`
      } flex flex-col overflow-hidden bg-white/95 backdrop-blur-md shadow-2xl transition-all duration-150`}
      style={{
        left: windowState.isMaximized ? '0px' : `${defaultX}px`,
        top: windowState.isMaximized ? '32px' : `${defaultY}px`,
        boxShadow: windowState.isMaximized
          ? 'none'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(230, 222, 213, 0.5)',
      }}
    >
      {/* WINDOW HEADER */}
      <div
        onDoubleClick={handleHeaderDoubleClick}
        className="flex items-center justify-between h-10 px-4 border-b border-[#E6DED5] cursor-move select-none"
        style={{
          backgroundColor: '#F1EDE9',
          color: '#555555',
        }}
      >
        <div className="flex items-center gap-3">
          {/* macOS-style colored dots */}
          <div className="flex gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:brightness-90 transition-all flex items-center justify-center text-[8px] text-red-900 font-bold opacity-80 hover:opacity-100 cursor-pointer"
              title="Close"
            >
              ×
            </button>
            <button
              onClick={onMinimize}
              className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] hover:brightness-90 transition-all flex items-center justify-center text-[8px] text-amber-900 font-bold opacity-80 hover:opacity-100 cursor-pointer"
              title="Minimize"
            >
              -
            </button>
            <button
              onClick={onMaximize}
              className="w-3.5 h-3.5 rounded-full bg-[#27C93F] hover:brightness-90 transition-all flex items-center justify-center text-[8px] text-green-900 font-bold opacity-80 hover:opacity-100 cursor-pointer"
              title="Maximize"
            >
              +
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E6DED5] ml-1.5" />

          {/* Window icon & title */}
          <div className="flex items-center gap-2 pl-0.5">
            <span className="flex-shrink-0 opacity-70 scale-90">{icon}</span>
            <span className="font-sans font-bold tracking-tight text-xs text-gray-700">
              {windowState.title}
            </span>
          </div>
        </div>

        {/* Decorative Status Tag */}
        <div className="text-[10px] font-sans font-semibold text-gray-400 tracking-wider">
          ACTIVE PROCESS
        </div>
      </div>

      {/* WINDOW CONTENT */}
      <div
        className="flex-1 overflow-y-auto p-6 md:p-8 bg-white font-sans text-[#222222] scrollbar-thin scrollbar-thumb-gray-200"
        onPointerDown={(e) => e.stopPropagation()} // Stop drag propagation when scrolling/clicking content
      >
        {children}
      </div>
    </motion.div>
  );
}
