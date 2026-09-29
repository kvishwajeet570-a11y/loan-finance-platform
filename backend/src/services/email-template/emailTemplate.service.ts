const emailTemplateService = {
  getTemplates: async () => ({ data: [], total: 0 }),
  getTemplateById: async () => null,
  createTemplate: async (data: any) => data,
  updateTemplate: async (_id: string, data: any) => data,
  toggleStatus: async (_id: string) => ({ success: true }),
  previewTemplate: async () => "",
  sendTestEmail: async () => true,
  softDelete: async () => true,
  getAnalytics: async () => ({}),
};

export default emailTemplateService;