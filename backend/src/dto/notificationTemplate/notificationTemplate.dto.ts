
/* =====================================================
   CREATE TEMPLATE DTO
===================================================== */

export interface CreateNotificationTemplateDto {
  name: string;

  code: string;

  category: string;

  type: string;

  subject?: string;

  content: string;

  variables?: Record<string, any>;
}

/* =====================================================
   UPDATE TEMPLATE DTO
===================================================== */

export interface UpdateNotificationTemplateDto {
  name?: string;

  category?: string;

  type?: string;

  subject?: string;

  content?: string;

  variables?: Record<string, any>;

  isActive?: boolean;
}

/* =====================================================
   TEMPLATE FILTER DTO
===================================================== */

export interface NotificationTemplateFilterDto {
  page?: number;

  limit?: number;

  search?: string;

  category?: string;

  type?: string;

  isActive?: boolean;
}

/* =====================================================
   TEMPLATE ANALYTICS DTO
===================================================== */

export interface NotificationTemplateAnalyticsDto {
  totalTemplates: number;

  totalSent: number;

  totalDelivered: number;

  totalFailed: number;
}

/* =====================================================
   TEMPLATE RESPONSE DTO
===================================================== */

export interface NotificationTemplateResponseDto {
  id: string;

  name: string;

  code: string;

  category: string;

  type: string;

  subject?: string | null;

  content: string;

  variables?: Record<string, any> | null;

  version: number;

  isActive: boolean;

  totalSent: number;

  totalDelivered: number;

  totalFailed: number;

  createdBy?: string | null;

  approvedBy?: string | null;

  createdAt: Date;

  updatedAt: Date;
}

/* =====================================================
   TEMPLATE RENDER DTO
===================================================== */

export interface RenderTemplateDto {
  template: string;

  data: Record<string, any>;
}