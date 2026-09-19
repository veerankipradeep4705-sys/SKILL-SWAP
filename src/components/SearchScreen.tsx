import React, { useState, useMemo } from 'react';
import { Search, X, Star, BookOpen, User, Plus, ArrowLeft } from 'lucide-react';
import { Skill } from '../types';

interface SearchScreenProps {
  skills: Skill[];
  initialCategory?: string;
  onSelectSkill: (skill: Skill) => void;
  onOpenAddSkill: () => void;
  onBack?: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  skills,
  initialCategory = 'All',
  onSelectSkill,
  onOpenAddSkill,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Teach' | 'Learn'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);

  const categories = ['All', 'Programming', 'Design', 'Music', 'Language', 'Photography', 'Fitness'];

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' || s.type === typeFilter;
      const matchesCategory = categoryFilter === 'All' || s.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [skills, searchQuery, typeFilter, categoryFilter]);

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="search-header-back-btn"
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Search Skills
          </h1>
        </div>
        <button
          onClick={onOpenAddSkill}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Search Bar matching Image 7 Screen 5 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search skills (e.g. python, figma, flutter)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Filter Pills: All, Teach, Learn (as seen in Image 7 Screen 5) */}
      <div className="flex items-center gap-2">
        {(['All', 'Teach', 'Learn'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              typeFilter === t
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition ${
              categoryFilter === c
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills Result List */}
      <div className="space-y-3 pt-1">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onSelectSkill(skill)}
              className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <img
                  src={skill.userPhoto}
                  alt={skill.userName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {skill.userName}
                    </span>
                    <span className="text-[10px] text-slate-400">• {skill.userYear}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate mt-0.5">
                    {skill.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{skill.rating}</span>
                      <span className="text-slate-400 font-normal">({skill.reviewsCount})</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {skill.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Teach / Learn Badge matching mockup */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    skill.type === 'Teach'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}
                >
                  {skill.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No matching skills found</h3>
            <p className="text-xs text-slate-500">
              Try modifying your search keywords or filter options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
