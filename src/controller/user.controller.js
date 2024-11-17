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


export default httpStatus;