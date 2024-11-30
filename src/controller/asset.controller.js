import database from "../config/mariadb.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import httpStatus from "../config/http.status.js";
import QUERY from "../repository/asset.repository.js";

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

const associateUserWithAsset = async (userId, assetId) => {
  try {
    await database.query(QUERY.CREATE_USER_ASSET, [userId, assetId]);
    logger.info(`User ${userId} associated with asset ${assetId}`);
  } catch (error) {
    logger.error(`Error associating user with asset: ${error.message}`);
    throw new Error("Failed to associate user with asset");
  }
};

export const createAsset = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, creating asset`);

    const userId = req.headers["userid"]; // 헤더 키는 대소문자를 구분하지 않음
    logger.info(`### userId: ${userId}, `);

    const { assetName, firstColor, secondColor } = req.body;

    const results = await database.query(QUERY.CREATE_ASSET, [
      assetName,
      firstColor,
      secondColor,
    ]);
    logger.info(`### asset created`);

    const assetId = results.insertId;
    logger.info(`associating UserWithAsset ${userId} with ${assetId}`);
    await associateUserWithAsset(userId, assetId);

    res
      .status(httpStatus.CREATED.code)
      .send(
        new Response(
          httpStatus.CREATED.code,
          httpStatus.CREATED.status,
          `Asset created. id: ${results.insertId}`,
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
          `Error occurred while creating asset`
        )
      );
  }
};

export const getAssets = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching assets`);

    const userId = req.headers["userid"]; // 헤더 키는 대소문자를 구분하지 않음

    const [results] = await database.query(QUERY.SELECT_ASSETS, [userId]);

    // 결과가 없는 경우 빈 리스트 반환
    if (!results || results.length === 0) {
      return res.status(httpStatus.OK.code).json({
        code: httpStatus.OK.code,
        status: httpStatus.OK.status,
        message: `No assets found for user id ${userId}`,
        data: [],
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Assets by id ${userId} retrieved successfully`,
      data: results, // 모든 사용자 데이터를 반환
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Internal Server Error`,
          []
        )
      );
  }
};

export const getAsset = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching asset`);

    // const userId = req.headers["userId"]; // Ensure userId is passed in headers
    const assetId = req.params.id; // Assume assetId is passed as a URL parameter

    logger.info(`Fetching asset for assetId: ${assetId}`);

    const [results] = await database.query(QUERY.SELECT_ASSET_BY_ID, [assetId]);

    // If no matching asset is found
    if (!results || results.length === 0) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        code: httpStatus.NOT_FOUND.code,
        status: httpStatus.NOT_FOUND.status,
        message: `Asset with assetId ${assetId} not found`,
      });
    }

    // Return the specific asset
    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Asset retrieved successfully`,
      data: results, // Single asset
    });
    logger.info(`Fetched asset for assetId: ${assetId}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      code: httpStatus.INTERNAL_SERVER_ERROR.code,
      status: httpStatus.INTERNAL_SERVER_ERROR.status,
      message: "Internal Server Error",
    });
  }
};

export const updateAsset = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, updating Asset`);
  const assetId = req.params.id;
  const updateHandler = async (params) => {
    // 기존 유저 확인
    const [asset] = await database.query(QUERY.SELECT_ASSET_BY_ID, [params.id]);
    if (!asset) {
      throw new Error(`Asset by id ${params.id} not found`);
    }

    // Asset 업데이트
    const { assetName, currency, firstColor, secondColor } = req.body;
    await database.query(QUERY.UPDATE_ASSET, [
      assetName,
      currency,
      firstColor,
      secondColor,
      params.id,
    ]);
    return { id: params.id, ...params.body };
  };

  await handleApiResponse(
    (params) => updateHandler(params),
    { id: req.params.id, body: req.body },
    `Asset updated successfully`,
    `Asset by id ${req.params.id} not found`,
    res
  );
};
