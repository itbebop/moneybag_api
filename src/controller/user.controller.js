import database from '../config/mariadb.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import httpStatus from '../config/http.status.js';
import QUERY from '../repository/user.repository.js';

export const getUsers = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching users`);

    const [results] = await database.query(QUERY.SELECT_USERS); // query는 프로미스 기반 함수로 가정
    logger.info(`Fetched users: ${JSON.stringify(results)}`);

    if (!results || results.length === 0) {
      logger.info('No Users found');
      return res
        .status(httpStatus.OK.code)
        .send(
          new Response(
            httpStatus.OK.code,
            httpStatus.OK.status,
            `No Users found`
          )
        );
    }

    logger.info('Users retrieved successfully');
    res
      .status(httpStatus.OK.code)
      .send(
        new Response(
          httpStatus.OK.code,
          httpStatus.OK.status,
          `Users retrieved`,
          { users: results }
        )
      );
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error fetching users`,
          { error: error.message }
        )
      );
  }
};

export const createUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, creating user`);
    const results = await database.query(
      QUERY.CREATE_USER,
      Object.values(req.body)
    );
    const user = { uid: results.insertId, ...req.body, created_at: new Date() };
    res
      .status(httpStatus.CREATED.code)
      .send(
        new Response(
          httpStatus.CREATED.code,
          httpStatus.CREATED.status,
          `User created`,
          { user }
        )
      );
  } catch (error) {
    logger.error(error.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const getUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    const results = await database.query(QUERY.SELECT_USER, [req.params.uid]);
    if (!results[0]) {
      return res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `User by id ${req.params.uid} was not found`
          )
        );
    }
    res
      .status(httpStatus.OK.code)
      .send(
        new Response(
          httpStatus.OK.code,
          httpStatus.OK.status,
          `User retrieved`,
          results[0]
        )
      );
  } catch (error) {
    logger.error(error.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const updateUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    const user = await database.query(QUERY.SELECT_USER, [req.params.uid]);
    if (!user[0]) {
      return res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `User by id ${req.params.uid} was not found`
          )
        );
    }

    logger.info(`${req.method} ${req.originalUrl}, updating user`);
    await database.query(QUERY.UPDATE_USER, [
      ...Object.values(req.body),
      req.params.uid,
    ]);
    res.status(httpStatus.OK.code).send(
      new Response(httpStatus.OK.code, httpStatus.OK.status, `User updated`, {
        id: req.params.uid,
        ...req.body,
      })
    );
  } catch (error) {
    logger.error(error.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const deleteUser = async (req, res) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, deleting user`);
    const results = await database.query(QUERY.DELETE_USER, [req.params.uid]);
    if (results.affectedRows > 0) {
      res
        .status(httpStatus.OK.code)
        .send(
          new Response(httpStatus.OK.code, httpStatus.OK.status, `User deleted`)
        );
    } else {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `User by id ${req.params.uid} was not found`
          )
        );
    }
  } catch (error) {
    logger.error(error.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export default httpStatus;
