
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

  const getAlign = (align: 'left' | 'center' | 'right') => align;
  const getValign = (align: string) => {
    if (align === 'center') return 'middle';
    if (align === 'flex-end') return 'bottom';
    return 'top';
  };

  const isVertical = data.layoutMode === 'logo-top' || data.layoutMode === 'logo-bottom';

  // Bloc Logo & Footer
  const LogoColumn = (
    <td 
      align={getAlign(data.logoAlign)} 
      valign="top"
    >
      <div style={{ 
        position: 'relative',
        left: `${data.logoOffsetX}px`,
        top: `${data.logoOffsetY}px`,
        display: 'inline-block'
      }}>
        <div style={{ 
          backgroundColor: data.showLogoBackground ? data.logoBgColor : 'transparent',
          width: `${data.logoWidth}px`,
          borderRadius: data.showLogoBackground ? '8px' : '0px',
          padding: data.showLogoBackground ? '12px' : '0px',
          marginBottom: `${data.logoFooterGap}px`
        }}>
          {data.logoUrl ? (
            <img 
              src={data.logoUrl} 
              alt="Logo" 
              width={data.logoWidth}
              style={{ 
                width: `${data.logoWidth}px`,
                display: 'block',
                border: '0'
              }} 
            />
          ) : (
            <div style={{ color: '#ccc', fontSize: '10px', fontWeight: 'bold' }}>LOGO</div>
          )}
        </div>
        <div style={{ 
          color: data.primaryTextColor,
          fontSize: `${data.footerFontSize}px`,
          width: `${data.logoWidth + (data.showLogoBackground ? 24 : 0)}px`,
          textAlign: data.footerTextAlign as any,
          fontWeight: 'bold',
          lineHeight: '1.3',
          fontFamily: 'Arial, Helvetica, sans-serif'
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
    </td>
  );

  // Bloc Texte (Nom, Contacts, Réseaux)
  const ContentColumn = (
    <td 
      align={getAlign(data.contactInfoAlign)} 
      valign={isVertical ? 'top' : getValign(data.contactVerticalAlign)}
    >
      <div style={{
        position: 'relative',
        left: `${data.contactOffsetX}px`,
        top: `${data.contactOffsetY}px`,
        display: 'inline-block',
        textAlign: data.contactInfoAlign
      }}>
        {/* Nom & Titre */}
        <div style={{ 
          position: 'relative',
          left: `${data.nameOffsetX}px`,
          top: `${data.nameOffsetY}px`,
          marginBottom: `${data.verticalSpacing}px`,
          textAlign: data.nameTitleAlign
        }}>
          {data.showFullName && (
            <div style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize}px`, fontWeight: 'bold', lineHeight: '1.1', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {data.fullName}
            </div>
          )}
          {data.showJobTitle && (
            <div style={{ color: data.primaryTextColor, fontSize: `${data.jobTitleFontSize}px`, opacity: 0.8, fontWeight: 'normal', fontFamily: 'Arial, Helvetica, sans-serif', marginTop: '2px' }}>
              {data.jobTitle}
            </div>
          )}
        </div>

        {/* Coordonnées */}
        <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', width: '100%' }}>
          {data.showEmail && data.email && (
            <tr>
              <td align={getAlign(data.contactInfoAlign)} style={{ paddingBottom: `${data.verticalSpacing}px` }}>
                <table border={0} cellPadding={0} cellSpacing={0} style={{ display: 'inline-block' }}>
                  <tr>
                    <td valign="middle" style={{ paddingRight: '8px' }}><EmailIcon color={data.accentColor} size={data.iconSize} /></td>
                    <td valign="middle"><a href={`mailto:${data.email}`} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif' }}>{data.email}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
          {data.showPhoneWork && data.phoneWork && (
            <tr>
              <td align={getAlign(data.contactInfoAlign)} style={{ paddingBottom: `${data.verticalSpacing}px` }}>
                <table border={0} cellPadding={0} cellSpacing={0} style={{ display: 'inline-block' }}>
                  <tr>
                    <td valign="middle" style={{ paddingRight: '8px' }}><PhoneIcon color={data.accentColor} size={data.iconSize} /></td>
                    <td valign="middle"><a href={formatTel(data.phoneWork)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif' }}>{data.phoneWork}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
          {data.showPhoneMobile && data.phoneMobile && (
            <tr>
              <td align={getAlign(data.contactInfoAlign)} style={{ paddingBottom: `${data.verticalSpacing}px` }}>
                <table border={0} cellPadding={0} cellSpacing={0} style={{ display: 'inline-block' }}>
                  <tr>
                    <td valign="middle" style={{ paddingRight: '8px' }}><MobileIcon color={data.accentColor} size={data.iconSize} /></td>
                    <td valign="middle"><a href={formatTel(data.phoneMobile)} style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif' }}>{data.phoneMobile}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
          {data.showAddress && data.address && (
            <tr>
              <td align={getAlign(data.contactInfoAlign)} style={{ paddingBottom: `${data.verticalSpacing}px` }}>
                <table border={0} cellPadding={0} cellSpacing={0} style={{ display: 'inline-block' }}>
                  <tr>
                    <td valign="top" style={{ paddingRight: '8px', paddingTop: '2px' }}><MapPinIcon color={data.accentColor} size={data.iconSize} /></td>
                    <td valign="top" style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, lineHeight: '1.4', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold', textAlign: data.contactInfoAlign }}>
                      {data.address.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
        </table>

        {/* Web & Social */}
        <div style={{ 
          position: 'relative',
          left: `${data.websiteOffsetX}px`,
          top: `${data.websiteOffsetY}px`,
          marginTop: '8px',
          textAlign: data.websiteAlign
        }}>
          {data.showWebsite && data.website && (
            <div style={{ marginBottom: '8px' }}>
              <a href={formatUrl(data.website)} target="_blank" rel="noopener noreferrer" style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.7}px`, fontWeight: 'bold', textDecoration: 'none', fontFamily: 'Arial, Helvetica, sans-serif' }}>{data.website}</a>
            </div>
          )}
          {data.showSocialIcons && (
            <table border={0} cellPadding={0} cellSpacing={0} style={{ display: 'inline-block' }}>
              <tr>
                {data.socialLinks.facebook && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.facebook)}><FacebookIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                {data.socialLinks.instagram && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.instagram)}><InstagramIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                {data.socialLinks.linkedin && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.linkedin)}><LinkedinIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                {data.socialLinks.twitter && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.twitter)}><TwitterIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
              </tr>
            </table>
          )}
        </div>
      </div>
    </td>
  );

  return (
    <div id="signature-container" style={{ backgroundColor: '#ffffff', padding: '20px', display: 'inline-block' }}>
      <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        {data.layoutMode === 'logo-left' && (
          <tr>
            {LogoColumn}
            <td style={{ width: `${data.columnGap}px` }}>
               {data.dividerWidth > 0 && (
                 <div style={{ width: `${data.dividerWidth}px`, height: `${data.dividerHeight}px`, backgroundColor: data.dividerColor, margin: '0 auto' }} />
               )}
            </td>
            {ContentColumn}
          </tr>
        )}
        {data.layoutMode === 'logo-right' && (
          <tr>
            {ContentColumn}
            <td style={{ width: `${data.columnGap}px` }}>
               {data.dividerWidth > 0 && (
                 <div style={{ width: `${data.dividerWidth}px`, height: `${data.dividerHeight}px`, backgroundColor: data.dividerColor, margin: '0 auto' }} />
               )}
            </td>
            {LogoColumn}
          </tr>
        )}
        {data.layoutMode === 'logo-top' && (
          <>
            <tr>{LogoColumn}</tr>
            {data.dividerWidth > 0 && (
              <tr><td style={{ padding: '15px 0' }} align={getAlign(data.logoAlign)}><div style={{ height: `${data.dividerWidth}px`, width: `${data.dividerHeight}px`, backgroundColor: data.dividerColor }} /></td></tr>
            )}
            <tr>{ContentColumn}</tr>
          </>
        )}
        {data.layoutMode === 'logo-bottom' && (
          <>
            <tr>{ContentColumn}</tr>
            {data.dividerWidth > 0 && (
              <tr><td style={{ padding: '15px 0' }} align={getAlign(data.logoAlign)}><div style={{ height: `${data.dividerWidth}px`, width: `${data.dividerHeight}px`, backgroundColor: data.dividerColor }} /></td></tr>
            )}
            <tr>{LogoColumn}</tr>
          </>
        )}
      </table>
    </div>
  );
};

export default SignaturePreview;
