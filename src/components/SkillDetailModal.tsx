import React, { useState } from 'react';
import { X, Heart, Star, Check, MessageSquare, Calendar, ShieldCheck, ArrowLeft, Building } from 'lucide-react';
import { Skill, User } from '../types';

interface SkillDetailModalProps {
  skill: Skill;
  currentUser: User;
  onClose: () => void;
  onBookSession: (skill: Skill) => void;
  onOpenChat: (peerId: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  currentUser,
  onClose,
  onBookSession,
  onOpenChat,
}) => {
  const [favorited, setFavorited] = useState(false);

  // Curriculum items modeled from Screen 6 ("What you'll learn")
  const curriculumPoints = [
    'Python fundamentals & syntax mastery',
    'Core data structures (Lists, Dicts, Tuples, Sets)',
    'Real-world mini projects & portfolio coding',
    'Web scraping and API integration basics',
    'Career tips & student project guidance',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Skill Overview
          </span>
          <button
            onClick={() => setFavorited(!favorited)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition"
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Skill Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {skill.category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  skill.type === 'Teach'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {skill.type}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {skill.title}
            </h1>
          </div>

          {/* Instructor / Peer Info Card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={skill.userPhoto}
                alt={skill.userName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs text-slate-500">Taught by</p>
                <h3 className="text-sm font-bold text-slate-900">{skill.userName}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3" />
                  <span>{skill.userCollege} • {skill.userYear}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">{skill.rating}</span>
              <span className="text-[10px] text-slate-400 font-medium">({skill.reviewsCount})</span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* What you'll learn */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What you'll learn
            </h3>
            <div className="space-y-2">
              {curriculumPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="leading-tight">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Session requests and booking notes are stored with AES-256-GCM encryption at rest.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          {currentUser.id !== skill.userId && (
            <button
              onClick={() => {
                onClose();
                onOpenChat(skill.userId);
              }}
              className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
              title="Chat with instructor"
            >
              <MessageSquare className="w-5 h-5 text-slate-600" />
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onBookSession(skill);
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
