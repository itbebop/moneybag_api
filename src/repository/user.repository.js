const QUERY = {
  SELECT_USERS: "SELECT * FROM users ORDER BY createAt DESC LIMIT 100",

  SELECT_USER: "SELECT * FROM users WHERE userId = ?",

  // CHECK_USER: "SELECT * FROM users WHERE email = ?, uid = ?",

  CREATE_USER:
    "INSERT INTO users (name, email, imgUrl, createAt, uid) VALUES (?, ?, ?, ?, ?)",

  UPDATE_USER:
    "UPDATE users SET name = ?, email = ?,  imgUrl = ? WHERE userId = ?",

  UPDATE_USER_TYPE: "UPDATE users SET userType = ? WHERE userId = ?",

  UPDATE_USER_LANGUAGE: "UPDATE users SET language = ? WHERE userId = ?",

  UPDATE_USER_ACTIVATION:
    "UPDATE users SET isActivated = ?, unActivatedAt = ? WHERE userId = ?",
};

export default QUERY;
