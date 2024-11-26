CREATE DATABASE IF NOT EXISTS moneybagdb;

USE moneybagdb;

CREATE TABLE users (
    userId          INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    uid             VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    userType        VARCHAR(255) DEFAULT 'free',
    imgUrl          VARCHAR(255),
    language        VARCHAR(255) DEFAULT 'ko',
    createAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted       BOOL DEFAULT FALSE,
    deletedAt       TIMESTAMP
);

CREATE TABLE user_pallete (
    colorId        INT AUTO_INCREMENT PRIMARY KEY,
    colorStr       VARCHAR(20),
    colorOrder     INT NOT NULL,
    userId         INT,
    CONSTRAINT fk_user_pallete FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE assets (
    assetId        INT AUTO_INCREMENT PRIMARY KEY,
    assetName      VARCHAR(255) NOT NULL,
    currency       VARCHAR(3) DEFAULT 'KRW',
    createAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActivated    BOOL DEFAULT TRUE,
    firstColor     INT NOT NULL,
    secondColor    INT NOT NULL,
    CONSTRAINT fk_asset_firstColor FOREIGN KEY (firstColor) REFERENCES user_pallete(colorId) ON DELETE CASCADE,
    CONSTRAINT fk_asset_secondColor FOREIGN KEY (secondColor) REFERENCES user_pallete(colorId) ON DELETE CASCADE
);

CREATE TABLE category (
    categoryId     INT AUTO_INCREMENT PRIMARY KEY,
    categoryName   VARCHAR(255) NOT NULL,
    iconKey        VARCHAR(255) DEFAULT NULL,
    assetType      VARCHAR(255) NOT NULL,
    level          INT DEFAULT 1
);

CREATE TABLE transactions (
    transactionId      INT AUTO_INCREMENT PRIMARY KEY,
    memo               VARCHAR(255) NOT NULL,
    amount             DOUBLE NOT NULL,
    currency           VARCHAR(3) DEFAULT 'KRW',
    createAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    imgUrl             VARCHAR(255), 
    categoryId         INT NOT NULL,
    subCategoryId      INT,
    userId             INT NOT NULL,
    assetId            INT NOT NULL,
    CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES category(categoryId) ON DELETE CASCADE,
    CONSTRAINT fk_sub_category FOREIGN KEY (subCategoryId) REFERENCES category(categoryId) ON DELETE SET NULL,
    CONSTRAINT fk_transaction_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_asset FOREIGN KEY (assetId) REFERENCES assets(assetId) ON DELETE CASCADE
);

CREATE TABLE user_user (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId1         INT NOT NULL,
    userId2         INT NOT NULL,
    createAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_user1 FOREIGN KEY (userId1) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_user_user2 FOREIGN KEY (userId2) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE user_asset (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId          INT NOT NULL,
    assetId         INT NOT NULL,
    -- firstColor      INT NOT NULL,
    -- secondColor     INT NOT NULL,
    CONSTRAINT fk_user_asset_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_user_asset_asset FOREIGN KEY (assetId) REFERENCES assets(assetId) ON DELETE CASCADE,
    -- CONSTRAINT fk_user_asset_firstColor FOREIGN KEY (firstColor) REFERENCES user_pallete(colorId) ON DELETE CASCADE,
    -- CONSTRAINT fk_user_asset_secondColor FOREIGN KEY (secondColor) REFERENCES user_pallete(colorId) ON DELETE CASCADE
);

INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#fff44336', 1);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff4caf50', 2);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff2196f3', 3);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffff9800', 4);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff9c27b0', 5);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffe91e63', 6);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff009688', 7);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffffeb3b', 8);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff795548', 9);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff00bcd4', 10);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffcddc39', 11);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff3f51b5', 12);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff9e9e9e', 13);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffffffff', 14);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff428cc7', 15);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff8097a9', 16);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff002b4d', 17);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#fffced69', 18);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ffff0004', 19);
INSERT INTO user_pallete ( colorStr, colorOrder ) VALUES ( '#ff043053', 20);

