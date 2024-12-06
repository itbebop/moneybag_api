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
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted       BOOL DEFAULT FALSE,
    deletedAt       TIMESTAMP
);

CREATE TABLE user_pallete (
    colorId        INT AUTO_INCREMENT PRIMARY KEY,
    hexaCode       VARCHAR(20),
    colorOrder     INT NOT NULL,
    userId         INT,
    CONSTRAINT fk_user_pallete FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE assets (
    assetId        INT AUTO_INCREMENT PRIMARY KEY,
    assetName      VARCHAR(255) NOT NULL,
    currency       VARCHAR(3) DEFAULT 'KRW',
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActivated    BOOL DEFAULT TRUE,
    firstColor     VARCHAR(20),
    secondColor    VARCHAR(20)
);

CREATE TABLE category (
    categoryId          INT AUTO_INCREMENT PRIMARY KEY,
    categoryName        VARCHAR(255) NOT NULL,
    iconKey             VARCHAR(255) DEFAULT NULL,
    assetType           VARCHAR(255) NOT NULL,
    level               INT DEFAULT 1,
    userId              INT,
    parentCategoryId    INT DEFAULT NULL,
    CONSTRAINT fk_user_palette FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_parent_category FOREIGN KEY (parentCategoryId) REFERENCES category(categoryId) ON DELETE SET NULL
);


CREATE TABLE transactions (
    transactionId      INT AUTO_INCREMENT PRIMARY KEY,
    memo               VARCHAR(255) NOT NULL,
    amount             DOUBLE NOT NULL,
    currency           VARCHAR(3) DEFAULT 'KRW',
    createdAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_user1 FOREIGN KEY (userId1) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_user_user2 FOREIGN KEY (userId2) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE user_asset (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId          INT NOT NULL,
    assetId         INT NOT NULL,
    CONSTRAINT fk_user_asset_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT fk_user_asset_asset FOREIGN KEY (assetId) REFERENCES assets(assetId) ON DELETE CASCADE
);

INSERT INTO user_pallete (hexaCode, colorOrder) VALUES
('#FFFFFFFF', 1),
('#FF9E9E9E', 2),
('#FFE91E63', 3),
('#FFF44336', 4),
('#FFFF9800', 5),
('#FFCDDC39', 6),
('#FFFFEB3B', 7),
('#FF4CAF50', 8),
('#FF009688', 9),
('#FF795548', 10),
('#FF00BCD4', 11),
('#FF2196F3', 12),
('#FF3F51B5', 13),
('#FF9C27B0', 14);

