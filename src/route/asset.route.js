import express from "express";
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
} from "../controller/asset.controller.js";
import logger from "../util/logger.js";

const assetRoutes = express.Router();

assetRoutes.route("/:id").patch((req, res) => {
  const action = req.headers["action"]; // 요청 헤더에서 action 추출
  logger.info(`PATCH /assets/${req.params.id}, action: ${action}`);

  if (actionHandlers[action]) {
    return actionHandlers[action](req, res); // 해당 핸들러 실행
  } else {
    return res.status(400).json({ message: "Invalid action" }); // 유효하지 않은 action 처리
  }
});

// 나머지 경로 정의
assetRoutes.route("/").get(getAssets);

assetRoutes.route("/:id").post(createAsset).get(getAsset).put(updateAsset);

export default assetRoutes;
