"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const BACKUP_DIR = path_1.default.join(process.cwd(), "backups");
if (!fs_1.default.existsSync(BACKUP_DIR)) {
    fs_1.default.mkdirSync(BACKUP_DIR, { recursive: true });
}
const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\./g, "-");
const backupFile = path_1.default.join(BACKUP_DIR, `loanfinance-${timestamp}.sql`);
const command = `pg_dump -U postgres -d loanfinance -f "${backupFile}"`;
(0, child_process_1.exec)(command, (error, stdout, stderr) => {
    if (error) {
        console.error("Backup Failed:", error);
        return;
    }
    console.log("Backup Created:", backupFile);
    if (stdout)
        console.log(stdout);
    if (stderr)
        console.log(stderr);
});
