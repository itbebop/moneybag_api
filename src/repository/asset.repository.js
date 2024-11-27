const QUERY = {
  SELECT_ASSETS:
    " SELECT a.* FROM assets a WHERE a.assetId IN ( SELECT ua.assetId FROM user_asset ua    WHERE ua.userId = ? ) ORDER BY createdAt",

  SELECT_ASSET_BY_ID: "SELECT * FROM assets WHERE assetId = ?",

  CREATE_ASSET:
    "INSERT INTO assets (assetName, firstColor, secondColor) VALUES (?, ?, ?)",

  CREATE_USER_ASSET: "INSERT INTO user_asset (userId, assetId) VALUES (?, ?)",

  CREATE_ASSET_PALLETE:
    "INSERT INTO asset_pallete (colorStr, colorOrder, assetId) SELECT colorStr, colorOrder, ? AS assetId FROM asset_pallete WHERE colorId BETWEEN 1 AND 20",

  UPDATE_ASSET:
    "UPDATE assets SET asset_name = ?, currency = ?, firstColor = ?, secondColor = ?",
  DELETE_ASSET: "",
};

export default QUERY;
