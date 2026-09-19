import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, Database, RefreshCw, CheckCircle2, Lock, ArrowRight, ArrowLeft, Eye, Code, FileCode } from 'lucide-react';
import { apiClient } from '../api/client';
import { VaultInspectionData } from '../types';

interface SecurityVaultModalProps {
  onClose: () => void;
  currentToken: string | null;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  onClose,
  currentToken,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'jwt' | 'playground' | 'architecture'>('vault');
  const [vaultData, setVaultData] = useState<VaultInspectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jwtInspection, setJwtInspection] = useState<any>(null);

  // Playground state
  const [plaintextInput, setPlaintextInput] = useState('Confidential Student Record: 24471A05KN, Flutter Lab Grade: A+');
  const [cryptoResult, setCryptoResult] = useState<any>(null);
  const [testingCrypto, setTestingCrypto] = useState(false);

  const fetchVault = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getVaultData();
      setVaultData(data.vault);

      if (currentToken) {
        const jwtData = await apiClient.inspectJwt(currentToken);
        setJwtInspection(jwtData);
      }
    } catch (err) {
      console.error('Error loading security vault:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [currentToken]);

  const handleTestCrypto = async () => {
    try {
      setTestingCrypto(true);
      const res = await apiClient.testCrypto(plaintextInput);
      setCryptoResult(res);
    } catch (err) {
      console.error('Error running test crypto:', err);
    } finally {
      setTestingCrypto(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'playground' && !cryptoResult) {
      handleTestCrypto();
    }
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="vault-header-back-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Security & Cryptographic Vault
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  AES-256 + JWT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Live inspection of sessions and data encryption at rest
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchVault}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Refresh database at rest state"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database At Rest (AES-256)</span>
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'jwt'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>JWT Session Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Crypto Test Bench</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>System Spec & ER Model</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs">
          {/* TAB 1: DATABASE AT REST INSPECTION */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              {/* Security Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-sans">Encryption Standard</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">AES-256-GCM</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">Authenticated at rest</div>
                </div>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-sans">Session Token</div>
                  <div className="text-sm font-bold text-indigo-400 mt-1">JWT (HS256)</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">Stateless Bearer Auth</div>
                </div>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-sans">Password Hashing</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">bcrypt</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">10 Salt Rounds</div>
                </div>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[11px] text-slate-400 font-sans">Total Encrypted Entities</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {(vaultData?.recordsCount.users || 0) +
                      (vaultData?.recordsCount.chats || 0) +
                      (vaultData?.recordsCount.bookings || 0)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">Records in Vault</div>
                </div>
              </div>

              {/* Users Table at Rest */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Table: USERS (Personal data stored encrypted at rest)
                  </span>
                  <span className="text-slate-400 text-xs">
                    {vaultData?.tablesAtRest.users.length || 0} user records
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto space-y-4">
                  {vaultData?.tablesAtRest.users.map((u) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-300 font-sans text-xs">
                        <span className="font-bold text-indigo-300">{u.name} ({u.id})</span>
                        <span className="text-slate-500 text-[11px]">email: {u.email}</span>
                      </div>
                      
                      {/* Password Hash */}
                      <div className="text-[11px]">
                        <span className="text-amber-400">password_hash (bcrypt):</span>{' '}
                        <span className="text-slate-400 break-all">{u.passwordHashBcrypt}</span>
                      </div>

                      {/* College Encrypted AES-256 */}
                      <div className="text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <div className="text-emerald-400 font-semibold flex items-center justify-between">
                          <span>college_encrypted (AES-256-GCM):</span>
                          <span className="text-[10px] text-slate-500">IV: {u.collegeEncryptedAES256?.iv}</span>
                        </div>
                        <div className="text-slate-400 break-all text-[10px] mt-0.5">
                          ciphertext: {u.collegeEncryptedAES256?.ciphertext}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          auth_tag: {u.collegeEncryptedAES256?.authTag}
                        </div>
                      </div>

                      {/* Bio Encrypted AES-256 */}
                      <div className="text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <div className="text-emerald-400 font-semibold flex items-center justify-between">
                          <span>bio_encrypted (AES-256-GCM):</span>
                          <span className="text-[10px] text-slate-500">IV: {u.bioEncryptedAES256?.iv}</span>
                        </div>
                        <div className="text-slate-400 break-all text-[10px] mt-0.5">
                          ciphertext: {u.bioEncryptedAES256?.ciphertext}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          auth_tag: {u.bioEncryptedAES256?.authTag}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chats Table at Rest */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Table: CHATS (Messages encrypted at rest with AES-256-GCM)
                  </span>
                  <span className="text-slate-400 text-xs">
                    {vaultData?.tablesAtRest.chats.length || 0} messages
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto space-y-3">
                  {vaultData?.tablesAtRest.chats.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Msg ID: {c.id}</span>
                        <span>{c.timestamp}</span>
                      </div>
                      <div className="text-emerald-400">
                        AES-256 Ciphertext: {c.messageCiphertextAES256?.ciphertext}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        IV: {c.messageCiphertextAES256?.iv} | Tag: {c.messageCiphertextAES256?.authTag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JWT SESSION INSPECTOR */}
          {activeTab === 'jwt' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white font-sans flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    Current Session Token (Bearer Authorization)
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">
                    ACTIVE & VERIFIED
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 break-all text-[11px] text-indigo-300">
                  {currentToken || 'No active JWT token. Please log in to inspect live session.'}
                </div>
              </div>

              {jwtInspection?.decoded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Decoded Header */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-amber-400 font-sans">
                      JWT Header (Algorithm & Token Type)
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-xl text-slate-300 overflow-x-auto text-[11px]">
                      {JSON.stringify(jwtInspection.decoded.header, null, 2)}
                    </pre>
                  </div>

                  {/* Decoded Payload */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-indigo-400 font-sans">
                      JWT Payload (Claims & Expiration)
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-xl text-slate-300 overflow-x-auto text-[11px]">
                      {JSON.stringify(jwtInspection.decoded.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl text-xs font-sans leading-relaxed text-indigo-200">
                <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  How JWT Session Works in this App:
                </div>
                Upon successful login or registration, the server issues an RFC 7519 compliant JSON Web Token signed with HMAC-SHA256 (HS256). All subsequent API requests send this token in the <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">Authorization: Bearer &lt;token&gt;</code> header. The server verifies signature and expiration before serving decrypted personal data.
              </div>
            </div>
          )}

          {/* TAB 3: CRYPTO PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-sans">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Interactive AES-256-GCM Cryptographic Bench
                </div>
                <p className="text-xs text-slate-400">
                  Type any plaintext message to test live Node.js encryption with random IV and 128-bit authentication tag.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={plaintextInput}
                    onChange={(e) => setPlaintextInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="Enter confidential text to encrypt..."
                  />
                  <button
                    onClick={handleTestCrypto}
                    disabled={testingCrypto}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {testingCrypto ? 'Encrypting...' : 'Run AES-256'}
                  </button>
                </div>
              </div>

              {cryptoResult && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold font-sans">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Authenticated Roundtrip Verified
                    </span>
                    <span className="text-slate-500">Algorithm: {cryptoResult.algorithm}</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">1. Original Plaintext:</span>
                      <div className="p-2 bg-slate-900 rounded-lg text-white mt-1">
                        {cryptoResult.originalPlaintext}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400">2. Random IV (12 Bytes Hex):</span>
                        <div className="p-2 bg-slate-900 rounded-lg text-amber-300 mt-1 break-all">
                          {cryptoResult.initializationVectorHex}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">3. Auth Tag (16 Bytes Hex):</span>
                        <div className="p-2 bg-slate-900 rounded-lg text-indigo-300 mt-1 break-all">
                          {cryptoResult.authenticationTagHex}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">4. Ciphertext at Rest (AES-256 Hex):</span>
                      <div className="p-2 bg-slate-900 rounded-lg text-emerald-300 mt-1 break-all">
                        {cryptoResult.ciphertextHex}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">5. Decrypted Back in Memory:</span>
                      <div className="p-2 bg-slate-900 rounded-lg text-white mt-1 border border-emerald-500/30">
                        {cryptoResult.decryptedBack}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SYSTEM SPEC & ER MODEL */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-sm">
                  Project Specification: Skill Swap (Learn by Teaching)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><span className="text-slate-500">Domain:</span> Mobile / Web Application</div>
                  <div><span className="text-slate-500">Student Ref:</span> G. Vijayalakshmi (24471A05KN)</div>
                  <div><span className="text-slate-500">Session Auth:</span> JWT HS256 Standard</div>
                  <div><span className="text-slate-500">Data at Rest:</span> AES-256-GCM Authenticated Encryption</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-sm">
                  Handwritten ER Diagram Entities Implemented:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-indigo-400">USERS:</strong> user_id (PK), name, email, passwordHash (bcrypt), photo, bio (AES-256 encrypted), college (AES-256 encrypted), year, created_at.
                  </li>
                  <li>
                    <strong className="text-indigo-400">SKILLS:</strong> skill_id (PK), user_id (FK), title, category, description, type (Teach / Learn), created_at.
                  </li>
                  <li>
                    <strong className="text-indigo-400">SESSIONS / BOOKINGS:</strong> session_id (PK), teacher_id (FK), learner_id (FK), date_time, status (Confirmed, Pending, Completed, Cancelled), notes (AES-256 encrypted).
                  </li>
                  <li>
                    <strong className="text-indigo-400">CHATS:</strong> chat_id (PK), sender_id (FK), receiver_id (FK), message (AES-256 encrypted), timestamp.
                  </li>
                  <li>
                    <strong className="text-indigo-400">REVIEWS:</strong> review_id (PK), from_user (FK), to_user (FK), rating, comment.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
