import { Droplets } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-3 p-3 rtl:space-x-reverse group"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-200">
          <Droplets className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="self-center text-2xl font-bold whitespace-nowrap">
          Blood Bank
        </span>
        <span className="text-xs text-red-100 -mt-1 opacity-80">
          Save Lives
        </span>
      </div>
    </Link>
  );
}
