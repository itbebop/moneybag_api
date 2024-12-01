const QUERY = {
  SELECT_CATEGORIES: "SELECT * FROM category WHERE userId = ?, level = ?",

  SELECT_CATEGORY_BY_ID: "SELECT * FROM category WHERE categoryId = ?",

  CREATE_CATEGORY:
    "INSERT INTO category (categoryName, iconKey, assetType, level, userId) VALUES (?, ?, ?, ?, ?)",

  UPDATE_CATEGORY:
    "UPDATE assets SET assetName = ?, currency = ?, firstColor = ?, secondColor = ? WHERE categoryId = ?",

  DELETE_CATEGORY: "DELETE from category WHERE categoryId = ?",
};

export default QUERY;
