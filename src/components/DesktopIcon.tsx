import React from 'react';
import { motion } from 'motion/react';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass?: string;
}

export default function DesktopIcon({
  id,
  title,
  icon,
  onClick,
  colorClass = 'bg-white',
}: DesktopIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onDoubleClick={onClick}
      className="flex flex-col items-center justify-center p-2.5 rounded-2xl cursor-pointer select-none w-22 text-center group transition-all"
    >
      {/* Icon frame */}
      <div
        className={`w-14 h-14 rounded-2xl border border-[#E6DED5] flex items-center justify-center bg-white shadow-sm group-hover:shadow-md group-hover:border-amber-300 group-hover:bg-amber-50/20 transition-all duration-300`}
      >
        <div className="text-gray-700 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      </div>

      {/* Label */}
      <span className="mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-white/70 backdrop-blur-md border border-[#E6DED5]/60 text-gray-700 font-sans select-none block max-w-full truncate shadow-sm group-hover:bg-white group-hover:text-gray-900 group-hover:border-amber-400/30 transition-all">
        {title}
      </span>
    </motion.div>
  );
}
