
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

  // Styles de base pour les blocs mobiles
  const blockStyle = (x: number, y: number) => ({
    transform: `translate(${x}px, ${y}px)`,
    transition: 'none', // Pour une réponse immédiate aux sliders
  });

  const isVertical = data.layoutMode === 'logo-top' || data.layoutMode === 'logo-bottom';

  // --- COMPOSANTS INTERNES ---

  const LogoBlock = (
    <div style={{ 
      ...blockStyle(data.logoOffsetX, data.logoOffsetY),
      display: 'flex',
      flexDirection: 'column',
      alignItems: getFlexAlign(data.logoAlign),
      textAlign: data.logoAlign as any,
    }}>
      <div style={{ 
        backgroundColor: data.showLogoBackground ? data.logoBgColor : 'transparent',
        width: `${data.logoWidth}px`,
        borderRadius: data.showLogoBackground ? '12px' : '0px',
        padding: data.showLogoBackground ? '15px' : '0px',
        marginBottom: `${data.logoFooterGap}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {data.logoUrl ? (
          <img 
            src={data.logoUrl} 
            alt="Logo" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        ) : (
          <div style={{ color: '#ccc', fontSize: '12px', fontWeight: 'bold' }}>LOGO</div>
        )}
      </div>
      
      {/* Footer Services */}
      <div style={{ 
        color: data.primaryTextColor,
        fontSize: `${data.footerFontSize}px`,
        width: `${data.logoWidth + (data.showLogoBackground ? 30 : 0)}px`,
        textAlign: data.footerTextAlign as any,
        fontWeight: '700',
        lineHeight: '1.4',
        fontFamily: "'Inter', sans-serif"
      }}>
        {data.footerServices.split('-').map((service, idx, arr) => (
          <React.Fragment key={idx}>
            <span style={{ whiteSpace: 'nowrap' }}>{service.trim()}</span>
            {idx < arr.length - 1 && (
              <span style={{ color: data.accentColor, margin: '0 5px' }}>-</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const InfoBlock = (
    <div style={{ 
      ...blockStyle(data.contactOffsetX, data.contactOffsetY),
      display: 'flex',
      flexDirection: 'column',
      alignItems: getFlexAlign(data.contactInfoAlign),
      justifyContent: isVertical ? 'flex-start' : data.contactVerticalAlign,
      textAlign: data.contactInfoAlign as any,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Nom & Titre */}
      <div style={{ 
        ...blockStyle(data.nameOffsetX, data.nameOffsetY),
        marginBottom: `${data.verticalSpacing}px`,
        textAlign: data.nameTitleAlign as any,
        width: '100%'
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${data.verticalSpacing}px`, width: '100%' }}>
        {data.showEmail && data.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <EmailIcon color={data.accentColor} size={data.iconSize} />
            <a href={`mailto:${data.email}`} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.email}</a>
          </div>
        )}
        {data.showPhoneWork && data.phoneWork && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <PhoneIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneWork)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.phoneWork}</a>
          </div>
        )}
        {data.showPhoneMobile && data.phoneMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <MobileIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneMobile)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.phoneMobile}</a>
          </div>
        )}
        {data.showAddress && data.address && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', justifyContent: getFlexAlign(data.contactInfoAlign) }}>
            <div style={{ marginTop: '2px' }}><MapPinIcon color={data.accentColor} size={data.iconSize} /></div>
            <div style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, lineHeight: '1.4', fontWeight: '600' }}>
              {data.address.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
        )}
      </div>

      {/* Website & Social */}
      <div style={{ 
        ...blockStyle(data.websiteOffsetX, data.websiteOffsetY),
        marginTop: '15px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: getFlexAlign(data.websiteAlign)
      }}>
        {data.showWebsite && data.website && (
          <div style={{ marginBottom: '10px' }}>
            <a href={formatUrl(data.website)} target="_blank" rel="noopener noreferrer" style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.7}px`, fontWeight: '900', textDecoration: 'none', letterSpacing: '-0.01em' }}>{data.website}</a>
          </div>
        )}
        
        {data.showSocialIcons && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {data.socialLinks.facebook && <a href={formatUrl(data.socialLinks.facebook)}><FacebookIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
            {data.socialLinks.instagram && <a href={formatUrl(data.socialLinks.instagram)}><InstagramIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
            {data.socialLinks.linkedin && <a href={formatUrl(data.socialLinks.linkedin)}><LinkedinIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
            {data.socialLinks.twitter && <a href={formatUrl(data.socialLinks.twitter)}><TwitterIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
          </div>
        )}
      </div>
    </div>
  );

  // --- STRUCTURE FINALE ---

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
        alignItems: isVertical ? 'center' : 'stretch',
        gap: isVertical ? '0px' : `${data.columnGap}px`
      }}>
        {LogoBlock}

        {data.dividerWidth > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isVertical ? '20px 0' : '0'
          }}>
            <div style={{ 
              width: isVertical ? `${data.dividerHeight}px` : `${data.dividerWidth}px`, 
              height: isVertical ? `${data.dividerWidth}px` : `${data.dividerHeight}px`, 
              backgroundColor: data.dividerColor,
              borderRadius: '2px'
            }} />
          </div>
        )}

        {InfoBlock}
      </div>
    </div>
  );
};

export default SignaturePreview;
