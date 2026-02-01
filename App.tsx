
import React, { useState, useRef, useEffect } from 'react';
import { SignatureData, SignatureLayout, SocialLinks } from './types';
import SignaturePreview from './components/SignaturePreview';

const DEFAULT_LAYOUT: SignatureLayout = {
  id: 'layout-default',
  name: 'Layout Homty Standard',
  accentColor: '#16a34a',
  dividerColor: '#16a34a',
  primaryTextColor: '#1e293b',
  logoBgColor: '#1e293b',
  logoWidth: 160,
  iconSize: 18,
  footerFontSize: 11,
  nameFontSize: 22,
  jobTitleFontSize: 14,
  contactFontSize: 13,
  verticalSpacing: 8,
  logoFooterGap: 12,
  columnGap: 40,
  dividerWidth: 2,
  dividerHeight: 120,
  nameOffsetX: 0,
  nameOffsetY: 0,
  contactOffsetX: 0,
  contactOffsetY: 0,
  logoOffsetX: 0,
  logoOffsetY: 0,
  websiteOffsetX: 0,
  websiteOffsetY: 0,
  showLogoBackground: true,
  contactVerticalAlign: 'center',
  nameTitleAlign: 'left',
  contactInfoAlign: 'left',
  websiteAlign: 'left',
  footerTextAlign: 'left',
  logoAlign: 'left',
  layoutMode: 'logo-left',
};

const DEFAULT_DATA: SignatureData = {
  ...DEFAULT_LAYOUT,
  id: 'profile-1',
  profileName: 'Tarek Ben Bachir',
  fullName: 'Tarek Ben Bachir',
  jobTitle: 'Agent immobilier - IPI 511 438',
  email: 'trk@homty.be',
  phoneWork: '+32 (2) 844 23 03',
  phoneMobile: '+32 (0) 484 86 59 54',
  address: 'Avenue Louise 390 (bte13)\n1050 Ixelles - Bruxelles',
  website: 'Homty.be',
  logoUrl: 'https://homty.be/wp-content/uploads/2021/04/Logo-Homty-White.png',
  footerServices: 'Vente - Location - Gestion - Syndic',
  showFullName: true,
  showJobTitle: true,
  showEmail: true,
  showPhoneWork: true,
  showPhoneMobile: true,
  showAddress: true,
  showWebsite: true,
  showSocialIcons: true,
  socialLinks: {
    facebook: 'https://facebook.com/homty',
    linkedin: 'https://linkedin.com/company/homty',
    instagram: 'https://instagram.com/homty'
  }
};

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'labo' | 'design' | 'move' | 'social'>('content');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewScale, setPreviewScale] = useState(1);
  
  const [profiles, setProfiles] = useState<SignatureData[]>([]);
  const [layouts, setLayouts] = useState<SignatureLayout[]>([]);
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);
  const [newLayoutName, setNewLayoutName] = useState('');

  useEffect(() => {
    const savedProfiles = localStorage.getItem('homty_v3_profiles');
    const savedLayouts = localStorage.getItem('homty_v3_layouts');
    
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    } else {
      const initialLayouts = [DEFAULT_LAYOUT];
      setLayouts(initialLayouts);
      localStorage.setItem('homty_v3_layouts', JSON.stringify(initialLayouts));
    }

    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      setProfiles(parsed);
      setData(parsed[0]);
    } else {
      const initial = [DEFAULT_DATA];
      setProfiles(initial);
      localStorage.setItem('homty_v3_profiles', JSON.stringify(initial));
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setPreviewScale(Math.min(1, (window.innerWidth - 40) / 600));
      } else {
        setPreviewScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (profiles.length > 0) {
      const updated = profiles.map(p => p.id === data.id ? data : p);
      localStorage.setItem('homty_v3_profiles', JSON.stringify(updated));
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('social_')) {
      const key = name.split('_')[1] as keyof SocialLinks;
      setData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
      return;
    }
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' || type === 'range' ? parseFloat(value) : value;
    setData(prev => ({ ...prev, [name]: val }));
  };

  const saveCurrentLayout = () => {
    if (!newLayoutName) return alert("Donnez un nom à ce layout !");
    const newLayout: SignatureLayout = {
      ...data,
      id: `layout-${Date.now()}`,
      name: newLayoutName
    };
    const updated = [...layouts, newLayout];
    setLayouts(updated);
    localStorage.setItem('homty_v3_layouts', JSON.stringify(updated));
    setNewLayoutName('');
    alert("Layout enregistré dans le Laboratoire !");
  };

  const applyLayout = (layout: SignatureLayout) => {
    setData(prev => ({
      ...prev,
      ...layout,
      id: prev.id, // Conserver l'ID du profil
      profileName: prev.profileName, // Conserver le nom du profil
      name: layout.name // Mais on peut vouloir savoir quel layout est appliqué ? (facultatif)
    }));
  };

  const createNewProfile = () => {
    const newProfile = { ...data, id: `profile-${Date.now()}`, profileName: `Nouvelle Signature ${profiles.length + 1}` };
    setProfiles([...profiles, newProfile]);
    setData(newProfile);
    setActiveTab('content');
  };

  const deleteLayout = (id: string) => {
    if (layouts.length <= 1) return;
    const filtered = layouts.filter(l => l.id !== id);
    setLayouts(filtered);
    localStorage.setItem('homty_v3_layouts', JSON.stringify(filtered));
  };

  const copySignature = () => {
    const container = document.getElementById('signature-container');
    if (container) {
      const range = document.createRange();
      range.selectNode(container);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      alert('✨ Signature copiée avec succès !');
      window.getSelection()?.removeAllRanges();
    }
  };

  const AlignmentIcon = ({ type, name, current }: { type: 'left' | 'center' | 'right', name: string, current: string }) => {
    const icons = {
      left: <path d="M17 12H3M21 18H3M21 6H3" />,
      center: <path d="M18 12H6M21 18H3M21 6H3" />,
      right: <path d="M21 12H7M21 18H3M21 6H3" />
    };
    return (
      <button
        onClick={() => setData(prev => ({ ...prev, [name]: type }))}
        className={`p-2 rounded-lg transition-all ${current === type ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {icons[type]}
        </svg>
      </button>
    );
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-emerald-200/50">H</div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Studio Lab <span className="text-emerald-500">v3.0</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={createNewProfile} className="text-xs font-bold text-slate-500 hover:text-emerald-600">+ Nouveau Profil</button>
           <button onClick={copySignature} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95">Copier la Signature</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* PREVIEW AREA */}
        <div className="flex-1 bg-[#f1f5f9] flex flex-col items-center justify-center overflow-hidden relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40">
             <div className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mode Aperçu</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  <button onClick={() => setViewMode('desktop')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Desktop</button>
                  <button onClick={() => setViewMode('mobile')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Mobile</button>
                </div>
             </div>
          </div>

          <div className="w-full h-full flex items-center justify-center p-8 overflow-hidden">
            <div 
              className={`bg-white rounded-[56px] shadow-2xl transition-all duration-500 border border-white overflow-hidden flex flex-col mx-auto ${viewMode === 'desktop' ? 'w-full max-w-4xl' : 'w-[400px]'}`}
              style={{ transform: `scale(${previewScale})`, transformOrigin: 'center' }}
            >
              <div className="bg-[#f8fafc] px-10 py-6 border-b border-slate-100 flex items-center gap-3 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-400/50" />
                <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
                <div className="ml-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">{data.profileName}</div>
              </div>
              <div className="flex-1 flex items-center justify-center bg-white min-h-[400px] overflow-hidden p-8">
                <SignaturePreview data={data} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS AREA */}
        <aside className="w-[480px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl">
          <nav className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide bg-white sticky top-0 z-10">
            {[
              { id: 'content', label: '1. Informations' },
              { id: 'labo', label: '2. Laboratoire' },
              { id: 'design', label: '3. Style' },
              { id: 'move', label: '4. Position' },
              { id: 'social', label: '5. Social' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[100px] py-5 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-4">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase mb-2">Profil Actif</p>
                  <select 
                    value={data.id} 
                    onChange={(e) => {
                      const selected = profiles.find(p => p.id === e.target.value);
                      if (selected) setData(selected);
                    }}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2 text-sm font-bold text-emerald-900 focus:outline-none"
                  >
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.profileName}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'fullName', label: 'Nom Complet', showId: 'showFullName' },
                    { id: 'jobTitle', label: 'Titre / Fonction', showId: 'showJobTitle' },
                    { id: 'email', label: 'Email', showId: 'showEmail' },
                    { id: 'phoneMobile', label: 'Mobile', showId: 'showPhoneMobile' },
                    { id: 'phoneWork', label: 'Bureau', showId: 'showPhoneWork' },
                    { id: 'address', label: 'Adresse', showId: 'showAddress', multi: true },
                    { id: 'website', label: 'Site Web', showId: 'showWebsite' },
                    { id: 'footerServices', label: 'Services Slogan', multi: true },
                  ].map(f => (
                    <div key={f.id}>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                        {f.showId && <input type="checkbox" name={f.showId} checked={(data as any)[f.showId]} onChange={handleInputChange} className="w-4 h-4 accent-emerald-600" />}
                      </div>
                      {f.multi ? (
                        <textarea name={f.id} value={(data as any)[f.id]} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" rows={2} />
                      ) : (
                        <input type="text" name={f.id} value={(data as any)[f.id]} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'labo' && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Enregistrer ce Layout</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold">Figez tous les réglages actuels (couleurs, positions, tailles) pour les réutiliser sur n'importe quel profil.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nom du Layout (ex: Homty Noir)" 
                      value={newLayoutName}
                      onChange={(e) => setNewLayoutName(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={saveCurrentLayout} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all">OK</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Mes Layouts Figés</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {layouts.map(l => (
                      <div key={l.id} className="group flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl hover:border-emerald-300 transition-all shadow-sm">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-800">{l.name}</span>
                           <span className="text-[8px] text-slate-400 uppercase font-black">{l.layoutMode} • {l.accentColor}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => applyLayout(l)} className="bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all">Appliquer</button>
                          <button onClick={() => deleteLayout(l.id)} className="bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">Couleur Accent</label>
                    <input type="color" name="accentColor" value={data.accentColor} onChange={handleInputChange} className="w-full h-12 rounded-xl cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">Couleur Ligne</label>
                    <input type="color" name="dividerColor" value={data.dividerColor} onChange={handleInputChange} className="w-full h-12 rounded-xl cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                </div>

                <div className="space-y-6">
                   {[
                     { id: 'logoWidth', label: 'Largeur Logo', min: 40, max: 350 },
                     { id: 'nameFontSize', label: 'Taille Nom', min: 14, max: 48 },
                     { id: 'jobTitleFontSize', label: 'Taille Titre', min: 8, max: 24 },
                     { id: 'contactFontSize', label: 'Taille Infos', min: 8, max: 20 },
                     { id: 'footerFontSize', label: 'Taille Slogan', min: 6, max: 20 },
                     { id: 'verticalSpacing', label: 'Espacement', min: 0, max: 30 },
                     { id: 'dividerHeight', label: 'Hauteur Ligne', min: 10, max: 250 },
                   ].map(s => (
                     <div key={s.id}>
                        <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</label>
                          <span className="text-[10px] font-black text-emerald-600">{ (data as any)[s.id] }px</span>
                        </div>
                        <input type="range" name={s.id} min={s.min} max={s.max} value={(data as any)[s.id]} onChange={handleInputChange} className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer" />
                     </div>
                   ))}
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Structure Globale</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['logo-left', 'logo-right', 'logo-top', 'logo-bottom'].map(mode => (
                      <button key={mode} onClick={() => setData(prev => ({ ...prev, layoutMode: mode as any }))} className={`py-3 rounded-xl border transition-all text-[8px] font-black uppercase ${data.layoutMode === mode ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'bg-white/5 border-white/10 text-white/40'}`}>{mode.replace('logo-', '')}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'move' && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {[
                  { label: 'Logo', x: 'logoOffsetX', y: 'logoOffsetY' },
                  { label: 'Nom & Titre', x: 'nameOffsetX', y: 'nameOffsetY' },
                  { label: 'Coordonnées', x: 'contactOffsetX', y: 'contactOffsetY' },
                ].map(block => (
                  <div key={block.label} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.label}</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Axe X</span>
                          <span className="text-[9px] font-black text-emerald-600">{(data as any)[block.x]}px</span>
                        </div>
                        <input type="range" name={block.x} min={-100} max={100} value={(data as any)[block.x]} onChange={handleInputChange} className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Axe Y</span>
                          <span className="text-[9px] font-black text-emerald-600">{(data as any)[block.y]}px</span>
                        </div>
                        <input type="range" name={block.y} min={-100} max={100} value={(data as any)[block.y]} onChange={handleInputChange} className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 duration-500">
                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-widest">Afficher les icônes</span>
                  <input type="checkbox" name="showSocialIcons" checked={data.showSocialIcons} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600" />
                </div>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
                    <div key={s}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">{s}</label>
                      <input type="text" name={`social_${s}`} value={(data.socialLinks as any)[s] || ''} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="Lien du profil" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
