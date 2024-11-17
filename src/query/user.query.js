const QUERY = {
    SELECT_PATIENTS: 'SELECT * FROM users ORDER BY create_at DESC LIMIT 100',
    SELECT_PATIENT: 'SELECT * FROM users WHERE uid = ?',
    CREATE_PATIENT: 'INSERT INTO users (uid, name, email) VALUES (?, ?, ?)',
    UPDATE_PATIENT: 'UPDATE users SET name = ?, email = ?, user_type = ?, img_url = ?, first_pallete = ?, second_pallete = ?, language = ?',
    DELETE_PATIENT: 'DELETE FROM users WHERE uid = ?',
};

export default QUERY;