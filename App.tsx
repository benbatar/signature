
import React, { useState, useRef, useEffect } from 'react';
import { SignatureData, SocialLinks } from './types';
import SignaturePreview from './components/SignaturePreview';

const DEFAULT_DATA: SignatureData = {
  id: 'default',
  profileName: 'Signature Standard',
  fullName: 'Tarek Ben Bachir',
  jobTitle: 'Agent immobilier - IPI 511 438',
  email: 'trk@homty.be',
  phoneWork: '+32 (2) 844 23 03',
  phoneMobile: '+32 (0) 484 86 59 54',
  address: 'Avenue Louise 390 (bte13)\n1050 Ixelles - Bruxelles',
  website: 'Homty.be',
  logoUrl: 'https://homty.be/wp-content/uploads/2021/04/Logo-Homty-White.png',
  accentColor: '#16a34a',
  dividerColor: '#16a34a',
  primaryTextColor: '#1e293b',
  logoBgColor: '#1e293b',
  footerServices: 'Vente - Location - Gestion - Syndic',
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
  showFullName: true,
  showJobTitle: true,
  showEmail: true,
  showPhoneWork: true,
  showPhoneMobile: true,
  showAddress: true,
  showWebsite: true,
  showSocialIcons: true,
  nameTitleAlign: 'left',
  contactInfoAlign: 'left',
  websiteAlign: 'left',
  footerTextAlign: 'left',
  logoAlign: 'left',
  layoutMode: 'logo-left',
  dividerStyle: 'solid',
  socialLinks: {
    facebook: 'https://facebook.com/homty',
    linkedin: 'https://linkedin.com/company/homty',
    instagram: 'https://instagram.com/homty'
  }
};

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'structure' | 'move' | 'social'>('content');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewScale, setPreviewScale] = useState(1);
  const [profiles, setProfiles] = useState<SignatureData[]>([]);
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);

  // Initialisation : Charger les profils depuis localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('homty_signatures');
    const lastActiveId = localStorage.getItem('homty_active_id');
    
    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      setProfiles(parsed);
      if (lastActiveId) {
        const active = parsed.find((p: SignatureData) => p.id === lastActiveId);
        if (active) setData(active);
      } else if (parsed.length > 0) {
        setData(parsed[0]);
      }
    } else {
      // Premier démarrage
      const initial = [DEFAULT_DATA];
      setProfiles(initial);
      localStorage.setItem('homty_signatures', JSON.stringify(initial));
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        const scale = Math.min(1, (window.innerWidth - 40) / 600);
        setPreviewScale(scale);
      } else {
        setPreviewScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sauvegarde automatique à chaque changement
  useEffect(() => {
    if (profiles.length > 0) {
      const updatedProfiles = profiles.map(p => p.id === data.id ? data : p);
      localStorage.setItem('homty_signatures', JSON.stringify(updatedProfiles));
      localStorage.setItem('homty_active_id', data.id);
    }
  }, [data, profiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.split('_')[1] as keyof SocialLinks;
      setData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [socialKey]: value } }));
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

  // Gestion des profils
  const createNewProfile = () => {
    const newId = Date.now().toString();
    const newProfile = { ...DEFAULT_DATA, id: newId, profileName: `Nouvelle Signature ${profiles.length + 1}` };
    const newProfiles = [...profiles, newProfile];
    setProfiles(newProfiles);
    setData(newProfile);
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return alert("Vous devez garder au moins une signature.");
    if (window.confirm("Supprimer cette signature ?")) {
      const filtered = profiles.filter(p => p.id !== id);
      setProfiles(filtered);
      setData(filtered[0]);
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {icons[type]}
        </svg>
      </button>
    );
  };

  const copySignature = () => {
    const container = document.getElementById('signature-container');
    if (container) {
      const range = document.createRange();
      range.selectNode(container);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      try {
        document.execCommand('copy');
        alert('✨ Signature copiée !');
      } catch (err) {
        alert('❌ Erreur lors de la copie');
      }
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      <header className="h-14 lg:h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center text-white font-black text-lg lg:text-xl italic shadow-lg shadow-emerald-200/50">H</div>
          <h1 className="text-sm lg:text-lg font-bold text-slate-800 tracking-tight hidden sm:block">Studio Signature <span className="text-emerald-500 font-black">2.5</span></h1>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={copySignature}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 lg:px-8 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            Copier
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="order-1 lg:order-2 flex-1 bg-[#f1f5f9] flex flex-col items-center justify-center overflow-hidden relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] lg:[background-size:24px_24px] min-h-[35vh] lg:min-h-0 border-b lg:border-none border-slate-200">
          <div className="absolute top-4 lg:top-8 left-1/2 -translate-x-1/2 z-40 hidden sm:block">
             <div className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Preview</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  <button onClick={() => setViewMode('desktop')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Desktop</button>
                  <button onClick={() => setViewMode('mobile')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Mobile</button>
                </div>
             </div>
          </div>

          <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-3xl lg:rounded-[56px] shadow-2xl transition-all duration-500 border border-white overflow-hidden flex flex-col mx-auto ${viewMode === 'desktop' ? 'w-full max-w-4xl' : 'w-[320px] lg:w-[400px]'}`}
              style={{ transform: `scale(${previewScale})`, transformOrigin: 'center' }}
            >
              <div className="bg-[#f8fafc] px-6 lg:px-10 py-4 lg:py-6 border-b border-slate-100 flex items-center gap-2 lg:gap-3 shrink-0">
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-rose-400/50" />
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-amber-400/50" />
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-emerald-400/50" />
              </div>
              <div className="flex-1 flex items-center justify-center bg-white min-h-[180px] lg:min-h-[400px] overflow-hidden p-4 lg:p-8">
                <SignaturePreview data={data} />
              </div>
            </div>
          </div>
        </div>

        <aside className="order-2 lg:order-1 w-full lg:w-[420px] xl:w-[480px] bg-white lg:border-r border-slate-200 flex flex-col shrink-0 z-50 h-[55vh] lg:h-full shadow-[0_-8px_30px_rgba(0,0,0,0.05)] lg:shadow-none">
          <nav className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide bg-white sticky top-0 z-10">
            {[
              { id: 'content', label: 'Infos' },
              { id: 'structure', label: 'Layout' },
              { id: 'move', label: 'Position' },
              { id: 'design', label: 'Style' },
              { id: 'social', label: 'Social' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[80px] py-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-8 scrollbar-hide pb-20 lg:pb-6">
            {activeTab === 'content' && (
              <div className="space-y-8 animate-in slide-in-from-left-2 duration-300">
                {/* GESTION DES PROFILS */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mes Signatures</label>
                      <button onClick={createNewProfile} className="text-[10px] font-black text-emerald-600 uppercase hover:bg-emerald-100 px-2 py-1 rounded transition-colors">+ Nouveau</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {profiles.map(p => (
                        <div key={p.id} className="relative group">
                          <button 
                            onClick={() => setData(p)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${data.id === p.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
                          >
                            {p.profileName}
                          </button>
                          {profiles.length > 1 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }}
                              className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                   </div>
                   <div className="pt-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Nom du profil actuel</label>
                      <input 
                        type="text" 
                        name="profileName" 
                        value={data.profileName} 
                        onChange={handleInputChange} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'fullName', label: 'Nom Complet', showId: 'showFullName' },
                    { id: 'jobTitle', label: 'Titre / Fonction', showId: 'showJobTitle' },
                    { id: 'email', label: 'Email Professionnel', showId: 'showEmail' },
                    { id: 'phoneMobile', label: 'Téléphone Mobile', showId: 'showPhoneMobile' },
                    { id: 'phoneWork', label: 'Téléphone Fixe', showId: 'showPhoneWork' },
                    { id: 'address', label: 'Adresse Physique', showId: 'showAddress', multi: true },
                    { id: 'footerServices', label: 'Slogan / Services bas', multi: true },
                  ].map(f => (
                    <div key={f.id}>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                        {f.showId && <input type="checkbox" name={f.showId} checked={(data as any)[f.showId]} onChange={handleInputChange} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />}
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

            {activeTab === 'structure' && (
              <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Disposition du Logo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'logo-left', label: 'Gauche', icon: '←' },
                      { id: 'logo-right', label: 'Droite', icon: '→' },
                      { id: 'logo-top', label: 'Haut', icon: '↑' },
                      { id: 'logo-bottom', label: 'Bas', icon: '↓' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setData(prev => ({ ...prev, layoutMode: mode.id as any }))}
                        className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          data.layoutMode === mode.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-50 text-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-lg font-bold">{mode.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                   {[
                     { id: 'columnGap', label: 'Espacement Logo/Bloc', min: 0, max: 150 },
                     { id: 'dividerWidth', label: 'Épaisseur Ligne', min: 0, max: 10 },
                     { id: 'dividerHeight', label: 'Taille Ligne (Px)', min: 10, max: 400 },
                   ].map(s => (
                     <div key={s.id}>
                        <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</label>
                          <span className="text-[10px] font-black text-emerald-600">{ (data as any)[s.id] }px</span>
                        </div>
                        <input type="range" name={s.id} min={s.min} max={s.max} value={(data as any)[s.id]} onChange={handleInputChange} className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer" />
                     </div>
                   ))}
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Alignements</h4>
                  {[
                    { label: 'Logo & Pied', name: 'logoAlign', current: data.logoAlign },
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

            {activeTab === 'move' && (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="space-y-6">
                  {[
                    { label: 'Bloc Logo', x: 'logoOffsetX', y: 'logoOffsetY' },
                    { label: 'Bloc Nom & Titre', x: 'nameOffsetX', y: 'nameOffsetY' },
                    { label: 'Bloc Coordonnées', x: 'contactOffsetX', y: 'contactOffsetY' },
                  ].map(block => (
                    <div key={block.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.label}</p>
                      <div className="space-y-4">
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
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Couleur Accent</label>
                    <input type="color" name="accentColor" value={data.accentColor} onChange={handleInputChange} className="w-full h-10 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Couleur Ligne</label>
                    <input type="color" name="dividerColor" value={data.dividerColor} onChange={handleInputChange} className="w-full h-10 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                </div>

                <div className="space-y-5">
                   {[
                     { id: 'logoWidth', label: 'Largeur Logo', min: 40, max: 400 },
                     { id: 'nameFontSize', label: 'Taille Nom', min: 14, max: 50 },
                     { id: 'contactFontSize', label: 'Taille Infos', min: 8, max: 25 },
                     { id: 'verticalSpacing', label: 'Espacement Lignes', min: 0, max: 40 },
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
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Fond du Logo</label>
                    <input type="checkbox" name="showLogoBackground" checked={data.showLogoBackground} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                  </div>
                  <input type="color" name="logoBgColor" value={data.logoBgColor} onChange={handleInputChange} className="w-full h-8 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm">Uploader un nouveau logo</button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 duration-300">
                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-widest">Icônes Sociales</span>
                  <input type="checkbox" name="showSocialIcons" checked={data.showSocialIcons} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                </div>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
                    <div key={s}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">{s}</label>
                      <input type="text" name={`social_${s}`} value={(data.socialLinks as any)[s] || ''} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="Lien profil" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
      <div className="lg:hidden h-10 bg-white border-t border-slate-100 flex items-center justify-center px-4 z-50">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Homty Studio v2.5 Mobile</span>
      </div>
    </div>
  );
};

export default App;
