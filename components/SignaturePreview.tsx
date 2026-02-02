
import React from 'react';
import { SignatureData } from '../types';
import { EmailIcon, PhoneIcon, MobileIcon, MapPinIcon, FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from './Icons';

interface Props {
  data: SignatureData;
}

const SignaturePreview: React.FC<Props> = ({ data }) => {
  const formatTel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;
  const formatUrl = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const getFlexAlign = (align: string) => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'flex-end';
    return 'flex-start';
  };

  const isVerticalMode = data.layoutMode === 'logo-top' || data.layoutMode === 'logo-bottom';

  // --- BLOC LOGO & SLOGAN ---
  const LogoPart = (
    <div style={{ 
      transform: `translate(${data.logoOffsetX}px, ${data.logoOffsetY}px)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: getFlexAlign(data.logoAlign),
      textAlign: data.logoAlign as any,
      flexShrink: 0,
      width: `${data.logoWidth + (data.showLogoBackground ? 30 : 10)}px`,
    }}>
      <div style={{ 
        backgroundColor: data.showLogoBackground ? data.logoBgColor : 'transparent',
        width: `${data.logoWidth}px`,
        borderRadius: data.showLogoBackground ? '8px' : '0px',
        padding: data.showLogoBackground ? '12px' : '0px',
        marginBottom: `${data.logoFooterGap}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {data.logoUrl ? (
          <img src={data.logoUrl} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
        ) : (
          <div style={{ color: '#ccc', fontSize: '12px', fontWeight: 'bold' }}>LOGO</div>
        )}
      </div>
      
      <div style={{ 
        color: data.primaryTextColor,
        fontSize: `${data.footerFontSize}px`,
        width: '100%',
        textAlign: data.footerTextAlign as any,
        fontWeight: '700',
        lineHeight: '1.2',
        fontFamily: "'Inter', sans-serif"
      }}>
        {data.footerServices.split('-').map((service, idx, arr) => (
          <React.Fragment key={idx}>
            <span style={{ whiteSpace: 'nowrap' }}>{service.trim()}</span>
            {idx < arr.length - 1 && (
              <span style={{ color: data.accentColor, margin: '0 4px' }}>-</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // --- BLOC INFORMATIONS ---
  const InfoPart = (
    <div style={{ 
      transform: `translate(${data.contactOffsetX}px, ${data.contactOffsetY}px)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isVerticalMode ? 'flex-start' : data.contactVerticalAlign,
      fontFamily: "'Inter', sans-serif",
      minWidth: '220px',
      flexShrink: 0,
    }}>
      {/* Nom & Titre */}
      <div style={{ 
        transform: `translate(${data.nameOffsetX}px, ${data.nameOffsetY}px)`,
        marginBottom: `${data.verticalSpacing}px`,
        textAlign: data.nameTitleAlign as any,
      }}>
        {data.showFullName && (
          <div style={{ 
            color: data.primaryTextColor, 
            fontSize: `${data.nameFontSize}px`, 
            fontWeight: '800', 
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            {data.fullName}
          </div>
        )}
        {data.showJobTitle && (
          <div style={{ 
            color: data.primaryTextColor, 
            fontSize: `${data.jobTitleFontSize}px`, 
            opacity: 0.7, 
            fontWeight: '500',
            marginTop: '2px'
          }}>
            {data.jobTitle}
          </div>
        )}
      </div>

      {/* Coordonnées */}
      <div style={{ textAlign: data.contactInfoAlign as any }}>
        {data.showEmail && data.email && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <EmailIcon color={data.accentColor} size={data.iconSize} />
            <a href={`mailto:${data.email}`} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600', lineHeight: '1' }}>{data.email}</a>
          </div>
        )}
        {data.showPhoneWork && data.phoneWork && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <PhoneIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneWork)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600', lineHeight: '1' }}>{data.phoneWork}</a>
          </div>
        )}
        {data.showPhoneMobile && data.phoneMobile && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <MobileIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneMobile)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600', lineHeight: '1' }}>{data.phoneMobile}</a>
          </div>
        )}
        {data.showAddress && data.address && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'flex-start', gap: '8px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <div style={{ marginTop: '2px' }}><MapPinIcon color={data.accentColor} size={data.iconSize} /></div>
            <div style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, lineHeight: '1.2', fontWeight: '600' }}>
              {data.address.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
        )}
      </div>

      {/* Website & Social */}
      <div style={{ 
        transform: `translate(${data.websiteOffsetX}px, ${data.websiteOffsetY}px)`,
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: getFlexAlign(data.websiteAlign),
        textAlign: data.websiteAlign as any
      }}>
        {data.showWebsite && data.website && (
          <div style={{ marginBottom: '6px' }}>
            <a href={formatUrl(data.website)} target="_blank" rel="noopener noreferrer" style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.6}px`, fontWeight: '900', textDecoration: 'none', letterSpacing: '-0.01em', lineHeight: '1' }}>{data.website}</a>
          </div>
        )}
        
        {data.showSocialIcons && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: getFlexAlign(data.websiteAlign) }}>
            {data.socialLinks.facebook && <a href={formatUrl(data.socialLinks.facebook)}><FacebookIcon color={data.accentColor} size={data.iconSize} /></a>}
            {data.socialLinks.instagram && <a href={formatUrl(data.socialLinks.instagram)}><InstagramIcon color={data.accentColor} size={data.iconSize} /></a>}
            {data.socialLinks.linkedin && <a href={formatUrl(data.socialLinks.linkedin)}><LinkedinIcon color={data.accentColor} size={data.iconSize} /></a>}
            {data.socialLinks.twitter && <a href={formatUrl(data.socialLinks.twitter)}><TwitterIcon color={data.accentColor} size={data.iconSize} /></a>}
          </div>
        )}
      </div>
    </div>
  );

  const getFlexDirection = () => {
    if (data.layoutMode === 'logo-left') return 'row';
    if (data.layoutMode === 'logo-right') return 'row-reverse';
    if (data.layoutMode === 'logo-top') return 'column';
    if (data.layoutMode === 'logo-bottom') return 'column-reverse';
    return 'row';
  };

  return (
    <div id="signature-container" style={{ 
      backgroundColor: '#ffffff', 
      padding: '40px', 
      display: 'inline-block',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: getFlexDirection(),
        alignItems: 'center',
        gap: isVerticalMode ? '24px' : `${data.columnGap}px`,
        flexWrap: 'nowrap', // Force side-by-side
        minWidth: isVerticalMode ? '0' : '400px'
      }}>
        {/* LOGO */}
        <div style={{ flexShrink: 0 }}>
          {LogoPart}
        </div>

        {/* DIVIDER */}
        {data.dividerWidth > 0 && (
          <div style={{ 
            flexShrink: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isVerticalMode ? '0' : '0'
          }}>
            <div style={{ 
              width: isVerticalMode ? `${data.dividerHeight}px` : `${data.dividerWidth}px`, 
              height: isVerticalMode ? `${data.dividerWidth}px` : `${data.dividerHeight}px`, 
              backgroundColor: data.dividerColor,
              borderRadius: '2px',
              opacity: 0.8
            }} />
          </div>
        )}

        {/* INFOS */}
        <div style={{ flexShrink: 0 }}>
          {InfoPart}
        </div>
      </div>
    </div>
  );
};

export default SignaturePreview;
