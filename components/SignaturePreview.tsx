
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

  const getAlignItems = (align: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'flex-end';
    return 'flex-start';
  };

  const isVertical = data.layoutMode === 'logo-top' || data.layoutMode === 'logo-bottom';
  
  const flexConfig = {
    'logo-left': 'flex-row',
    'logo-right': 'flex-row-reverse',
    'logo-top': 'flex-col',
    'logo-bottom': 'flex-col-reverse'
  }[data.layoutMode];

  return (
    <div 
      id="signature-container" 
      className="bg-white p-10 inline-block text-left select-all transition-all duration-300"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        margin: 'auto'
      }}
    >
      <div 
        className={`flex ${flexConfig}`} 
        style={{ 
          gap: `${data.columnGap}px`,
          alignItems: isVertical ? getAlignItems(data.logoAlign) : data.contactVerticalAlign,
          justifyContent: isVertical ? 'center' : 'flex-start'
        }}
      >
        {/* BLOC LOGO & FOOTER SERVICES */}
        <div 
          className="flex flex-col flex-shrink-0" 
          style={{ 
            alignItems: getAlignItems(data.logoAlign),
            transform: `translate(${data.logoOffsetX}px, ${data.logoOffsetY}px)`,
            zIndex: 10
          }}
        >
          <div 
            style={{ 
              backgroundColor: data.showLogoBackground ? data.logoBgColor : 'transparent',
              width: `${data.logoWidth}px`,
              marginBottom: `${data.logoFooterGap}px`,
              borderRadius: data.showLogoBackground ? '8px' : '0px',
              padding: data.showLogoBackground ? '12px' : '0px',
              display: 'flex',
              justifyContent: getAlignItems(data.logoAlign)
            }}
          >
            {data.logoUrl ? (
              <img 
                src={data.logoUrl} 
                alt="Logo" 
                style={{ 
                  width: `${data.logoWidth}px`,
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }} 
              />
            ) : (
              <div className="text-gray-300 font-bold uppercase tracking-tighter" style={{ fontSize: '10px' }}>Logo</div>
            )}
          </div>
          
          <div 
            style={{ 
              color: data.primaryTextColor,
              fontSize: `${data.footerFontSize}px`,
              width: `${data.logoWidth}px`,
              textAlign: data.footerTextAlign as any,
              fontWeight: 'bold',
              lineHeight: '1.3'
            }}
          >
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

        {/* LIGNE DE SÉPARATION HORIZONTALE */}
        {!isVertical && data.dividerWidth > 0 && (
          <div 
            style={{ 
              backgroundColor: data.dividerColor,
              width: `${data.dividerWidth}px`,
              height: `${data.dividerHeight}px`,
              alignSelf: 'center'
            }}
          />
        )}

        {/* LIGNE DE SÉPARATION VERTICALE */}
        {isVertical && data.dividerWidth > 0 && (
          <div 
            style={{ 
              backgroundColor: data.dividerColor,
              height: `${data.dividerWidth}px`,
              width: `${data.dividerHeight}px`,
              alignSelf: getAlignItems(data.logoAlign),
              margin: '10px 0'
            }}
          />
        )}

        {/* BLOC TEXTE (NOM, CONTACTS, WEB) */}
        <div 
          className="flex flex-col flex-grow" 
          style={{ 
            gap: `${data.verticalSpacing}px`, 
            alignItems: isVertical ? getAlignItems(data.contactInfoAlign) : 'stretch'
          }}
        >
          {/* Nom & Titre */}
          <div 
            style={{ 
              textAlign: data.nameTitleAlign as any,
              transform: `translate(${data.nameOffsetX}px, ${data.nameOffsetY}px)`,
              zIndex: 11
            }}
          >
            {data.showFullName && (
              <div style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize}px`, fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>
                {data.fullName}
              </div>
            )}
            {data.showJobTitle && (
              <div style={{ color: data.primaryTextColor, fontSize: `${data.jobTitleFontSize}px`, opacity: 0.85, fontWeight: 500 }}>
                {data.jobTitle}
              </div>
            )}
          </div>

          {/* Coordonnées */}
          <div 
            className="flex flex-col" 
            style={{ 
              gap: `${data.verticalSpacing}px`,
              transform: `translate(${data.contactOffsetX}px, ${data.contactOffsetY}px)`,
              zIndex: 12
            }}
          >
            {data.showEmail && data.email && (
              <div className="flex items-center gap-2" style={{ justifyContent: getAlignItems(data.contactInfoAlign) }}>
                  <EmailIcon color={data.accentColor} size={data.iconSize} />
                  <a href={`mailto:${data.email}`} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 500 }}>{data.email}</a>
              </div>
            )}
            {data.showPhoneWork && data.phoneWork && (
              <div className="flex items-center gap-2" style={{ justifyContent: getAlignItems(data.contactInfoAlign) }}>
                  <PhoneIcon color={data.accentColor} size={data.iconSize} />
                  <a href={formatTel(data.phoneWork)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 500 }}>{data.phoneWork}</a>
              </div>
            )}
            {data.showPhoneMobile && data.phoneMobile && (
              <div className="flex items-center gap-2" style={{ justifyContent: getAlignItems(data.contactInfoAlign) }}>
                  <MobileIcon color={data.accentColor} size={data.iconSize} />
                  <a href={formatTel(data.phoneMobile)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 500 }}>{data.phoneMobile}</a>
              </div>
            )}
            {data.showAddress && data.address && (
              <div className="flex items-start gap-2" style={{ justifyContent: getAlignItems(data.contactInfoAlign), textAlign: data.contactInfoAlign as any }}>
                  <div style={{ marginTop: '2px' }}><MapPinIcon color={data.accentColor} size={data.iconSize} /></div>
                  <div style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, whiteSpace: 'pre-line', lineHeight: '1.4', fontWeight: 500 }}>{data.address}</div>
              </div>
            )}
          </div>

          {/* Bloc Web & Réseaux Sociaux */}
          <div 
            className="flex flex-col gap-1.5" 
            style={{ 
              alignItems: getAlignItems(data.websiteAlign), 
              marginTop: '4px',
              transform: `translate(${data.websiteOffsetX}px, ${data.websiteOffsetY}px)`,
              zIndex: 13
            }}
          >
            {data.showWebsite && data.website && (
              <a href={formatUrl(data.website)} target="_blank" rel="noopener noreferrer" style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.7}px`, fontWeight: 'bold', textDecoration: 'none' }}>{data.website}</a>
            )}
            {data.showSocialIcons && (
              <div className="flex items-center gap-3">
                  {data.socialLinks.facebook && <a href={formatUrl(data.socialLinks.facebook)} target="_blank" rel="noopener noreferrer"><FacebookIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
                  {data.socialLinks.instagram && <a href={formatUrl(data.socialLinks.instagram)} target="_blank" rel="noopener noreferrer"><InstagramIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
                  {data.socialLinks.linkedin && <a href={formatUrl(data.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer"><LinkedinIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
                  {data.socialLinks.twitter && <a href={formatUrl(data.socialLinks.twitter)} target="_blank" rel="noopener noreferrer"><TwitterIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePreview;
