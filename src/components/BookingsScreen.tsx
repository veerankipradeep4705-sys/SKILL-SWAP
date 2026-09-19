import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, MessageSquare, ChevronRight, Lock, ArrowLeft } from 'lucide-react';
import { Booking, User } from '../types';
import { apiClient } from '../api/client';

interface BookingsScreenProps {
  bookings: Booking[];
  currentUser: User;
  onRefresh: () => void;
  onOpenChat: (peerId: string) => void;
  onBack?: () => void;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  currentUser,
  onRefresh,
  onOpenChat,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const upcoming = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Pending'
  );
  const past = bookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Cancelled'
  );

  const displayed = activeTab === 'Upcoming' ? upcoming : past;

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      await apiClient.updateBookingStatus(bookingId, newStatus);
      onRefresh();
    } catch (err: any) {
      alert('Failed to update booking: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header matching Screen 8 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="bookings-header-back-btn"
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          {bookings.length} Total Sessions
        </span>
      </div>

      {/* Tabs: Upcoming / Past */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'Upcoming'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('Past')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'Past'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      {/* Booking list matching Screen 8 cards */}
      <div className="space-y-3">
        {displayed.length > 0 ? (
          displayed.map((booking) => {
            const peerName =
              booking.teacherId === currentUser.id
                ? booking.learnerName
                : booking.teacherName;
            const peerPhoto = booking.teacherPhoto;
            const peerId =
              booking.teacherId === currentUser.id
                ? booking.learnerId
                : booking.teacherId;

            return (
              <div
                key={booking.id}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-indigo-200 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={peerPhoto}
                      alt={peerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {booking.skillTitle}
                      </h3>
                      <p className="text-xs text-slate-500">{peerName}</p>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{booking.dateTime}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : booking.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : booking.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Encrypted Session Notes */}
                {booking.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      <Lock className="w-3 h-3 text-indigo-500" />
                      <span>Encrypted Session Notes (AES-256):</span>
                    </div>
                    <p className="italic">"{booking.notes}"</p>
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenChat(peerId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Peer</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'Completed')}
                          disabled={updatingId === booking.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                          disabled={updatingId === booking.id}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No {activeTab.toLowerCase()} bookings</h3>
            <p className="text-xs text-slate-500">
              Browse skills and schedule a session to exchange knowledge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
