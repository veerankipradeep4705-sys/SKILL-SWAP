import React, { useState, useEffect } from 'react';
import { apiClient } from './api/client';
import { User, Skill, Booking, ActiveTab } from './types';
import { HeaderNavbar } from './components/HeaderNavbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { BookingsScreen } from './components/BookingsScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthModal } from './components/AuthModal';
import { SkillDetailModal } from './components/SkillDetailModal';
import { BookSessionModal } from './components/BookSessionModal';
import { AddSkillModal } from './components/AddSkillModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SecurityVaultModal } from './components/SecurityVaultModal';
import { ShieldCheck, Lock, Smartphone, Wifi, Battery, Signal, Sparkles, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(apiClient.getToken());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [navigationHistory, setNavigationHistory] = useState<ActiveTab[]>(['home']);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [bookingSkill, setBookingSkill] = useState<Skill | null>(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeChatPeerId, setActiveChatPeerId] = useState<string>('user-alex-kumar');
  const [searchCategory, setSearchCategory] = useState<string>('All');

  // Frame display toggle (mobile container vs full dashboard)
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Navigating to a new tab with history tracking
  const navigateToTab = (tab: ActiveTab) => {
    if (tab !== activeTab) {
      setNavigationHistory((prev) => [...prev, tab]);
      setActiveTab(tab);
    }
  };

  // Centralized Back Button logic
  const handleGoBack = () => {
    // 1. If any modal or sheet is open, close it first
    if (bookingSkill) {
      setBookingSkill(null);
      return;
    }
    if (selectedSkill) {
      setSelectedSkill(null);
      return;
    }
    if (showAddSkillModal) {
      setShowAddSkillModal(false);
      return;
    }
    if (showEditProfileModal) {
      setShowEditProfileModal(false);
      return;
    }
    if (showVaultModal) {
      setShowVaultModal(false);
      return;
    }
    if (showAuthModal) {
      setShowAuthModal(false);
      return;
    }

    // 2. Otherwise navigate back through tab history
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop(); // pop current tab
      const previousTab = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setActiveTab(previousTab);
    } else if (activeTab !== 'home') {
      setNavigationHistory(['home']);
      setActiveTab('home');
    }
  };

  // Whether user can navigate back
  const canGoBack = Boolean(
    selectedSkill ||
    bookingSkill ||
    showAddSkillModal ||
    showEditProfileModal ||
    showVaultModal ||
    showAuthModal ||
    activeTab !== 'home' ||
    navigationHistory.length > 1
  );

  // Load initial data
  const loadData = async () => {
    try {
      const skillsRes = await apiClient.getSkills();
      setSkills(skillsRes.skills);

      if (token) {
        try {
          const userRes = await apiClient.getMe();
          setCurrentUser(userRes.user);

          const bookRes = await apiClient.getBookings();
          setBookings(bookRes.bookings);
        } catch (e) {
          console.warn('Session expired or invalid, clearing token');
          apiClient.removeToken();
          setToken(null);
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Handle successful login or registration
  const handleAuthSuccess = (user: User, newToken: string) => {
    setCurrentUser(user);
    setToken(newToken);
    setShowAuthModal(false);
    showToast(`Welcome, ${user.name}! Authenticated with JWT session.`);
    loadData();
  };

  const handleLogout = () => {
    apiClient.removeToken();
    setToken(null);
    setCurrentUser(null);
    showToast('Signed out of session. Data remains safely encrypted at rest.');
  };

  // Switch to chat with peer
  const handleOpenChatWithPeer = (peerId: string) => {
    setActiveChatPeerId(peerId);
    navigateToTab('chat');
  };

  const handleSearchFromHome = (cat: string) => {
    setSearchCategory(cat);
    navigateToTab('search');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-base font-bold tracking-wide">Initializing Skill Swap Secure Core</h2>
        <p className="text-xs text-slate-400 mt-1">
          Loading JWT security provider and AES-256 encrypted database vault...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Universal Top Header Navigation */}
      <HeaderNavbar
        user={currentUser}
        onOpenVault={() => setShowVaultModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
      />

      {/* Floating System Status Pill */}
      <aside aria-label="Cryptographic Security Status" className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs border-b border-slate-800 flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>AES-256-GCM Encrypted at Rest</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>JWT HS256 Session Auth</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <button
          onClick={() => setShowVaultModal(true)}
          className="text-white hover:text-indigo-300 underline font-medium cursor-pointer"
        >
          View Database Vault Inspector →
        </button>
      </aside>

      {/* Main App Canvas */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8">
        {/* If user is not authenticated, show welcoming authentication view */}
        {!currentUser ? (
          <div className="w-full max-w-md my-auto">
            <AuthModal onSuccess={handleAuthSuccess} initialMode="login" />
          </div>
        ) : (
          /* When authenticated, render app either in Mobile Shell (matching Image 7) or Wide View */
          <div
            className={`w-full transition-all duration-300 ${
              isMobileFrame
                ? 'max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative min-h-[780px] flex flex-col'
                : 'max-w-4xl bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col'
            }`}
          >
            {/* Mobile Top Status Bar (Only in Mobile Frame Mode) */}
            {isMobileFrame && (
              <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 select-none bg-white">
                <span>9:41</span>
                {/* Speaker Notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Container Top App Bar with Arrow on Left Side Top */}
            <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-xs sticky top-0 z-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  id="app-container-back-btn"
                  onClick={handleGoBack}
                  disabled={!canGoBack}
                  className={`p-2 rounded-xl transition flex items-center gap-1.5 ${
                    canGoBack
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs cursor-pointer active:scale-95'
                      : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-40'
                  }`}
                  title={canGoBack ? 'Go back' : 'Already at Home'}
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Back</span>
                </button>

                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                      {activeTab === 'home' && 'Skill Swap'}
                      {activeTab === 'search' && 'Search Skills'}
                      {activeTab === 'bookings' && 'My Bookings'}
                      {activeTab === 'chat' && 'Direct Messages'}
                      {activeTab === 'profile' && 'My Profile'}
                    </h2>
                    {activeTab === 'home' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 hidden sm:block">
                    {activeTab === 'home' && 'Learn by Teaching • Campus Peer Network'}
                    {activeTab === 'search' && 'Discover student tutors & exchange topics'}
                    {activeTab === 'bookings' && 'Scheduled 1-on-1 swap sessions'}
                    {activeTab === 'chat' && 'End-to-end AES-256 encrypted messages'}
                    {activeTab === 'profile' && 'Your encrypted campus profile & skills'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVaultModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold shadow-xs transition active:scale-95"
                  title="Inspect Security Vault"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-white text-[11px] font-medium hidden sm:inline">Vault</span>
                </button>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4">
              {activeTab === 'home' && (
                <HomeScreen
                  user={currentUser}
                  onNavigateTab={(tab) => navigateToTab(tab)}
                  onSelectSkill={(skill) => setSelectedSkill(skill)}
                  onSearchCategory={handleSearchFromHome}
                  skills={skills}
                  bookings={bookings}
                />
              )}

              {activeTab === 'search' && (
                <SearchScreen
                  skills={skills}
                  initialCategory={searchCategory}
                  onSelectSkill={(skill) => setSelectedSkill(skill)}
                  onOpenAddSkill={() => setShowAddSkillModal(true)}
                  onBack={handleGoBack}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingsScreen
                  bookings={bookings}
                  currentUser={currentUser}
                  onRefresh={loadData}
                  onOpenChat={handleOpenChatWithPeer}
                  onBack={handleGoBack}
                />
              )}

              {activeTab === 'chat' && (
                <ChatScreen
                  currentUser={currentUser}
                  activePeerId={activeChatPeerId}
                  onBack={handleGoBack}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  user={currentUser}
                  skills={skills}
                  onOpenEditProfile={() => setShowEditProfileModal(true)}
                  onOpenSecurityVault={() => setShowVaultModal(true)}
                  onOpenAddSkill={() => setShowAddSkillModal(true)}
                  onLogout={handleLogout}
                  onBack={handleGoBack}
                />
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <BottomNav
              activeTab={activeTab}
              onChangeTab={(tab) => navigateToTab(tab)}
              unreadChatCount={1}
            />
          </div>
        )}
      </main>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Dialogs */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <AuthModal
            onSuccess={handleAuthSuccess}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        </div>
      )}

      {selectedSkill && currentUser && (
        <SkillDetailModal
          skill={selectedSkill}
          currentUser={currentUser}
          onClose={() => setSelectedSkill(null)}
          onBookSession={(skill) => {
            setSelectedSkill(null);
            setBookingSkill(skill);
          }}
          onOpenChat={(peerId) => {
            setSelectedSkill(null);
            handleOpenChatWithPeer(peerId);
          }}
        />
      )}

      {bookingSkill && (
        <BookSessionModal
          skill={bookingSkill}
          onClose={() => setBookingSkill(null)}
          onBookingCreated={(newBooking) => {
            setBookings((prev) => [newBooking, ...prev]);
            showToast('Session booked! Notes stored encrypted with AES-256 at rest.');
            setActiveTab('bookings');
          }}
        />
      )}

      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => setShowAddSkillModal(false)}
          onSkillAdded={(newSkill) => {
            setSkills((prev) => [newSkill, ...prev]);
            showToast('Skill published to community directory!');
            loadData();
          }}
        />
      )}

      {showEditProfileModal && currentUser && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setShowEditProfileModal(false)}
          onUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
            showToast('Personal data modified and re-encrypted with AES-256 at rest.');
            loadData();
          }}
        />
      )}

      {showVaultModal && (
        <SecurityVaultModal
          onClose={() => setShowVaultModal(false)}
          currentToken={token}
        />
      )}
    </div>
  );
}
