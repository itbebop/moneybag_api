import database from '../config/mariadb.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/user.query.js';

const httpStatus = {
    OK: { code: 200, status: 'OK'},
    CREATED: { code: 201, status: 'CREATED'},
    NO_CONTENT: { code: 204, status: 'NO_CONTENT'},
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST'},
    NOT_FOUND: { code: 400, status: 'NOT_FOUND'},
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR'},
};

export const getUsers = (req, res) => {
    logger.info(`${req.method} ${req.originalurl}, fetching users`);
    database.query(QUERY.SELECT_USERS, (error, results) => {
        if(!results) {
            res.status(httpStatus.OK.code)
            .send(new Response(httpStatus.OK.code, httpStatus.OK.status, `No Users found`));
        } else {
            res.status(httpStatus.OK.code)
            .send(new Response(httpStatus.OK.code, httpStatus.OK.status, `User retrieved`, { users: results }));
        }
    });
};

export const createUser = (req, res) => {
    logger.info(`${req.method} ${req.originalurl}, creating user`);
    database.query(QUERY.CREATE_USER, Object.values(req.body), (error, results) => {
        if(!results) {
            logger.error(error.message);
            res.status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(httpStatus.INTERNAL_SERVER_ERROR.code, httpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`));
        } else {
            const user = { uid: results.insertedId, ...req.body, created_at: new Date() };
            res.status(httpStatus.CREATED.code)
            .send(new Response(httpStatus.CREATED.code, httpStatus.CREATED.status, `User created`, { user }));
        }
    });
};

export const getUser = (req, res) => {
    logger.info(`${req.method} ${req.originalurl}, fetching user`);
    database.query(QUERY.SELECT_USER, [req.params.uid], (error, results) => {
        if(!results[0]) {
            res.status(httpStatus.NOT_FOUND.code)
            .send(new Response(httpStatus.NOT_FOUND.code, httpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
        } else {
            res.status(httpStatus.OK.code)
            .send(new Response(httpStatus.OK.code, httpStatus.OK.status, `User retrieved`, results[0]));
        }
    });
};

export const updateUser = (req, res) => {
    logger.info(`${req.method} ${req.originalurl}, fetching user`);
    database.query(QUERY.SELECT_USER, [req.params.uid], (error, results) => {
        if(!results[0]) {
            res.status(httpStatus.NOT_FOUND.code)
            .send(new Response(httpStatus.NOT_FOUND.code, httpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
        } else {
            logger.info(`${req.method} ${req.originalurl}, updating user`);
            database.query(QUERY.UPDATE_USER, [...Object.values(req.body), req.params.uid], (error, results) => {
                if(!error){
                    res.status(httpStatus.OK.code)
                    .send(new Response(httpStatus.OK.code, httpStatus.OK.status, `User updated`, { id: req.params.uid, ...req.body }));
                } else {
                    logger.error(error.message);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(httpStatus.INTERNAL_SERVER_ERROR.code, httpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`));
                }
            });
        }
    });
};


export default httpStatus;