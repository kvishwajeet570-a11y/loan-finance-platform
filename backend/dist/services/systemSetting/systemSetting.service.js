"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const systemSetting_repository_1 = __importDefault(require("../../repositories/systemSetting/systemSetting.repository"));
class SystemSettingService {
    // =========================================
    // CREATE
    // =========================================
    async create(data) {
        const exists = await systemSetting_repository_1.default.findByKey(data.key);
        if (exists) {
            throw new Error("System setting key already exists.");
        }
        return systemSetting_repository_1.default.create(data);
    }
    // =========================================
    // GET ALL
    // =========================================
    async getAll(where = {}, page = 1, limit = 20) {
        return systemSetting_repository_1.default.findAll(where, page, limit);
    }
    // =========================================
    // GET BY ID
    // =========================================
    async getById(id) {
        const setting = await systemSetting_repository_1.default.findById(id);
        if (!setting) {
            throw new Error("System setting not found.");
        }
        return setting;
    }
    // =========================================
    // GET BY KEY
    // =========================================
    async getByKey(key) {
        const setting = await systemSetting_repository_1.default.findByKey(key);
        if (!setting) {
            throw new Error("System setting not found.");
        }
        return setting;
    }
    // =========================================
    // UPDATE
    // =========================================
    async update(id, data) {
        const setting = await systemSetting_repository_1.default.findById(id);
        if (!setting) {
            throw new Error("System setting not found.");
        }
        if (!setting.isEditable) {
            throw new Error("This setting cannot be modified.");
        }
        return systemSetting_repository_1.default.update(id, data);
    }
    // =========================================
    // DELETE
    // =========================================
    async delete(id) {
        const setting = await systemSetting_repository_1.default.findById(id);
        if (!setting) {
            throw new Error("System setting not found.");
        }
        return systemSetting_repository_1.default.delete(id);
    }
    // =========================================
    // BULK UPDATE
    // =========================================
    async bulkUpdate(settings) {
        return systemSetting_repository_1.default.bulkUpdate(settings);
    }
    // =========================================
    // TOGGLE STATUS
    // =========================================
    async toggleStatus(id) {
        return systemSetting_repository_1.default.toggleStatus(id);
    }
    // =========================================
    // TOGGLE ENCRYPTION
    // =========================================
    async toggleEncryption(id) {
        return systemSetting_repository_1.default.toggleEncryption(id);
    }
    // =========================================
    // ACTIVE SETTINGS
    // =========================================
    async getActiveSettings() {
        return systemSetting_repository_1.default.getActiveSettings();
    }
    // =========================================
    // CATEGORY SETTINGS
    // =========================================
    async getByCategory(category) {
        return systemSetting_repository_1.default.getByCategory(category);
    }
    // =========================================
    // COUNT
    // =========================================
    async count(where = {}) {
        return systemSetting_repository_1.default.count(where);
    }
    // =========================================
    // EXISTS
    // =========================================
    async exists(key) {
        return systemSetting_repository_1.default.exists(key);
    }
}
exports.default = new SystemSettingService();
