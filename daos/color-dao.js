const pool = require("../util/postgres-pool");

const findAllColors = () => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors")
    .then(res => res.rows)
}

const findColorById = (id) => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors WHERE id = $1", [id])
    .then(res => {
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return undefined;
    })
}

const findColorsByUserId = (user_id) => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors WHERE user_id = $1", [user_id])
    .then(res => res.rows)
}

const createColor = (color) => {
    return pool.query(
        "INSERT INTO colors (user_id, name, color) VALUES "
        + "($1, $2, $3) "
        + "RETURNING id, user_id, name, color, creation_time",
        [color.user_id, color.name, color.color])
    .then(res => res.rows[0])
}

const updateColor = (color) => {
    return pool.query("UPDATE colors "
        + "SET name = $1"
        + "WHERE id = $2 "
        + "RETURNING id, user_id, name, color, creation_time",
        [color.name, color.id])
    .then(res => {
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return undefined;
    })
}

const deleteColor = (id) => {
    return pool.query("DELETE FROM colors WHERE id = $1", [id])
}

module.exports = {
    findAllColors,
    findColorById,
    findColorsByUserId,
    createColor,
    updateColor,
    deleteColor,
}
