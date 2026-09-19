import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, Lock, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { Skill, Booking } from '../types';
import { apiClient } from '../api/client';

interface BookSessionModalProps {
  skill: Skill;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({
  skill,
  onClose,
  onBookingCreated,
}) => {
  const [dateTime, setDateTime] = useState('Tomorrow • 4:00 PM');
  const [customDate, setCustomDate] = useState('');
  const [notes, setNotes] = useState('Looking forward to discussing practical code examples and getting guidance.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    'Tomorrow • 4:00 PM',
    'Tomorrow • 6:30 PM',
    'Saturday • 11:00 AM',
    'Sunday • 3:00 PM',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDateTime = customDate.trim() || dateTime;

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.createBooking({
        teacherId: skill.userId,
        skillId: skill.id,
        dateTime: finalDateTime,
        notes,
      });

      onBookingCreated(res.booking);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule booking');
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
              id="book-modal-back-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-full hover:bg-slate-200/70 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Session</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{skill.title}</p>
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

        <form onSubmit={handleBooking} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Instructor overview */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50/40 border border-indigo-100 rounded-2xl">
            <img
              src={skill.userPhoto}
              alt={skill.userName}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="text-xs">
              <div className="font-bold text-slate-900">{skill.userName}</div>
              <div className="text-slate-500">{skill.userCollege}</div>
            </div>
          </div>

          {/* Time Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Preferred Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setDateTime(slot);
                    setCustomDate('');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-left transition ${
                    dateTime === slot && !customDate
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{slot}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Or Custom Date/Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Custom Date & Time
            </label>
            <input
              type="text"
              placeholder="e.g. Next Tuesday at 5:00 PM"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Private Session Notes (Encrypted with AES-256) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Session Focus / Personal Notes
              </label>
              <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> AES-256 Encrypted
              </span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 resize-none"
              placeholder="What questions or topics do you want to cover?"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero-cost peer learning exchange session.</span>
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
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
