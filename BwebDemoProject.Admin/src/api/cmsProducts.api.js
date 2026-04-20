/**
 * Product CMS API Service
 * Handles Product CMS page, section, and content API calls
 */
import api from "./index";
import { ENDPOINTS } from "./endpoints";

// ============ PRODUCT CMS PAGE OPERATIONS ============

export const createProductCmsPage = async (data) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_PAGES.BASE, data);
};

export const getAllProductCmsPages = async () => {
  return api.get(ENDPOINTS.PRODUCT_CMS_PAGES.BASE);
};

export const getProductCmsPageById = async (id) => {
  return api.get(ENDPOINTS.PRODUCT_CMS_PAGES.BY_ID(id));
};

export const updateProductCmsPage = async (id, data) => {
  return api.put(ENDPOINTS.PRODUCT_CMS_PAGES.BY_ID(id), data);
};

export const deleteProductCmsPage = async (id) => {
  return api.delete(ENDPOINTS.PRODUCT_CMS_PAGES.BY_ID(id));
};

export const searchProductCmsPages = async (params) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_PAGES.SEARCH, params);
};

// ============ PRODUCT CMS SECTION OPERATIONS ============

export const createProductCmsSection = async (data) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_SECTIONS.BASE, data);
};

export const getAllProductCmsSections = async () => {
  return api.get(ENDPOINTS.PRODUCT_CMS_SECTIONS.BASE);
};

export const getProductCmsSectionById = async (id) => {
  return api.get(ENDPOINTS.PRODUCT_CMS_SECTIONS.BY_ID(id));
};

export const updateProductCmsSection = async (id, data) => {
  return api.put(ENDPOINTS.PRODUCT_CMS_SECTIONS.BY_ID(id), data);
};

export const deleteProductCmsSection = async (id) => {
  return api.delete(ENDPOINTS.PRODUCT_CMS_SECTIONS.BY_ID(id));
};

export const searchProductCmsSections = async (params) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_SECTIONS.SEARCH, params);
};

// ============ PRODUCT CMS CONTENT OPERATIONS ============

export const createProductCmsContent = async (data) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_CONTENTS.BASE, data);
};

export const getAllProductCmsContents = async () => {
  return api.get(ENDPOINTS.PRODUCT_CMS_CONTENTS.BASE);
};

export const getProductCmsContentById = async (id) => {
  return api.get(ENDPOINTS.PRODUCT_CMS_CONTENTS.BY_ID(id));
};

export const updateProductCmsContent = async (id, data) => {
  return api.put(ENDPOINTS.PRODUCT_CMS_CONTENTS.BY_ID(id), data);
};

export const deleteProductCmsContent = async (id) => {
  return api.delete(ENDPOINTS.PRODUCT_CMS_CONTENTS.BY_ID(id));
};

export const searchProductCmsContents = async (params) => {
  return api.post(ENDPOINTS.PRODUCT_CMS_CONTENTS.SEARCH, params);
};

// ============ PRODUCT CMS PUBLIC PAGE DATA ============

export const getProductCmsPageData = async (slug = "products") => {
  return api.get(ENDPOINTS.PRODUCT_CMS.PUBLIC_PAGE(slug));
};

export default {
  createProductCmsPage,
  getAllProductCmsPages,
  getProductCmsPageById,
  updateProductCmsPage,
  deleteProductCmsPage,
  searchProductCmsPages,
  createProductCmsSection,
  getAllProductCmsSections,
  getProductCmsSectionById,
  updateProductCmsSection,
  deleteProductCmsSection,
  searchProductCmsSections,
  createProductCmsContent,
  getAllProductCmsContents,
  getProductCmsContentById,
  updateProductCmsContent,
  deleteProductCmsContent,
  searchProductCmsContents,
  getProductCmsPageData,
};
