import database from "../config/mariadb.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import httpStatus from "../config/http.status.js";
import QUERY from "../repository/user.repository.js";

// 공통 헬퍼 함수
const handleApiResponse = async (
  queryFunction,
  params,
  successMessage,
  notFoundMessage,
  res
) => {
  try {
    const results = await queryFunction(params);
    if (!results || results.length === 0) {
      logger.info(notFoundMessage);
      return res
        .status(httpStatus.OK.code)
        .send(
          new Response(
            httpStatus.OK.code,
            httpStatus.OK.status,
            notFoundMessage
          )
        );
    }

    logger.info(successMessage);
    return res.status(httpStatus.OK.code).send(
      new Response(
        httpStatus.OK.code,
        httpStatus.OK.status,
        successMessage
        //{data: results} // Do not know how to serialize a BigInt 에러발생
      )
    );
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Internal Server Error`,
          { error: error.message }
        )
      );
  }
};

// GET users
export const getUsers = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  await handleApiResponse(
    () => database.query(QUERY.SELECT_USERS),
    null,
    `Users retrieved successfully`,
    `No Users found`,
    res
  );
};

export const createUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, creating user`);

    const { name, email, imgUrl, createAt } = req.body;

    const results = await database.query(QUERY.CREATE_USER, [
      name,
      email,
      imgUrl,
      createAt,
    ]);

    res
      .status(httpStatus.CREATED.code)
      .send(
        new Response(
          httpStatus.CREATED.code,
          httpStatus.CREATED.status,
          `User created. id: ${results.insertId}`,
          results.insertId.toString()
        )
      );
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred while creating user`
        )
      );
  }
};
export const getUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);

    const userId = req.params.id;

    // 데이터베이스에서 사용자 정보 가져오기
    const results = await database.query(QUERY.SELECT_USER, [userId]);
    logger.info(`### Result: ${JSON.stringify(results)}`);

    // 결과가 없는 경우 처리
    if (!results || results.length === 0) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        code: httpStatus.NOT_FOUND.code,
        status: httpStatus.NOT_FOUND.status,
        message: `User by id ${userId} not found`,
      });
    }

    const resultUserId = results[0]?.userId; // 결과 배열의 첫 번째 항목의 userId

    // 성공적으로 사용자 정보 반환
    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `User by id ${resultUserId} retrieved successfully`,
      data: results[0], // 첫 번째 사용자 반환
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      code: httpStatus.INTERNAL_SERVER_ERROR.code,
      status: httpStatus.INTERNAL_SERVER_ERROR.status,
      message: "Error occurred while fetching user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, updating user`);

  const updateHandler = async (params) => {
    // 기존 유저 확인
    const [user] = await database.query(QUERY.SELECT_USER, [params.id]);
    if (!user) {
      throw new Error(`User by id ${params.id} not found`);
    }

    // 유저 업데이트
    await database.query(QUERY.UPDATE_USER, [
      ...Object.values(params.body),
      params.id,
    ]);
    return { id: params.id, ...params.body };
  };

  await handleApiResponse(
    (params) => updateHandler(params),
    { id: req.params.id, body: req.body },
    `User updated successfully`,
    `User by id ${req.params.id} not found`,
    res
  );
};

export const changeUserType = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, changing user type`);

  const updates = Object.entries(req.body); // 요청 본문에서 키-값 쌍 추출
  const userId = req.params.id;
  const queryValues = [...updates.map(([_, value]) => value), userId];

  await handleApiResponse(
    () => database.query(QUERY.UPDATE_USER_TYPE, queryValues),
    [req.params.id],
    `User language updated successfully`,
    `User by id ${req.params.id} not found`,
    res
  );
};

export const changeLanguage = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, changing language`);

  const updates = Object.entries(req.body); // 요청 본문에서 키-값 쌍 추출
  const userId = req.params.id;
  const queryValues = [...updates.map(([_, value]) => value), userId];

  await handleApiResponse(
    () => database.query(QUERY.UPDATE_USER_LANGUAGE, queryValues),
    [req.params.id],
    `User language updated successfully`,
    `User by id ${req.params.id} not found`,
    res
  );
};

export const changeUserActivation = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, updating user activation`);

  const updates = Object.entries(req.body); // 요청 본문에서 키-값 쌍 추출
  const userId = req.params.id;
  const queryValues = [...updates.map(([_, value]) => value), userId];

  await handleApiResponse(
    () => database.query(QUERY.UPDATE_USER_ACTIVATION, queryValues),
    { body: req.body, id: userId },
    `User activation updated successfully`,
    `User by id ${userId} not found`,
    res
  );
};

export default httpStatus;
