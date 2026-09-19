import React, { useState } from 'react';
import { X, Plus, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { apiClient } from '../api/client';
import { Skill } from '../types';

interface AddSkillModalProps {
  onClose: () => void;
  onSkillAdded: (skill: Skill) => void;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  onClose,
  onSkillAdded,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [type, setType] = useState<'Teach' | 'Learn'>('Teach');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Programming', 'Design', 'Music', 'Language', 'Photography', 'Fitness', 'Academics'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a skill title and description.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.createSkill({
        title: title.trim(),
        category,
        description: description.trim(),
        type,
      });

      onSkillAdded(res.skill);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              id="add-skill-back-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-full hover:bg-slate-200/70 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Skill</h3>
              <p className="text-[11px] text-slate-500">Publish to community directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Type Toggle: Teach or Learn */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Intent
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Teach')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                  type === 'Teach'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                I Want to Teach
              </button>
              <button
                type="button"
                onClick={() => setType('Learn')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                  type === 'Learn'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                I Want to Learn
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill Title
            </label>
            <input
              type="text"
              placeholder="e.g. Flutter Mobile App Development"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what will be taught/learned, your background, or what you offer in exchange..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Publishing...' : 'Publish Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
