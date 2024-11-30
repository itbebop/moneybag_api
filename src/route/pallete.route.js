import express from "express";
import {
  createUserPallete,
  getUserPallete,
} from "../controller/pallete.controller.js";

const palleteRoutes = express.Router();

// 나머지 경로 정의
palleteRoutes.route("/").post(createUserPallete);

palleteRoutes.route("/:id").get(getUserPallete);

export default palleteRoutes;
