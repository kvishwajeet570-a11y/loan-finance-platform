"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailTemplateService = {
    getTemplates: async () => ({ data: [], total: 0 }),
    getTemplateById: async () => null,
    createTemplate: async (data) => data,
    updateTemplate: async (_id, data) => data,
    toggleStatus: async (_id) => ({ success: true }),
    previewTemplate: async () => "",
    sendTestEmail: async () => true,
    softDelete: async () => true,
    getAnalytics: async () => ({}),
};
exports.default = emailTemplateService;
