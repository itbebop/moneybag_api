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
    const isCategory = parentCategoryId === null;

    const query = isCategory
      ? QUERY.CREATE_CATEGORY
      : QUERY.CREATE_SUB_CATEGORY;
    // logger.info(`### query : ${query}`);

    const params = isCategory
      ? [categoryName, iconKey, assetType, level, userId]
      : [categoryName, iconKey, assetType, level, userId, parentCategoryId];
    // logger.info(`### params : ${params}`);
    // if (isCategory) {
    //   logger.info(`### parentCategoryId : ${parentCategoryId}`);
    // }

    const results = await database.query(query, params);
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
    const parentCategoryId = req.headers["parentcategoryid"];
    const isCategory = parentCategoryId == 0;
    logger.info(`### headers : ${JSON.stringify(req.headers)}`);
    logger.info(
      `${req.method} ${req.originalUrl}, fetching Categories by id : ${userId}`
    );

    const query = isCategory
      ? QUERY.SELECT_CATEGORIES
      : QUERY.SELECT_SUB_CATEGORIES;
    // logger.info(`### query : ${query}`);

    const params = isCategory
      ? [userId, level]
      : [userId, level, parentCategoryId];
    // logger.info(`### params : ${params}`);
    // if (isCategory) {
    //   logger.info(`### parentCategoryId : ${parentCategoryId}`);
    // }

    const results = await database.query(query, params);

    if (!results || results.length === 0) {
      return res.status(httpStatus.OK.code).json({
        code: httpStatus.OK.code,
        status: httpStatus.OK.status,
        message: `No Categories found for user id ${userId}`,
        data: {},
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `Categories by id ${userId} retrieved successfully`,
      data: {
        results,
      },
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
