const pool = require("../util/postgres-pool");
const serviceUtil = require("../util/service-utils");

// helper for getting columns in user table.
// NOTE: This does NOT include the password or salt fields
const getUserColumns = (includeHidden = true) => {
    return includeHidden
        ? " users.id, users.username, users.email, users.role, users.first_name, users.last_name, users.date_of_birth "
        : " users.id, users.username, users.first_name, users.last_name ";
}

const findAllUsers = (includeHidden = true) => {
    return pool.query("SELECT" + getUserColumns(includeHidden) + "FROM users")
    .then(res => res.rows)
}

const findUserById = (id, includeHidden = true) => {
    return pool.query("SELECT" + getUserColumns(includeHidden) + "FROM users WHERE id = $1", [id])
    .then(res => serviceUtil.firstResult(res))
}

const findUserByColorId = (color_id, includeHidden = true) => {
    return pool.query(
        "SELECT" + getUserColumns(includeHidden)
        + "FROM users JOIN colors ON users.id = colors.user_id "
        + "WHERE colors.id = $1", [color_id])
    .then(res => serviceUtil.firstResult(res))
}

const findUserByArtId = (art_id, includeHidden = true) => {
    return pool.query(
        "SELECT" + getUserColumns(includeHidden)
        + "FROM users JOIN art ON users.id = art.user_id "
        + "WHERE art.id = $1", [art_id])
    .then(res => serviceUtil.firstResult(res))
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
        .then(res => serviceUtil.firstResult(res))
}

const deleteUser = (id) => {
    // TODO: update this to grab just the number of rows updated - if 0, return 404 in service
    return pool.query("DELETE FROM users WHERE id = $1", [id])
}

const validateLogin = (user) => {
    return pool.query("SELECT salt, password, " + getUserColumns() + "FROM users WHERE username = $1", [user.username])
    .then(res => {
        if (res.rows.length !== 1) {
            // user not found - incorrect username
            return false;
        }
        let userRow = res.rows[0];
        if (serviceUtil.hashPassword(user.password, userRow.salt) === userRow.password) {
            // username & password correct - DO NOT RETURN password or salt
            delete userRow.salt;
            delete userRow.password;
            return userRow;
        }
        return false;
    })
}

module.exports = {
    findAllUsers,
    findUserById,
    findUserByColorId,
    findUserByArtId,
    createUser,
    updateUser,
    deleteUser,
    validateLogin,
}
