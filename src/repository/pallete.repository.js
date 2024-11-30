const QUERY = {
  SELECT_USER_PALLETE: "SELECT * FROM user_pallete WHERE userId = ?",

  CREATE_USER_PALLETE:
    "INSERT INTO user_pallete (hexaCode, colorOrder, userId) SELECT hexaCode, colorOrder, ? AS userId FROM user_pallete WHERE colorId BETWEEN 1 AND 20",
};

export default QUERY;
