import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";
import logger from "../util/logger.js";

const categoryRoutes = express.Router();

// 나머지 경로 정의
categoryRoutes.route("/").get(getCategories).post(createCategory);

categoryRoutes
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default categoryRoutes;
