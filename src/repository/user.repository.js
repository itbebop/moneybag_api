const QUERY = {
  SELECT_USER: "SELECT * FROM users WHERE userId = ?",

  SELECT_USER_PALLETE: "SELECT * FROM user_pallete WHERE userId = ?",

  // CHECK_USER: "SELECT * FROM users WHERE email = ?, uid = ?",

  CREATE_USER:
    "INSERT INTO users (name, email, imgUrl, createdAt, uid) VALUES (?, ?, ?, ?, ?)",

  CREATE_USER_PALLETE:
    "INSERT INTO user_pallete (hexaCode, colorOrder, userId) SELECT hexaCode, colorOrder, ? AS userId FROM user_pallete WHERE colorId BETWEEN 1 AND 20",

  UPDATE_USER:
    "UPDATE users SET name = ?, email = ?,  imgUrl = ? WHERE userId = ?",

  UPDATE_USER_TYPE: "UPDATE users SET userType = ? WHERE userId = ?",

  UPDATE_USER_LANGUAGE: "UPDATE users SET language = ? WHERE userId = ?",

  UPDATE_USER_ACTIVATION:
    "UPDATE users SET isActivated = ?, unActivatedAt = ? WHERE userId = ?",
};

export default QUERY;
