CREATE DATABASE IF NOT EXISTS moneybagdb;

USE moneybagdb;


-- USERS 테이블
CREATE TABLE users (
    uid             VARCHAR(255) NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    userType       VARCHAR(255) DEFAULT 'free',
    imgUrl         VARCHAR(255),
    language        VARCHAR(255) DEFAULT 'ko',
    createAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    assetId        INT AUTO_INCREMENT PRIMARY KEY,
    assetName      VARCHAR(255) NOT NULL,
    currency        VARCHAR(255) DEFAULT 'KRW',
    createAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE asset_color (
    colorId        INT AUTO_INCREMENT PRIMARY KEY,
    firstColor     VARCHAR(255) NOT NULL,
    secondColor    VARCHAR(255) NOT NULL,
    assetId        INT NOT NULL,
    CONSTRAINT fk_asset FOREIGN KEY (assetId) REFERENCES assets(assetId) ON DELETE CASCADE
);

CREATE TABLE category (
    categoryId     INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    iconKey        VARCHAR(255) DEFAULT NULL,
    assetType      VARCHAR(255) NOT NULL,
    level           INT DEFAULT 1
);

CREATE TABLE transactions (
    transactionId      INT AUTO_INCREMENT PRIMARY KEY,
    memo                VARCHAR(255) NOT NULL,
    currency            VARCHAR(255) DEFAULT 'KRW',
    createAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    categoryId         INT NOT NULL,
    subCategoryId     INT,
    CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES category(categoryId) ON DELETE CASCADE,
    CONSTRAINT fk_sub_category FOREIGN KEY (subCategoryId) REFERENCES category(categoryId) ON DELETE SET NULL
);

CREATE TABLE user_pallete (
    colorId        INT AUTO_INCREMENT PRIMARY KEY,
    colorStr       VARCHAR(255) NOT NULL,
    colorOrder     INT NOT NULL,
    uid             VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_pallete FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE user_user (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    uid1            VARCHAR(255) NOT NULL,
    uid2            VARCHAR(255) NOT NULL,
    createAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_user1 FOREIGN KEY (uid1) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_user_user2 FOREIGN KEY (uid2) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE user_asset (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    uid             VARCHAR(255) NOT NULL,
    assetId        INT NOT NULL,
    CONSTRAINT fk_user_asset1 FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_user_asset2 FOREIGN KEY (assetId) REFERENCES assets(assetId) ON DELETE CASCADE
);
