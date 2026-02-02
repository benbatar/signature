
import React, { useState, useRef, useEffect } from 'react';
import { SignatureData, SignatureLayout, SocialLinks } from './types';
import SignaturePreview from './components/SignaturePreview';

const DEFAULT_LAYOUT: SignatureLayout = {
  id: 'layout-standard',
  name: 'Homty Corporate (Figé)',
  accentColor: '#16a34a',
  dividerColor: '#16a34a',
  primaryTextColor: '#1e293b',
  logoBgColor: '#1e293b',
  logoWidth: 160,
  iconSize: 18,
  footerFontSize: 11,
  nameFontSize: 24,
  jobTitleFontSize: 14,
  contactFontSize: 13,
  verticalSpacing: 6,
  logoFooterGap: 12,
  columnGap: 40,
  dividerWidth: 2,
  dividerHeight: 130,
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
  id: 'prof-1',
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
  const [newLayoutName, setNewLayoutName] = useState('');
  
  const [profiles, setProfiles] = useState<SignatureData[]>([]);
  const [layouts, setLayouts] = useState<SignatureLayout[]>([]);
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('homty_v4_profiles');
    const savedLayouts = localStorage.getItem('homty_v4_layouts');
    
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    } else {
      setLayouts([DEFAULT_LAYOUT]);
    }

    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      setProfiles(parsed);
      setData(parsed[0]);
    } else {
      setProfiles([DEFAULT_DATA]);
    }

    const handleResize = () => {
      setPreviewScale(window.innerWidth < 1024 ? Math.min(1, (window.innerWidth - 40) / 750) : 1);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      const updated = profiles.map(p => p.id === data.id ? data : p);
      localStorage.setItem('homty_v4_profiles', JSON.stringify(updated));
    }
    if (layouts.length > 0) {
      localStorage.setItem('homty_v4_layouts', JSON.stringify(layouts));
    }
  }, [data, layouts]);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData(prev => ({ ...prev, logoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const saveCurrentLayout = () => {
    if (!newLayoutName) return alert("Nommez votre structure.");
    const layout: SignatureLayout = {
      ...data,
      id: `lay-${Date.now()}`,
      name: newLayoutName
    };
    setLayouts([...layouts, layout]);
    setNewLayoutName('');
    alert("Structure 'gelée' dans le Laboratoire !");
  };

  const applyLayout = (l: SignatureLayout) => {
    setData(prev => ({
      ...prev,
      ...l,
      id: prev.id, // Garder l'id du profil
      profileName: prev.profileName,
      fullName: prev.fullName,
      jobTitle: prev.jobTitle,
      email: prev.email,
      phoneWork: prev.phoneWork,
      phoneMobile: prev.phoneMobile,
      address: prev.address,
      website: prev.website,
      footerServices: prev.footerServices,
      logoUrl: prev.logoUrl,
      socialLinks: prev.socialLinks
    }));
    alert("Structure appliquée !");
  };

  const createNewProfile = () => {
    const newProfile = { ...data, id: `p-${Date.now()}`, profileName: `Nouveau Profil ${profiles.length + 1}` };
    setProfiles([...profiles, newProfile]);
    setData(newProfile);
    setActiveTab('content');
  };

  const copySignature = () => {
    const container = document.getElementById('signature-container');
    if (container) {
      const range = document.createRange();
      range.selectNode(container);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      alert('✨ Signature prête à être collée !');
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
    <div className="h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-emerald-200">H</div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Studio Laboratory <span className="text-emerald-500 font-black">v4</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={createNewProfile} className="text-xs font-black uppercase text-slate-400 hover:text-emerald-600">+ Nouveau Profil</button>
           <button onClick={copySignature} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-emerald-600/20 active:scale-95">Copier la Signature</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* PREVIEW CONTAINER */}
        <div className="flex-1 bg-slate-100 flex flex-col items-center justify-center overflow-hidden relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-white flex items-center gap-6">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Visualisation Dynamique</span>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('desktop')} className={`px-4 py-1 rounded-md text-[9px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Desktop</button>
                <button onClick={() => setViewMode('mobile')} className={`px-4 py-1 rounded-md text-[9px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Mobile</button>
             </div>
          </div>

          <div className="w-full h-full flex items-center justify-center p-8 overflow-hidden">
            <div 
              className={`bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden flex flex-col transition-all duration-700 ${viewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-[380px]'}`}
              style={{ transform: `scale(${previewScale})`, transformOrigin: 'center' }}
            >
              <div className="bg-[#f8fafc] px-10 py-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400/30" />
                <div className="w-3 h-3 rounded-full bg-amber-400/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/30" />
                <div className="ml-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">{data.profileName}</div>
              </div>
              <div className="flex-1 flex items-center justify-center bg-white min-h-[450px] overflow-hidden p-12">
                <SignaturePreview data={data} />
              </div>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <aside className="w-[480px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl">
          <nav className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide bg-white sticky top-0 z-10">
            {[
              { id: 'content', label: '1. Infos' },
              { id: 'labo', label: '2. Laboratoire' },
              { id: 'design', label: '3. Style' },
              { id: 'move', label: '4. Positions' },
              { id: 'social', label: '5. Social' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[100px] py-5 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600" />}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
            
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Profil de signature actif</label>
                  <select 
                    value={data.id} 
                    onChange={(e) => {
                      const sel = profiles.find(p => p.id === e.target.value);
                      if (sel) setData(sel);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.profileName}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'profileName', label: 'Nom Interne' },
                    { id: 'fullName', label: 'Nom Complet', showId: 'showFullName' },
                    { id: 'jobTitle', label: 'Poste / Titre', showId: 'showJobTitle' },
                    { id: 'email', label: 'E-mail', showId: 'showEmail' },
                    { id: 'phoneMobile', label: 'Mobile', showId: 'showPhoneMobile' },
                    { id: 'phoneWork', label: 'Fixe', showId: 'showPhoneWork' },
                    { id: 'address', label: 'Adresse', showId: 'showAddress', multi: true },
                    { id: 'website', label: 'Site Web', showId: 'showWebsite' },
                    { id: 'footerServices', label: 'Services Slogan', multi: true },
                  ].map(f => (
                    <div key={f.id}>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                        {f.showId && <input type="checkbox" name={f.showId} checked={(data as any)[f.showId]} onChange={handleInputChange} className="w-4 h-4 accent-emerald-600 rounded" />}
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
                <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl space-y-4">
                  <h3 className="text-sm font-black uppercase text-emerald-400 tracking-widest">Enregistrer la Structure</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Gelez tous les réglages actuels (couleurs, espacements, positions X/Y) pour les réutiliser.</p>
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text" 
                      placeholder="Nom du Layout (ex: Homty Black)" 
                      value={newLayoutName}
                      onChange={(e) => setNewLayoutName(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={saveCurrentLayout} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all">GELER</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Mes Structures Figées</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {layouts.map(l => (
                      <div key={l.id} className="group flex items-center justify-between bg-white border border-slate-100 p-5 rounded-3xl hover:border-emerald-300 transition-all shadow-sm">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-800">{l.name}</span>
                           <span className="text-[8px] text-slate-400 uppercase font-black">{l.layoutMode} • {l.accentColor}</span>
                        </div>
                        <button onClick={() => applyLayout(l)} className="bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Appliquer</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 text-center tracking-widest">Accent</label>
                    <input type="color" name="accentColor" value={data.accentColor} onChange={handleInputChange} className="w-full h-12 rounded-xl cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 text-center tracking-widest">Ligne</label>
                    <input type="color" name="dividerColor" value={data.dividerColor} onChange={handleInputChange} className="w-full h-12 rounded-xl cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                </div>

                <div className="space-y-5">
                   {[
                     { id: 'logoWidth', label: 'Largeur Logo', min: 40, max: 350 },
                     { id: 'nameFontSize', label: 'Taille Nom', min: 14, max: 48 },
                     { id: 'jobTitleFontSize', label: 'Taille Titre', min: 8, max: 24 },
                     { id: 'contactFontSize', label: 'Taille Infos', min: 8, max: 20 },
                     { id: 'footerFontSize', label: 'Taille Slogan', min: 6, max: 20 },
                     { id: 'dividerHeight', label: 'Hauteur Ligne', min: 10, max: 300 },
                     { id: 'columnGap', label: 'Espacement Central', min: 0, max: 150 },
                     { id: 'verticalSpacing', label: 'Espacement Lignes', min: 0, max: 30 },
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
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Layout de Base</h4>
                   <div className="grid grid-cols-4 gap-2">
                    {['logo-left', 'logo-right', 'logo-top', 'logo-bottom'].map(mode => (
                      <button key={mode} onClick={() => setData(prev => ({ ...prev, layoutMode: mode as any }))} className={`py-3 rounded-xl border transition-all text-[8px] font-black uppercase ${data.layoutMode === mode ? 'bg-emerald-500 border-emerald-500 text-slate-900 shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}>{mode.replace('logo-', '')}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Fond du Logo</label>
                    <input type="checkbox" name="showLogoBackground" checked={data.showLogoBackground} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                  </div>
                  <input type="color" name="logoBgColor" value={data.logoBgColor} onChange={handleInputChange} className="w-full h-8 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 hover:border-emerald-600 transition-all">Télécharger Logo</button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            )}

            {activeTab === 'move' && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {[
                  { label: 'Bloc Logo', x: 'logoOffsetX', y: 'logoOffsetY' },
                  { label: 'Bloc Nom & Titre', x: 'nameOffsetX', y: 'nameOffsetY' },
                  { label: 'Bloc Coordonnées', x: 'contactOffsetX', y: 'contactOffsetY' },
                ].map(block => (
                  <div key={block.label} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
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

                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Précision des Alignements</h4>
                  {[
                    { label: 'Logo & Slogan', name: 'logoAlign', current: data.logoAlign },
                    { label: 'Nom & Titre', name: 'nameTitleAlign', current: data.nameTitleAlign },
                    { label: 'Coordonnées', name: 'contactInfoAlign', current: data.contactInfoAlign },
                  ].map(align => (
                    <div key={align.name} className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">{align.label}</span>
                      <div className="flex gap-1">
                        <AlignmentIcon type="left" name={align.name} current={align.current} />
                        <AlignmentIcon type="center" name={align.name} current={align.current} />
                        <AlignmentIcon type="right" name={align.name} current={align.current} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between bg-emerald-50 p-5 rounded-[28px]">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-widest">Iconographie Sociale</span>
                  <input type="checkbox" name="showSocialIcons" checked={data.showSocialIcons} onChange={handleInputChange} className="w-6 h-6 accent-emerald-600 cursor-pointer" />
                </div>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
                    <div key={s}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{s}</label>
                      <input type="text" name={`social_${s}`} value={(data.socialLinks as any)[s] || ''} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="URL complète..." />
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
