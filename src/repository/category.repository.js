const QUERY = {
  SELECT_CATEGORIES: "SELECT * FROM category WHERE userId = ? AND level = ?",

  SELECT_SUB_CATEGORIES:
    "SELECT * FROM category WHERE userId = ? AND level = ? AND parentCategoryId = ? ",

  SELECT_CATEGORY_BY_ID: "SELECT * FROM category WHERE categoryId = ?",

  CREATE_CATEGORY:
    "INSERT INTO category (categoryName, iconKey, assetType, level, userId) VALUES (?, ?, ?, ?, ?)",

  CREATE_SUB_CATEGORY:
    "INSERT INTO category (categoryName, iconKey, assetType, level, userId, parentCategoryId) VALUES (?, ?, ?, ?, ?, ?)",

  UPDATE_CATEGORY:
    "UPDATE assets SET categoryName = ?, iconKey = ?, WHERE categoryId = ?",

  DELETE_CATEGORY: "DELETE from category WHERE categoryId = ?",
};

export default QUERY;
