const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const getPublicBaseUrl = (req) => {
  const configuredBaseUrl = trimTrailingSlash(process.env.PUBLIC_BASE_URL || "");
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const forwardedProto = req?.headers?.["x-forwarded-proto"]?.split(",")[0]?.trim();
  const forwardedHost = req?.headers?.["x-forwarded-host"]?.split(",")[0]?.trim();
  const protocol = forwardedProto || req?.protocol || "http";
  const host = forwardedHost || req?.get?.("host");

  if (!host) {
    return "";
  }

  return `${protocol}://${host}`;
};

export const buildPublicUrl = (req, path = "") => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = getPublicBaseUrl(req);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};
