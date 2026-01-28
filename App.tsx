
import React, { useState, useRef } from 'react';
import { SignatureData, SocialLinks, PresetType } from './types';
import SignaturePreview from './components/SignaturePreview';

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'structure' | 'move' | 'social'>('content');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const [data, setData] = useState<SignatureData>({
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
  });

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

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-emerald-200/50">H</div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Studio Signature Pro <span className="text-emerald-500 font-black">2.5</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const container = document.getElementById('signature-container');
              if (container) {
                const range = document.createRange();
                range.selectNode(container);
                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);
                document.execCommand('copy');
                alert('✨ Signature prête à être collée !');
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-emerald-600/20 active:scale-95 px-6"
          >
            Copier la Signature
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-[480px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
            {[
              { id: 'content', label: 'Infos' },
              { id: 'structure', label: 'Layout' },
              { id: 'move', label: 'Position X/Y' },
              { id: 'design', label: 'Style' },
              { id: 'social', label: 'Social' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                {[
                  { id: 'fullName', label: 'Nom', showId: 'showFullName' },
                  { id: 'jobTitle', label: 'Titre', showId: 'showJobTitle' },
                  { id: 'email', label: 'Email', showId: 'showEmail' },
                  { id: 'phoneMobile', label: 'Mobile', showId: 'showPhoneMobile' },
                  { id: 'phoneWork', label: 'Fixe', showId: 'showPhoneWork' },
                  { id: 'address', label: 'Adresse', showId: 'showAddress', multi: true },
                  { id: 'footerServices', label: 'Services (Bas)', multi: true },
                ].map(f => (
                  <div key={f.id}>
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                      {f.showId && <input type="checkbox" name={f.showId} checked={(data as any)[f.showId]} onChange={handleInputChange} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />}
                    </div>
                    {f.multi ? (
                      <textarea name={f.id} value={(data as any)[f.id]} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" rows={2} />
                    ) : (
                      <input type="text" name={f.id} value={(data as any)[f.id]} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'structure' && (
              <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Structure Globale (Logo)</label>
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

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Alignements Internes</h4>
                  {[
                    { label: 'Logo & Pied', name: 'logoAlign', current: data.logoAlign },
                    { label: 'Nom & Titre', name: 'nameTitleAlign', current: data.nameTitleAlign },
                    { label: 'Informations', name: 'contactInfoAlign', current: data.contactInfoAlign },
                    { label: 'Site Web', name: 'websiteAlign', current: data.websiteAlign },
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

                <div className="space-y-5">
                   {[
                     { id: 'columnGap', label: 'Espacement Logo/Bloc', min: 0, max: 200 },
                     { id: 'dividerWidth', label: 'Épaisseur Ligne', min: 0, max: 10 },
                     { id: 'dividerHeight', label: 'Dimension Ligne (Px)', min: 10, max: 500 },
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
              </div>
            )}

            {activeTab === 'move' && (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <p className="text-[10px] font-black text-emerald-700 leading-relaxed uppercase tracking-widest mb-1 italic">Déplacement Libre</p>
                   <p className="text-[10px] text-emerald-600 leading-relaxed">
                     Ajustez les blocs indépendamment sur les axes X et Y pour un équilibre visuel parfait.
                   </p>
                </div>
                
                <div className="space-y-8">
                  {[
                    { label: 'Bloc Logo', x: 'logoOffsetX', y: 'logoOffsetY' },
                    { label: 'Bloc Nom & Titre', x: 'nameOffsetX', y: 'nameOffsetY' },
                    { label: 'Bloc Coordonnées', x: 'contactOffsetX', y: 'contactOffsetY' },
                    { label: 'Bloc Web & Réseaux', x: 'websiteOffsetX', y: 'websiteOffsetY' },
                  ].map(block => (
                    <div key={block.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{block.label}</p>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Axe X</span>
                            <span className="text-[9px] font-black text-emerald-600">{(data as any)[block.x]}px</span>
                          </div>
                          <input type="range" name={block.x} min={-200} max={200} value={(data as any)[block.x]} onChange={handleInputChange} className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Axe Y</span>
                            <span className="text-[9px] font-black text-emerald-600">{(data as any)[block.y]}px</span>
                          </div>
                          <input type="range" name={block.y} min={-150} max={150} value={(data as any)[block.y]} onChange={handleInputChange} className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setData(prev => ({ ...prev, nameOffsetX: 0, nameOffsetY: 0, contactOffsetX: 0, contactOffsetY: 0, logoOffsetX: 0, logoOffsetY: 0, websiteOffsetX: 0, websiteOffsetY: 0 }))}
                  className="w-full py-4 text-[10px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                >
                  Réinitialiser Positions
                </button>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Accent</label>
                    <input type="color" name="accentColor" value={data.accentColor} onChange={handleInputChange} className="w-full h-10 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ligne</label>
                    <input type="color" name="dividerColor" value={data.dividerColor} onChange={handleInputChange} className="w-full h-10 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  </div>
                </div>

                <div className="space-y-5">
                   {[
                     { id: 'logoWidth', label: 'Largeur Logo', min: 40, max: 500 },
                     { id: 'nameFontSize', label: 'Taille Nom', min: 14, max: 60 },
                     { id: 'contactFontSize', label: 'Taille Contact', min: 8, max: 30 },
                     { id: 'verticalSpacing', label: 'Espacement Lignes', min: 0, max: 50 },
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
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Fond Logo</label>
                    <input type="checkbox" name="showLogoBackground" checked={data.showLogoBackground} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                  </div>
                  <input type="color" name="logoBgColor" value={data.logoBgColor} onChange={handleInputChange} className="w-full h-8 rounded-lg cursor-pointer p-0 border-none bg-transparent" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm">Uploader Logo</button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 duration-300">
                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl shadow-inner">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-widest">Réseaux Sociaux</span>
                  <input type="checkbox" name="showSocialIcons" checked={data.showSocialIcons} onChange={handleInputChange} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                </div>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
                    <div key={s}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">{s}</label>
                      <input type="text" name={`social_${s}`} value={(data.socialLinks as any)[s] || ''} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm" placeholder="URL" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 bg-[#f1f5f9] flex flex-col items-center justify-center overflow-auto relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] p-6 lg:p-12">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
             <div className="px-6 py-2.5 bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl border border-white flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aperçu Rendu</span>
                <div className="flex bg-slate-200/50 p-1 rounded-xl shadow-inner">
                  <button onClick={() => setViewMode('desktop')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'desktop' ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Desktop</button>
                  <button onClick={() => setViewMode('mobile')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'mobile' ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400'}`}>Mobile</button>
                </div>
             </div>
          </div>

          <div className="w-full flex-1 flex items-center justify-center">
            <div className={`bg-white rounded-[56px] shadow-[0_64px_120px_-30px_rgba(15,23,42,0.15)] transition-all duration-700 border border-white overflow-hidden flex flex-col mx-auto ${viewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-[440px]'}`}>
              <div className="bg-[#f8fafc]/90 backdrop-blur-md px-12 py-10 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-rose-400/30 border border-rose-400/50 shadow-sm" />
                  <div className="w-4 h-4 rounded-full bg-amber-400/30 border border-amber-400/50 shadow-sm" />
                  <div className="w-4 h-4 rounded-full bg-emerald-400/30 border border-emerald-400/50 shadow-sm" />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] flex-1 text-center">Studio Signature Canvas</div>
                <div className="w-20" />
              </div>
              
              <div className="flex-1 flex items-center justify-center bg-white min-h-[400px] lg:min-h-[500px] overflow-hidden relative">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                 <div className="relative transform scale-100 lg:scale-105 transition-transform duration-500 ease-out origin-center flex items-center justify-center p-8">
                    <SignaturePreview data={data} />
                 </div>
              </div>

              <div className="bg-[#f8fafc]/95 backdrop-blur-md px-12 py-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400 tracking-[0.4em] uppercase shrink-0">
                <span>Homty Studio v2.5</span>
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-emerald-500">Live Engine Active</span>
                </div>
                <span>UHD Rendering</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 shrink-0">
             <div className="bg-white/50 backdrop-blur-2xl px-10 py-5 rounded-full border border-white shadow-xl text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] text-center transition-all hover:bg-white/80">
               Optimisé pour <span className="text-slate-800">Gmail, Outlook, Apple Mail & Thunderbird</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
