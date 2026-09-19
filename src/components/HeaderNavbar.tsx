import React from 'react';
import { ShieldCheck, Smartphone, Monitor, KeyRound, LogIn, Database, LogOut, ArrowLeft } from 'lucide-react';
import { SkillSwapLogo } from './SkillSwapLogo';
import { User } from '../types';

interface HeaderNavbarProps {
  user: User | null;
  onOpenVault: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  user,
  onOpenVault,
  onOpenAuth,
  onLogout,
  isMobileFrame,
  onToggleFrame,
  canGoBack = false,
  onGoBack,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onGoBack && (
            <button
              id="top-nav-back-btn"
              onClick={onGoBack}
              disabled={!canGoBack}
              className={`p-2 rounded-xl border transition flex items-center justify-center ${
                canGoBack
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs cursor-pointer active:scale-95'
                  : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
              }`}
              title={canGoBack ? 'Go back' : 'Already at Home'}
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <SkillSwapLogo size="sm" showSubtitle={false} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                SKILL SWAP
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                JWT + AES-256
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:block">
              Learn by Teaching • Secure Database System
            </span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Frame View Toggle */}
          <button
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Frame Mockup'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Full Screen View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Mobile Frame View</span>
              </>
            )}
          </button>

          {/* Security Vault Inspector Button */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
            title="Inspect live AES-256 ciphertexts & JWT sessions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security Vault</span>
          </button>

          {/* User Session Info / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.photo}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-indigo-200 shadow-xs"
              />
              <span className="text-xs font-bold text-slate-800 hidden md:inline truncate max-w-[120px]">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
