/**
 * Admin API Index
 * Central export point for all admin API services
 */

export { default as adminUserApi } from "./users";
export { default as adminCategoryApi } from "./categories";
export { default as adminProductApi } from "./products";
export { default as adminOrderApi } from "./orders";
export { default as adminReviewApi } from "./reviews";
export { default as adminStatisticsApi } from "./statistics";

// Re-export types for convenience
export type { GetUsersParams } from "./users";
export type { GetProductsParams } from "./products";
export type { GetOrdersParams } from "./orders";
export type { GetReviewsParams } from "./reviews";
