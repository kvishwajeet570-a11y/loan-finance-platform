import { Prisma } from "@prisma/client";
import systemSettingRepository from "../../repositories/systemSetting/systemSetting.repository";

class SystemSettingService {
  // =========================================
  // CREATE
  // =========================================

  async create(data: Prisma.SystemSettingCreateInput) {
    const exists = await systemSettingRepository.findByKey(data.key);

    if (exists) {
      throw new Error("System setting key already exists.");
    }

    return systemSettingRepository.create(data);
  }

  // =========================================
  // GET ALL
  // =========================================

  async getAll(
    where: Prisma.SystemSettingWhereInput = {},
    page = 1,
    limit = 20
  ) {
    return systemSettingRepository.findAll(where, page, limit);
  }

  // =========================================
  // GET BY ID
  // =========================================

  async getById(id: string) {
    const setting = await systemSettingRepository.findById(id);

    if (!setting) {
      throw new Error("System setting not found.");
    }

    return setting;
  }

  // =========================================
  // GET BY KEY
  // =========================================

  async getByKey(key: string) {
    const setting = await systemSettingRepository.findByKey(key);

    if (!setting) {
      throw new Error("System setting not found.");
    }

    return setting;
  }

  // =========================================
  // UPDATE
  // =========================================

  async update(
    id: string,
    data: Prisma.SystemSettingUpdateInput
  ) {
    const setting = await systemSettingRepository.findById(id);

    if (!setting) {
      throw new Error("System setting not found.");
    }

    if (!setting.isEditable) {
      throw new Error("This setting cannot be modified.");
    }

    return systemSettingRepository.update(id, data);
  }

  // =========================================
  // DELETE
  // =========================================

  async delete(id: string) {
    const setting = await systemSettingRepository.findById(id);

    if (!setting) {
      throw new Error("System setting not found.");
    }

    return systemSettingRepository.delete(id);
  }

  // =========================================
  // BULK UPDATE
  // =========================================

  async bulkUpdate(
    settings: {
      key: string;
      value: Prisma.InputJsonValue;
      updatedBy?: string;
    }[]
  ) {
    return systemSettingRepository.bulkUpdate(settings);
  }

  // =========================================
  // TOGGLE STATUS
  // =========================================

  async toggleStatus(id: string) {
    return systemSettingRepository.toggleStatus(id);
  }

  // =========================================
  // TOGGLE ENCRYPTION
  // =========================================

  async toggleEncryption(id: string) {
    return systemSettingRepository.toggleEncryption(id);
  }

  // =========================================
  // ACTIVE SETTINGS
  // =========================================

  async getActiveSettings() {
    return systemSettingRepository.getActiveSettings();
  }

  // =========================================
  // CATEGORY SETTINGS
  // =========================================

  async getByCategory(category: string) {
    return systemSettingRepository.getByCategory(category);
  }

  // =========================================
  // COUNT
  // =========================================

  async count(
    where: Prisma.SystemSettingWhereInput = {}
  ) {
    return systemSettingRepository.count(where);
  }

  // =========================================
  // EXISTS
  // =========================================

  async exists(key: string) {
    return systemSettingRepository.exists(key);
  }
}

export default new SystemSettingService();