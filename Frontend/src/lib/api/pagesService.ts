import api from '../api';

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  franchise_id: string;
  created_at: string;
  updated_at: string;
}

export const pagesService = {
  getPages: async (): Promise<Page[]> => {
    const response = await api.get('/pages');
    return response.data;
  },

  getPageBySlug: async (slug: string): Promise<Page> => {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },

  upsertPage: async (slug: string, data: Partial<Page>): Promise<Page> => {
    const response = await api.put(`/pages/${slug}`, data);
    return response.data;
  },

  deletePage: async (slug: string): Promise<void> => {
    await api.delete(`/pages/${slug}`);
  },
};
