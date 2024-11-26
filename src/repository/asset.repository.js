const QUERY = {
  SELECT_ASSETS:
    " SELECT a.* FROM assets a WHERE a.assetId IN ( SELECT ua.assetId FROM user_asset ua    WHERE ua.userId = ? ) ORDER BY createAt",
  SELECT_ASSET: "SELECT * FROM assets WHERE asset_id = ?",
  CREATE_ASSET:
    "INSERT INTO assets (assetName, firstColor, secondColor) VALUES (?, ?, ?)",
  CREATE_USER_ASSET: "INSERT INTO user_asset (userId, assetId) VALUES (?, ?)",

  UPDATE_ASSET:
    "UPDATE assets SET asset_name = ?, currency = ?, first_color = ?, second_color = ?",
  DELETE_ASSET: "",
};

export default QUERY;
