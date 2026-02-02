
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

  const getTextAlign = (align: string) => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'right';
    return 'left';
  };

  const isVerticalMode = data.layoutMode === 'logo-top' || data.layoutMode === 'logo-bottom';

  // --- RENDU DU LOGO ---
  const renderLogo = () => (
    <div style={{ 
      transform: `translate(${data.logoOffsetX}px, ${data.logoOffsetY}px)`,
      textAlign: getTextAlign(data.logoAlign),
      display: 'inline-block'
    }}>
      <div style={{ 
        backgroundColor: data.showLogoBackground ? data.logoBgColor : 'transparent',
        width: `${data.logoWidth}px`,
        borderRadius: data.showLogoBackground ? '8px' : '0px',
        padding: data.showLogoBackground ? '12px' : '0px',
        marginBottom: `${data.logoFooterGap}px`,
      }}>
        {data.logoUrl ? (
          <img src={data.logoUrl} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
        ) : (
          <div style={{ color: '#ccc', fontSize: '10px', fontWeight: 'bold' }}>LOGO</div>
        )}
      </div>
      <div style={{ 
        color: data.primaryTextColor,
        fontSize: `${data.footerFontSize}px`,
        width: `${data.logoWidth + (data.showLogoBackground ? 24 : 0)}px`,
        textAlign: getTextAlign(data.footerTextAlign),
        fontWeight: '700',
        lineHeight: '1.3',
        fontFamily: "'Inter', sans-serif"
      }}>
        {data.footerServices.split('-').map((s, i, a) => (
          <React.Fragment key={i}>
            <span style={{ whiteSpace: 'nowrap' }}>{s.trim()}</span>
            {i < a.length - 1 && <span style={{ color: data.accentColor, margin: '0 4px' }}>-</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // --- RENDU DES INFOS ---
  const renderInfos = () => (
    <div style={{ 
      transform: `translate(${data.contactOffsetX}px, ${data.contactOffsetY}px)`,
      fontFamily: "'Inter', sans-serif",
      textAlign: getTextAlign(data.contactInfoAlign)
    }}>
      {/* Nom & Titre */}
      <div style={{ 
        transform: `translate(${data.nameOffsetX}px, ${data.nameOffsetY}px)`,
        marginBottom: `${data.verticalSpacing * 1.5}px`,
        textAlign: getTextAlign(data.nameTitleAlign)
      }}>
        {data.showFullName && <div style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize}px`, fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em' }}>{data.fullName}</div>}
        {data.showJobTitle && <div style={{ color: data.primaryTextColor, fontSize: `${data.jobTitleFontSize}px`, opacity: 0.7, fontWeight: '500', marginTop: '4px' }}>{data.jobTitle}</div>}
      </div>

      {/* Coordonnées */}
      <div>
        {data.showEmail && data.email && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: data.contactInfoAlign === 'center' ? 'center' : (data.contactInfoAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            <EmailIcon color={data.accentColor} size={data.iconSize} />
            <a href={`mailto:${data.email}`} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.email}</a>
          </div>
        )}
        {data.showPhoneMobile && data.phoneMobile && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: data.contactInfoAlign === 'center' ? 'center' : (data.contactInfoAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            <MobileIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneMobile)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.phoneMobile}</a>
          </div>
        )}
        {data.showPhoneWork && data.phoneWork && (
          <div style={{ marginBottom: `${data.verticalSpacing}px`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: data.contactInfoAlign === 'center' ? 'center' : (data.contactInfoAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            <PhoneIcon color={data.accentColor} size={data.iconSize} />
            <a href={formatTel(data.phoneWork)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: '600' }}>{data.phoneWork}</a>
          </div>
        )}
        {data.showAddress && data.address && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: data.contactInfoAlign === 'center' ? 'center' : (data.contactInfoAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            <MapPinIcon color={data.accentColor} size={data.iconSize} />
            <div style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, lineHeight: '1.3', fontWeight: '600' }}>
              {data.address.split('\n').map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        )}
      </div>

      {/* Website & Social */}
      <div style={{ transform: `translate(${data.websiteOffsetX}px, ${data.websiteOffsetY}px)`, marginTop: '16px' }}>
        {data.showWebsite && data.website && (
          <div style={{ marginBottom: '8px', textAlign: getTextAlign(data.websiteAlign) }}>
            <a href={formatUrl(data.website)} style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.6}px`, fontWeight: '900', textDecoration: 'none' }}>{data.website.toUpperCase()}</a>
          </div>
        )}
        {data.showSocialIcons && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: data.websiteAlign === 'center' ? 'center' : (data.websiteAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            {data.socialLinks.facebook && <a href={formatUrl(data.socialLinks.facebook)}><FacebookIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
            {data.socialLinks.instagram && <a href={formatUrl(data.socialLinks.instagram)}><InstagramIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
            {data.socialLinks.linkedin && <a href={formatUrl(data.socialLinks.linkedin)}><LinkedinIcon color={data.accentColor} size={data.iconSize + 2} /></a>}
          </div>
        )}
      </div>
    </div>
  );

  // --- STRUCTURE RIGIDE (TABLE) ---
  return (
    <div id="signature-container" style={{ backgroundColor: '#ffffff', padding: '40px', display: 'inline-block' }}>
      {isVerticalMode ? (
        // Mode Vertical (Top/Bottom)
        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <tbody>
            {data.layoutMode === 'logo-top' ? (
              <>
                <tr><td align="center">{renderLogo()}</td></tr>
                {data.dividerWidth > 0 && <tr><td align="center" style={{ padding: '20px 0' }}><div style={{ width: `${data.dividerHeight}px`, height: `${data.dividerWidth}px`, backgroundColor: data.dividerColor }} /></td></tr>}
                <tr><td align="center">{renderInfos()}</td></tr>
              </>
            ) : (
              <>
                <tr><td align="center">{renderInfos()}</td></tr>
                {data.dividerWidth > 0 && <tr><td align="center" style={{ padding: '20px 0' }}><div style={{ width: `${data.dividerHeight}px`, height: `${data.dividerWidth}px`, backgroundColor: data.dividerColor }} /></td></tr>}
                <tr><td align="center">{renderLogo()}</td></tr>
              </>
            )}
          </tbody>
        </table>
      ) : (
        // Mode Horizontal (Left/Right) - CELUI QUE VOUS VOULEZ FIGER
        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'middle' }}>
                {data.layoutMode === 'logo-left' ? renderLogo() : renderInfos()}
              </td>
              {data.dividerWidth > 0 && (
                <td style={{ verticalAlign: 'middle', padding: `0 ${data.columnGap / 2}px` }}>
                  <div style={{ width: `${data.dividerWidth}px`, height: `${data.dividerHeight}px`, backgroundColor: data.dividerColor }} />
                </td>
              )}
              <td style={{ verticalAlign: 'middle' }}>
                {data.layoutMode === 'logo-left' ? renderInfos() : renderLogo()}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SignaturePreview;
