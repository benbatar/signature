
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SignatureData {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneWork: string;
  phoneMobile: string;
  address: string;
  website: string;
  logoUrl: string;
  accentColor: string;
  dividerColor: string;
  primaryTextColor: string;
  footerServices: string;
  logoBgColor: string;
  // Contrôles granulaires
  logoWidth: number;
  iconSize: number;
  footerFontSize: number;
  nameFontSize: number;
  jobTitleFontSize: number;
  contactFontSize: number;
  verticalSpacing: number; 
  logoFooterGap: number;
  columnGap: number;
  dividerWidth: number;
  dividerHeight: number;
  socialLinks: SocialLinks;
  // Décalages de précision (X et Y pour déplacement libre)
  nameOffsetX: number;
  nameOffsetY: number;
  contactOffsetX: number;
  contactOffsetY: number;
  logoOffsetX: number;
  logoOffsetY: number;
  websiteOffsetX: number;
  websiteOffsetY: number;
  // Options
  showLogoBackground: boolean;
  contactVerticalAlign: 'flex-start' | 'center' | 'flex-end';
  // Visibilité
  showFullName: boolean;
  showJobTitle: boolean;
  showEmail: boolean;
  showPhoneWork: boolean;
  showPhoneMobile: boolean;
  showAddress: boolean;
  showWebsite: boolean;
  showSocialIcons: boolean;
  // Alignements
  nameTitleAlign: 'left' | 'center' | 'right';
  contactInfoAlign: 'left' | 'center' | 'right';
  websiteAlign: 'left' | 'center' | 'right';
  footerTextAlign: 'left' | 'center' | 'right';
  logoAlign: 'left' | 'center' | 'right';
  // Structure Globale
  layoutMode: 'logo-left' | 'logo-right' | 'logo-top' | 'logo-bottom';
  dividerStyle: 'solid' | 'dashed' | 'none';
}

export type PresetType = 'modern' | 'classic' | 'minimal';
