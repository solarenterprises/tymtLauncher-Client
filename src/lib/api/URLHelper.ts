export const getFileNameFromURL = (url: string) => {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split("/");
  return pathSegments[pathSegments.length - 1];
};

export const shortenFileName = (fileName: string) => {
  const maxLength = 47;

  const lastDotIndex = fileName.lastIndexOf(".");
  let name: string, extension: string;

  if (lastDotIndex !== -1) {
    name = fileName.substring(0, lastDotIndex);
    extension = fileName.substring(lastDotIndex);
  } else {
    name = fileName;
    extension = "";
  }

  if (name.length + extension.length > maxLength) {
    const maxNameLength = maxLength - extension.length - 1; // -1 for dot
    name = name.substring(0, maxNameLength);
  }

  return name + extension;
};
