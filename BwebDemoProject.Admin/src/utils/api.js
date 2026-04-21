import config from "../config";

export const API_BASE_URL = config.api.API_URL;
export const API_V1_BASE_URL = `${API_BASE_URL}/api/v1`;

const localAssetHosts = new Set(["localhost:7002", "127.0.0.1:7002", "localhost:5000", "127.0.0.1:5000"]);

export const buildApiUrl = (path = "") => {
    if (!path) return API_BASE_URL;
    if (/^https?:\/\//i.test(path)) return path;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

export const buildAssetUrl = (path = "") => {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        try {
            const assetUrl = new URL(path);
            
            // If API_BASE_URL is not set or invalid, return path as-is
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
    let cleanPath = path;
    if (!cleanPath.startsWith("/")) {
        if (!cleanPath.toLowerCase().startsWith("uploads/")) {
            cleanPath = `uploads/${cleanPath}`;
        }
        cleanPath = `/${cleanPath}`;
    }

    return `${API_BASE_URL}${cleanPath}`;
};
