CREATE DATABASE IF NOT EXISTS moneybagdb;

USE moneybagdb;

DROP TABLE IF EXISTS moneybagdb;

CREATE TABLE user (
    uid             VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    user_type       VARCHAR(255) NOT NULL,
    img_url         VARCHAR(255) NOT NULL,
    first_pallete   VARCHAR(255) NOT NULL,
    second_pallete  VARCHAR(255) NOT NULL,
    languager       VARCHAR(255) NOT NULL,   
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid),
    CONSTRAINT UQ_User_Email UNIQUE (email)
)
