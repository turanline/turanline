export const getGoogleDriveImageUrl = (driveUrl: string) => {
  const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  }

  return "";
};
