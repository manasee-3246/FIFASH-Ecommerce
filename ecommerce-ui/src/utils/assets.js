const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const localAssetHosts = new Set(["localhost:7002", "127.0.0.1:7002", "localhost:5000", "127.0.0.1:5000"]);

export const buildAssetUrl = (path = "") => {
  if (!path) {
    return "";
  }

  // Handle absolute URLs
  if (/^https?:\/\//i.test(path)) {
    try {
      const assetUrl = new URL(path);
      
      // If API_BASE_URL is not set, we can't do much about localhost URLs
      if (!API_BASE_URL) return path;

      const apiUrl = new URL(API_BASE_URL);

      // If the host is a known local host, replace it with the production API origin
      if (localAssetHosts.has(assetUrl.host)) {
        return `${apiUrl.origin}${assetUrl.pathname}${assetUrl.search}${assetUrl.hash}`;
      }
    } catch {
      return path;
    }

    return path;
  }

  // Handle relative paths
  // If the path already starts with /uploads/ or uploads/, don't double up
  let cleanPath = path;
  if (!cleanPath.startsWith("/")) {
    if (!cleanPath.toLowerCase().startsWith("uploads/")) {
      cleanPath = `uploads/${cleanPath}`;
    }
    cleanPath = `/${cleanPath}`;
  } else if (!cleanPath.toLowerCase().startsWith("/uploads/")) {
    cleanPath = `/uploads${cleanPath}`;
  }

  return `${API_BASE_URL}${cleanPath}`;
};
