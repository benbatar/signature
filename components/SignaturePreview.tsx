
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
      style={{ 
        paddingLeft: data.logoOffsetX > 0 ? `${data.logoOffsetX}px` : '0px',
        paddingRight: data.logoOffsetX < 0 ? `${Math.abs(data.logoOffsetX)}px` : '0px',
        paddingTop: data.logoOffsetY > 0 ? `${data.logoOffsetY}px` : '0px',
        paddingBottom: data.logoOffsetY < 0 ? `${Math.abs(data.logoOffsetY)}px` : '0px',
      }}
    >
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
    </td>
  );

  // Bloc Texte (Nom, Contacts, Réseaux)
  const ContentColumn = (
    <td 
      align={getAlign(data.contactInfoAlign)} 
      valign={isVertical ? 'top' : getValign(data.contactVerticalAlign)}
      style={{
        paddingLeft: data.contactOffsetX > 0 ? `${data.contactOffsetX}px` : '0px',
        paddingRight: data.contactOffsetX < 0 ? `${Math.abs(data.contactOffsetX)}px` : '0px',
        paddingTop: data.contactOffsetY > 0 ? `${data.contactOffsetY}px` : '0px',
        paddingBottom: data.contactOffsetY < 0 ? `${Math.abs(data.contactOffsetY)}px` : '0px',
      }}
    >
      {/* Nom & Titre */}
      {/* Fix: corrected cellCellSpacing typo to cellSpacing on line 93 */}
      <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', marginBottom: `${data.verticalSpacing}px` }}>
        <tr>
          <td align={getAlign(data.nameTitleAlign)} style={{
             paddingLeft: data.nameOffsetX > 0 ? `${data.nameOffsetX}px` : '0px',
             paddingTop: data.nameOffsetY > 0 ? `${data.nameOffsetY}px` : '0px',
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
          </td>
        </tr>
      </table>

      {/* Coordonnées */}
      <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
        {data.showEmail && data.email && (
          <tr>
            <td style={{ paddingBottom: `${data.verticalSpacing}px` }}>
              <table border={0} cellPadding={0} cellSpacing={0}>
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
            <td style={{ paddingBottom: `${data.verticalSpacing}px` }}>
              <table border={0} cellPadding={0} cellSpacing={0}>
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
            <td style={{ paddingBottom: `${data.verticalSpacing}px` }}>
              <table border={0} cellPadding={0} cellSpacing={0}>
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
            <td style={{ paddingBottom: `${data.verticalSpacing}px` }}>
              <table border={0} cellPadding={0} cellSpacing={0}>
                <tr>
                  <td valign="top" style={{ paddingRight: '8px', paddingTop: '2px' }}><MapPinIcon color={data.accentColor} size={data.iconSize} /></td>
                  <td valign="top" style={{ color: data.primaryTextColor, fontSize: `${data.contactFontSize}px`, lineHeight: '1.4', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
                    {data.address.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        )}
      </table>

      {/* Web & Social */}
      <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', marginTop: '8px' }}>
        <tr>
          <td align={getAlign(data.websiteAlign)} style={{
            paddingLeft: data.websiteOffsetX > 0 ? `${data.websiteOffsetX}px` : '0px',
            paddingTop: data.websiteOffsetY > 0 ? `${data.websiteOffsetY}px` : '0px',
          }}>
            {data.showWebsite && data.website && (
              <div style={{ marginBottom: '8px' }}>
                <a href={formatUrl(data.website)} target="_blank" rel="noopener noreferrer" style={{ color: data.primaryTextColor, fontSize: `${data.nameFontSize * 0.7}px`, fontWeight: 'bold', textDecoration: 'none', fontFamily: 'Arial, Helvetica, sans-serif' }}>{data.website}</a>
              </div>
            )}
            {data.showSocialIcons && (
              <table border={0} cellPadding={0} cellSpacing={0}>
                <tr>
                  {data.socialLinks.facebook && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.facebook)}><FacebookIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                  {data.socialLinks.instagram && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.instagram)}><InstagramIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                  {data.socialLinks.linkedin && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.linkedin)}><LinkedinIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                  {data.socialLinks.twitter && <td style={{ paddingRight: '12px' }}><a href={formatUrl(data.socialLinks.twitter)}><TwitterIcon color={data.accentColor} size={data.iconSize + 2} /></a></td>}
                </tr>
              </table>
            )}
          </td>
        </tr>
      </table>
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
