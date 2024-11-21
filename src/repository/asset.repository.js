const QUERY = {
  SELECT_ASSETS: 'SELECT * FROM assets ORDER BY create_at',
  SELECT_ASSET: 'SELECT * FROM assets WHERE asset_id = ?',
  CREATE_ASSET:
    'INSERT INTO assets (asset_id, asset_name, currency, first_color, second_color) VALUES (?, ? , ?, ?, ?)',
  UPDATE_ASSET:
    'UPDATE assets SET asset_name = ?, currency = ?, first_color = ?, second_color = ?',
  DELETE_ASSET: '',
};

export default QUERY;
