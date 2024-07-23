export const getFileNameFromURL = (url: string) => {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split("/");
  return pathSegments[pathSegments.length - 1];
};
