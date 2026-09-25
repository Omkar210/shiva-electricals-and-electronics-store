import { google } from "googleapis";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = (match[2] || "").trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const key = (env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const auth = new google.auth.JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: key,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });
const folderId = env.GOOGLE_DRIVE_FOLDER_ID;

async function check() {
  console.log(`Checking folder: ${folderId}`);
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, size, webViewLink, thumbnailLink)",
  });

  const files = res.data.files || [];
  console.log(`Found ${files.length} files in Google Drive folder:`);
  files.forEach((f) => {
    console.log(` - Name: "${f.name}", ID: "${f.id}", Mime: "${f.mimeType}", Size: ${f.size}`);
  });
}

check().catch(console.error);
