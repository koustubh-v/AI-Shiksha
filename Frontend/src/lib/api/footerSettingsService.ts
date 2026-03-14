import api from '../api';

export interface MenuItem {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterSetting {
  id: string;
  site_title: string | null;
  copyright_text: string | null;
  show_support_section: boolean;
  logo_url: string | null;
  menus: MenuItem[];
  social_links: SocialLink[];
  franchise_id: string;
  created_at: string;
  updated_at: string;
}

export const footerSettingsService = {
  getSettings: async (): Promise<FooterSetting> => {
    const response = await api.get('/footer-settings');
    // Ensure nested JSON arrays parse correctly if the backend returns raw arrays
    return {
      ...response.data,
      menus: Array.isArray(response.data.menus) ? response.data.menus : [],
      social_links: Array.isArray(response.data.social_links) ? response.data.social_links : [],
    };
  },

  updateSettings: async (data: Partial<FooterSetting>): Promise<FooterSetting> => {
    const response = await api.put('/footer-settings', data);
    return response.data;
  },
};
