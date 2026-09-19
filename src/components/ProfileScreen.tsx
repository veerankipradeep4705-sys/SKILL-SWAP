import React from 'react';
import { Settings, Edit3, Shield, Bell, HelpCircle, LogOut, Star, Award, BookOpen, ChevronRight, Plus, Building, Calendar, Lock, ArrowLeft } from 'lucide-react';
import { User, Skill } from '../types';

interface ProfileScreenProps {
  user: User;
  skills: Skill[];
  onOpenEditProfile: () => void;
  onOpenSecurityVault: () => void;
  onOpenAddSkill: () => void;
  onLogout: () => void;
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  skills,
  onOpenEditProfile,
  onOpenSecurityVault,
  onOpenAddSkill,
  onLogout,
  onBack,
}) => {
  const mySkills = skills.filter((s) => s.userId === user.id);

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="profile-header-back-btn"
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Profile
          </h1>
        </div>
        <button
          onClick={onOpenEditProfile}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
          title="Edit Profile"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Card matching Image 7 Screen 9 */}
      <div className="flex flex-col items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
        <div className="relative mb-3">
          <img
            src={user.photo}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-md"
          />
          <button
            onClick={onOpenEditProfile}
            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xs transition"
            title="Edit Photo"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
          <Building className="w-3.5 h-3.5 text-indigo-500" />
          <span>{user.year} • {user.college}</span>
        </p>

        {user.bio && (
          <p className="mt-3 text-xs text-slate-600 max-w-sm italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
            "{user.bio}"
          </p>
        )}

        {/* Stats Row matching Screen 9 (5 Skills Given, 3 Skills Taken, 4.8 Rating) */}
        <div className="grid grid-cols-3 w-full mt-5 pt-4 border-t border-slate-100">
          <div className="text-center">
            <div className="text-base font-extrabold text-indigo-600">
              {user.skillsGiven}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Skills Given
            </div>
          </div>
          <div className="text-center border-x border-slate-100">
            <div className="text-base font-extrabold text-indigo-600">
              {user.skillsTaken}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Skills Taken
            </div>
          </div>
          <div className="text-center">
            <div className="text-base font-extrabold text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{user.rating}</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Rating
            </div>
          </div>
        </div>
      </div>

      {/* My Skills Section matching Screen 9 */}
      <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">My Skills</h3>
          <button
            onClick={onOpenAddSkill}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {mySkills.length > 0 ? (
            mySkills.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100/80 flex items-center gap-1.5"
              >
                <span>{s.title}</span>
                <span className="text-[10px] text-indigo-400 font-normal">({s.type})</span>
              </span>
            ))
          ) : (
            <div className="text-xs text-slate-400 py-1">
              No skills added yet. Click "+ Add Skill" to publish what you can teach or learn.
            </div>
          )}
        </div>
      </div>

      {/* Settings Menu List matching Image 7 Screen 9 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
        <button
          onClick={onOpenEditProfile}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-slate-700 font-medium transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <Edit3 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Edit Profile</div>
              <div className="text-[11px] text-slate-400">Update personal info & encrypted data</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenSecurityVault}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-slate-700 font-medium transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <span>Security & Database Vault</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  AES-256 + JWT
                </span>
              </div>
              <div className="text-[11px] text-slate-400">View live ciphertext at rest & session claims</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert('Notifications are active for swap session bookings and chats.')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-slate-700 font-medium transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <Bell className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-900">Notifications</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert('Skill Swap Help Desk: Learn by Teaching peer community. Contact support@skillswap.edu')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-slate-700 font-medium transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-900">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 hover:bg-rose-50 text-rose-600 font-medium transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* Security notice footer */}
      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-emerald-500" />
        <span>Stored with AES-256 Data Encryption at Rest & JWT Sessions</span>
      </div>
    </div>
  );
};
