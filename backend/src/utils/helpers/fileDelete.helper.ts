import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string) => {
  const fullPath = path.join(__dirname, '../../../public', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};
