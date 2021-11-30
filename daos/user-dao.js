const pool = require("../util/postgres-pool");

const findAllUsers = () => {
    return pool.query("SELECT id, username, email, role, first_name, last_name, date_of_birth FROM users")
    .then(res => res.rows)
}

const findUserById = (id) => {
    return pool.query("SELECT id, username, email, role, first_name, last_name, date_of_birth FROM users WHERE id = $1", [id])
    .then(res => {
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return undefined;
    })
}

const createUser = (user) => {
    return pool.query(
        "INSERT INTO users (username, password, salt, email, role, first_name, last_name, date_of_birth) VALUES "
        + "($1, $2, $3, $4, $5, $6, $7, $8) "
        + "RETURNING id, username, email, role, first_name, last_name, date_of_birth",
        [user.username, user.password, user.salt, user.email, user.role, user.first_name, user.last_name, user.date_of_birth])
        .then(res => res.rows[0])
}

const updateUser = (user) => {
    return pool.query("UPDATE users "
        + "SET username = $1, email = $2, role = $3, first_name = $4, last_name = $5, date_of_birth = $6 "
        + "WHERE id = $7 "
        + "RETURNING id, username, email, role, first_name, last_name, date_of_birth",
        [user.username, user.email, user.role, user.first_name, user.last_name, user.date_of_birth, user.id])
        .then(res => {
            if (res.rows.length > 0) {
                return res.rows[0];
            }
            return undefined;
        })
}

const deleteUser = (id) => {
    return pool.query("DELETE FROM users WHERE id = $1", [id])
}

const login = (username, password) => {
    // 1. get full row data for user
    // 2. Hash password and compare with saved password
    // 3. If it matches, set the user session with the ID
    // possibly in a transaction for funsies
}

module.exports = {
    findAllUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
}
