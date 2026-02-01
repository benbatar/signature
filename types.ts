
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SignatureLayout {
  id: string;
  name: string;
  accentColor: string;
  dividerColor: string;
  primaryTextColor: string;
  logoBgColor: string;
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
  nameOffsetX: number;
  nameOffsetY: number;
  contactOffsetX: number;
  contactOffsetY: number;
  logoOffsetX: number;
  logoOffsetY: number;
  websiteOffsetX: number;
  websiteOffsetY: number;
  showLogoBackground: boolean;
  contactVerticalAlign: 'flex-start' | 'center' | 'flex-end';
  nameTitleAlign: 'left' | 'center' | 'right';
  contactInfoAlign: 'left' | 'center' | 'right';
  websiteAlign: 'left' | 'center' | 'right';
  footerTextAlign: 'left' | 'center' | 'right';
  logoAlign: 'left' | 'center' | 'right';
  layoutMode: 'logo-left' | 'logo-right' | 'logo-top' | 'logo-bottom';
}

export interface SignatureData extends SignatureLayout {
  profileName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phoneWork: string;
  phoneMobile: string;
  address: string;
  website: string;
  footerServices: string;
  logoUrl: string;
  showFullName: boolean;
  showJobTitle: boolean;
  showEmail: boolean;
  showPhoneWork: boolean;
  showPhoneMobile: boolean;
  showAddress: boolean;
  showWebsite: boolean;
  showSocialIcons: boolean;
  socialLinks: SocialLinks;
}
