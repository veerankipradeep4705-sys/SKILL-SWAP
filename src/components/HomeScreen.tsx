import React, { useState } from 'react';
import { Search, ArrowRight, Code, Palette, Music, Globe, Camera, Dumbbell, Calendar, Star, ChevronRight, Sparkles } from 'lucide-react';
import { User, Skill, Booking } from '../types';

interface HomeScreenProps {
  user: User;
  onNavigateTab: (tab: 'home' | 'search' | 'bookings' | 'chat' | 'profile') => void;
  onSelectSkill: (skill: Skill) => void;
  onSearchCategory: (category: string) => void;
  skills: Skill[];
  bookings: Booking[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onNavigateTab,
  onSelectSkill,
  onSearchCategory,
  skills,
  bookings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Popular skills categories matching Image 7 Screen 4
  const categories = [
    { name: 'Programming', icon: Code, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Design', icon: Palette, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Music', icon: Music, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Language', icon: Globe, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Photography', icon: Camera, color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { name: 'Fitness', icon: Dumbbell, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  const upcomingBookings = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchCategory(searchQuery.trim());
      onNavigateTab('search');
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Hello, {user.name.split(' ')[0]} <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            What skill do you want to learn today?
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('profile')}
          className="relative group shrink-0"
        >
          <img
            src={user.photo}
            alt={user.name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-indigo-500 shadow-sm group-hover:scale-105 transition"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search skills (e.g. Python, Flutter, UI/UX)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </form>

      {/* Hero Banner (Matching Image 7 Screen 4) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-5 sm:p-6 shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-[240px] sm:max-w-xs space-y-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase text-indigo-100">
            <Sparkles className="w-3 h-3 text-amber-300" /> Peer Learning
          </span>
          <h2 className="text-lg sm:text-xl font-black leading-snug">
            Share Skills <br />
            Build Community
          </h2>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Exchange your knowledge with verified students without any money.
          </p>
          <button
            onClick={() => onNavigateTab('search')}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 active:scale-95 transition"
          >
            <span>Start Swapping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Decorative graphic / watermark */}
        <div className="absolute right-[-10px] bottom-[-10px] opacity-20 sm:opacity-30 pointer-events-none">
          <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="34" cy="22" r="8" />
            <circle cx="66" cy="22" r="8" />
            <path d="M 22,38 C 14,54 22,76 46,74 C 40,68 34,56 38,46 C 41,38 48,34 50,44 C 52,34 59,38 62,46 C 66,56 60,68 54,74 C 78,76 86,54 78,38 C 72,50 64,52 57,48 C 50,44 50,44 43,48 C 36,52 28,50 22,38 Z" />
          </svg>
        </div>
      </div>

      {/* Popular Skills Category Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Popular Skills</h2>
          <button
            onClick={() => {
              onSearchCategory('All');
              onNavigateTab('search');
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  onSearchCategory(cat.name);
                  onNavigateTab('search');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-md transition group text-center"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 border transition group-hover:scale-110 ${cat.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-indigo-600 truncate w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Upcoming Bookings</h2>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            See All
          </button>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-2.5">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigateTab('bookings')}
                className="p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={b.teacherPhoto}
                    alt={b.teacherName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {b.skillTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      with {b.teacherName}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{b.dateTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {b.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500">No upcoming learning sessions yet.</p>
            <button
              onClick={() => onNavigateTab('search')}
              className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Browse Skills to Book
            </button>
          </div>
        )}
      </div>

      {/* Featured Skills Carousel / List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Recommended for You</h2>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Explore
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.slice(0, 4).map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSkill(s)}
              className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {s.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.type === 'Teach'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {s.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={s.userPhoto}
                    alt={s.userName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-700 font-medium truncate max-w-[100px]">
                    {s.userName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{s.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({s.reviewsCount})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
