import database from "../config/mariadb.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import httpStatus from "../config/http.status.js";
import QUERY from "../repository/pallete.repository.js";

export const createUserPallete = async (req, res) => {
  try {
    const userId = req.body["userid"];
    const results = await database.query(QUERY.CREATE_USER_PALLETE, [userId]);
    logger.info(
      `${req.method} ${req.originalUrl}, creating user pallete to assetId ${userId}`
    );
    res
      .status(httpStatus.CREATED.code)
      .send(
        new Response(
          httpStatus.CREATED.code,
          httpStatus.CREATED.status,
          `Pallete created. id: ${results.insertId}`,
          results.insertId.toString()
        )
      );
  } catch (error) {
    logger.error(`Error creating Pallete: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred while creating pallete`
        )
      );
  }
};

export const getUserPallete = async (req, res) => {
  try {
    const userId = req.params.id;
    const results = await database.query(QUERY.SELECT_USER_PALLETE, [userId]);
    logger.info(`${req.method} ${req.originalUrl}, fetching Pallete`);
    // logger.info(`### result: ${JSON.stringify(results, null, 2)}`);

    // 결과가 없는 경우 처리
    if (!results || results.length === 0) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        code: httpStatus.NOT_FOUND.code,
        status: httpStatus.NOT_FOUND.status,
        message: `Pallete by id ${userId} not found`,
      });
    }

    res.status(httpStatus.OK.code).json({
      code: httpStatus.OK.code,
      status: httpStatus.OK.status,
      message: `UserPallete retrieved successfully`,
      data: {
        columns: ["colorId", "hexaCode", "colorOrder", "userId"],
        rows: results,
      },
    });
  } catch (error) {
    logger.error(`Error fetching pallete: ${error.message}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      code: httpStatus.INTERNAL_SERVER_ERROR.code,
      status: httpStatus.INTERNAL_SERVER_ERROR.status,
      message: "Error occurred while fetching pallete",
      error: error.message,
    });
  }
};

export default httpStatus;
