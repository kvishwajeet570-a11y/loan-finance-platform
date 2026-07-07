import { exec } from "child_process";
import path from "path";
import fs from "fs";

const BACKUP_DIR = path.join(process.cwd(), "backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date()
  .toISOString()
  .replace(/:/g, "-")
  .replace(/\./g, "-");

const backupFile = path.join(
  BACKUP_DIR,
  `loanfinance-${timestamp}.sql`
);

const command = `pg_dump -U postgres -d loanfinance -f "${backupFile}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error("Backup Failed:", error);
    return;
  }

  console.log("Backup Created:", backupFile);

  if (stdout) console.log(stdout);
  if (stderr) console.log(stderr);
});