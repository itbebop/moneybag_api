import database from "../config/mariadb.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import httpStatus from "../config/http.status.js";
import QUERY from "../repository/category.repository.js";

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

export const createCategory = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, creating Category`);

    const {
      categoryName,
      iconKey,
      assetType,
      level,
      userId,
      parentCategoryId,
    } = req.body;
    // parentCategoryId가 null인 경우 최상위 카테고리로 처리
    const isTopLevel = parentCategoryId === null;

    const results = await database.query(QUERY.CREATE_CATEGORY, [
      categoryName,
      iconKey,
      assetType,
      level,
      userId,
      isTopLevel ? null : parentCategoryId, // 최상위 카테고리는 null로 설정
    ]);
    logger.info(`Category created`);

    res
      .status(httpStatus.CREATED.code)
      .send(
        new Response(
          httpStatus.CREATED.code,
          httpStatus.CREATED.status,
          `Category created. id: ${results.insertId}`,
          results.insertId.toString()
        )
      );
  } catch (error) {
    logger.error(`Error creating Category: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred while creating Category`
        )
      );
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.headers["userid"];
    const level = req.headers["level"];
    logger.info(
      `${req.method} ${req.originalUrl}, fetching Categories by id : ${userId}`
    );

    const results = await database.query(QUERY.SELECT_CATEGORIES, [
      userId,
      level,
    ]);

    // 결과가 없는 경우 빈 리스트 반환
    if (!results || results.length === 0) {
      return res.status(httpStatus.OK.code).json({
        code: httpStatus.OK.code,
        status: httpStatus.OK.status,
        message: `No Categories found for user id ${userId}`,
        data: [],
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Categories by id ${userId} retrieved successfully`,
      data: {
        results,
      }, // 모든 사용자 데이터를 반환
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

export const getCategory = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching Category`);

    const categoryId = req.params.id;
    parameter;

    logger.info(`Fetching Category for categoryId: ${categoryId}`);

    const [results] = await database.query(QUERY.SELECT_CATEGORY_BY_ID, [
      assetId,
    ]);

    if (!results || results.length === 0) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        code: httpStatus.NOT_FOUND.code,
        status: httpStatus.NOT_FOUND.status,
        message: `Category with assetId ${categoryId} not found`,
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Category retrieved successfully`,
      data: results, // Single asset
    });
    logger.info(`Fetched Category for categoryId: ${categoryId}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      code: httpStatus.INTERNAL_SERVER_ERROR.code,
      status: httpStatus.INTERNAL_SERVER_ERROR.status,
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, updating Category`);
  const categoryId = req.params.id;
  const updateHandler = async (params) => {
    const [category] = await database.query(QUERY.SELECT_CATEGORY_BY_ID, [
      categoryId,
    ]);
    if (!category) {
      throw new Error(`Category by id ${categoryId} not found`);
    }

    const { categoryName, iconKey } = req.body;
    await database.query(QUERY.UPDATE_CATEGORY, [categoryName, iconKey]);
    return { id: params.id, ...params.body };
  };

  await handleApiResponse(
    (params) => updateHandler(params),
    { id: req.params.id, body: req.body },
    `Category updated successfully`,
    `Category by id ${req.params.id} not found`,
    res
  );
};

export const deleteCategory = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, deleting Category`);

    // const userId = req.headers["userId"]; // Ensure userId is passed in headers
    const categoryId = req.params.id;
    logger.info(`Fetching Category for assetId: ${categoryId}`);

    const [results] = await database.query(QUERY.DELETE_CATEGORY, [categoryId]);

    // If no matching asset is found
    if (!results || results.length === 0) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        code: httpStatus.NOT_FOUND.code,
        status: httpStatus.NOT_FOUND.status,
        message: `Category with categoryId ${categoryId} not found`,
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Category retrieved successfully`,
      data: results, // Single asset
    });
    logger.info(`Fetched Category for assetId: ${assetId}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      code: httpStatus.INTERNAL_SERVER_ERROR.code,
      status: httpStatus.INTERNAL_SERVER_ERROR.status,
      message: "Internal Server Error",
    });
  }
};
