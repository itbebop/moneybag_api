CREATE DATABASE IF NOT EXISTS moneybagdb;

USE moneybagdb;

DROP TABLE IF EXISTS moneybagdb;

CREATE TABLE users (
    uid             VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    user_type       VARCHAR(255) 'free',
    img_url         VARCHAR(255),
    first_pallete   VARCHAR(255),
    second_pallete  VARCHAR(255),
    language        VARCHAR(255) 'ko',   
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid),
    CONSTRAINT UQ_User_Email UNIQUE (email)
)
