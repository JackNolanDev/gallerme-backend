const pool = require("../util/postgres-pool");
const serviceUtil = require("../util/service-utils");

const findAllColors = () => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors")
    .then(res => res.rows)
}

const findColorById = (id) => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors WHERE id = $1", [id])
    .then(res => serviceUtil.firstResult(res))
}

const findColorsByUserId = (user_id) => {
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors WHERE user_id = $1", [user_id])
    .then(res => res.rows)
}

const findColorsByArtId = (art_id) => {
    return pool.query(
        "SELECT colors.id, user_id, name, color, creation_time "
        + "FROM colors JOIN color_art_index ON colors.id = color_art_index.color_id "
        + "WHERE color_art_index.art_id = $1", [art_id])
    .then(res => res.rows)
}

const searchColors = (term) => {
    const wildcard_term = "%" + term + "%";
    return pool.query("SELECT id, user_id, name, color, creation_time FROM colors WHERE name ILIKE $1 LIMIT 50",
        [wildcard_term])
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
    .then(res => serviceUtil.firstResult(res))
}

const deleteColor = (id) => {
    return pool.query("DELETE FROM colors WHERE id = $1", [id])
}

module.exports = {
    findAllColors,
    findColorById,
    findColorsByUserId,
    findColorsByArtId,
    searchColors,
    createColor,
    updateColor,
    deleteColor,
}
