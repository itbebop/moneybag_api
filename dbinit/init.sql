CREATE DATABASE IF NOT EXISTS moneybagdb;

USE moneybagdb;


-- USERS 테이블
CREATE TABLE users (
    uid             VARCHAR(255) NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    user_type       VARCHAR(255) DEFAULT 'free',
    img_url         VARCHAR(255),
    language        VARCHAR(255) DEFAULT 'ko',
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    asset_id        INT AUTO_INCREMENT PRIMARY KEY,
    asset_name      VARCHAR(255) NOT NULL,
    currency        VARCHAR(255) DEFAULT 'KRW',
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE asset_color (
    color_id        INT AUTO_INCREMENT PRIMARY KEY,
    first_color     VARCHAR(255) NOT NULL,
    second_color    VARCHAR(255) NOT NULL,
    asset_id        INT NOT NULL,
    CONSTRAINT fk_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE
);

CREATE TABLE category (
    category_id     INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    icon_key        VARCHAR(255) DEFAULT NULL,
    asset_type      VARCHAR(255) NOT NULL,
    level           INT DEFAULT 1
);

CREATE TABLE transactions (
    transaction_id      INT AUTO_INCREMENT PRIMARY KEY,
    memo                VARCHAR(255) NOT NULL,
    currency            VARCHAR(255) DEFAULT 'KRW',
    create_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category_id         INT NOT NULL,
    sub_category_id     INT,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_category FOREIGN KEY (sub_category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

CREATE TABLE user_pallete (
    color_id        INT AUTO_INCREMENT PRIMARY KEY,
    color_str       VARCHAR(255) NOT NULL,
    color_order     INT NOT NULL,
    uid             VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_pallete FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE user_user (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    uid1            VARCHAR(255) NOT NULL,
    uid2            VARCHAR(255) NOT NULL,
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_user1 FOREIGN KEY (uid1) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_user_user2 FOREIGN KEY (uid2) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE user_asset (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    uid             VARCHAR(255) NOT NULL,
    asset_id        INT NOT NULL,
    CONSTRAINT fk_user_asset1 FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_user_asset2 FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE
);
