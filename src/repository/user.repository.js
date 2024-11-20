const QUERY = {
    // SELECT_USERS: 'SELECT * FROM users ORDER BY create_at DESC LIMIT 100',
    SELECT_USERS: 'SELECT * FROM users',
    SELECT_USER: 'SELECT * FROM users WHERE uid = ?',
    CREATE_USER: 'INSERT INTO users (uid, name, email) VALUES (?, ?, ?)',
    UPDATE_USER: 'UPDATE users SET name = ?, email = ?, user_type = ?, img_url = ?, first_pallete = ?, second_pallete = ?, language = ?',
    DELETE_USER: 'DELETE FROM users WHERE uid = ?',
};

export default QUERY;