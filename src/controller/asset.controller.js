import database from '../config/mariadb.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import httpStatus from '../config/http.status.js';
import QUERY from '../repository/user.repository.js';

export const getAssetList = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching assets`);
    const [results] = await database.query(QUERY);
  } catch (error) {}
};
