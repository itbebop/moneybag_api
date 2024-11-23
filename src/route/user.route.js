import express from "express";
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";

const userRoutes = express.Router();

// userRoutes.route("/").get(getUsers).post(createUser);

// userRoutes.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

const actionHandlers = {
  getUser: getUser,
  createUser: createUser,
};

// POST 요청 라우트
userRoutes.route("/").post((req, res) => {
  const { action } = req.body; // action 값 추출
  if (actionHandlers[action]) {
    return actionHandlers[action](req, res); // 핸들러 실행
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }
});

userRoutes
  .route("/")
  .get(getUsers)
  .post(createUser)
  .post(getUser)
  .put(updateUser) // PUT으로 전체 수정
  .delete(deleteUser); // DELETE로 삭제

export default userRoutes;
