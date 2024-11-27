import express from "express";
import {
  createUser,
  getUser,
  updateUser,
  changeUserType,
  changeLanguage,
  changeUserActivation,
} from "../controller/user.controller.js";
import logger from "../util/logger.js";

const userRoutes = express.Router();

// 특정 사용자의 PATCH 요청을 처리하기 위한 핸들러 매핑
const actionHandlers = {
  changeUserType: changeUserType,
  changeLanguage: changeLanguage,
  changeUserActivation: changeUserActivation,
  getUser: getUser,
  createUser: createUser,
};

userRoutes.route("/:id").patch((req, res) => {
  const action = req.headers["action"]; // 요청 헤더에서 action 추출
  logger.info(`PATCH /users/${req.params.id}, action: ${action}`);

  if (actionHandlers[action]) {
    return actionHandlers[action](req, res); // 해당 핸들러 실행
  } else {
    return res.status(400).json({ message: "Invalid action" }); // 유효하지 않은 action 처리
  }
});
userRoutes.route("/:id").get((req, res) => {
  const action = req.headers["action"]; // 요청 헤더에서 action 추출
  logger.info(`GET /users/${req.params.id}, action: ${action}`);

  if (actionHandlers[action]) {
    return actionHandlers[action](req, res); // 해당 핸들러 실행
  } else {
    return res.status(400).json({ message: "Invalid action" }); // 유효하지 않은 action 처리
  }
});

userRoutes.route("/").post((req, res) => {
  const action = req.headers["action"]; // 요청 헤더에서 action 추출
  logger.info(`POST /users/${req.params.id}, action: ${action}`);

  if (actionHandlers[action]) {
    return actionHandlers[action](req, res); // 해당 핸들러 실행
  } else {
    return res.status(400).json({ message: "Invalid action" }); // 유효하지 않은 action 처리
  }
});
// 나머지 경로 정의
userRoutes.route("/").post(createUser);

userRoutes.route("/:id").get(getUser).put(updateUser);

export default userRoutes;
