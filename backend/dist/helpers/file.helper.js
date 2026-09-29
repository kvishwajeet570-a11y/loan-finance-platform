"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFileSize = void 0;
const formatFileSize = (bytes) => {
    if (!bytes)
        return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return ((bytes / Math.pow(1024, index)).toFixed(2) + " " + units[index]);
};
exports.formatFileSize = formatFileSize;
