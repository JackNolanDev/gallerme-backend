const format = require('pg-format');
const pool = require("../util/postgres-pool");
const serviceUtil = require("../util/service-utils");

const findAllArt = () => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art")
    .then(res => res.rows)
}

const findArtById = (id) => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art WHERE id = $1", [id])
    .then(res => serviceUtil.firstResult(res))
}

const findArtByUserId = (user_id) => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art WHERE user_id = $1", [user_id])
    .then(res => res.rows)
}

const findArtByColorId = (color_id) => {
    return pool.query(
        "SELECT art.id, user_id, name, size, data, creation_time "
        + "FROM art JOIN color_art_index ON art.id = color_art_index.art_id "
        + "WHERE color_art_index.color_id = $1", [color_id])
    .then(res => res.rows)
}

const searchArt = (term) => {
    // TODO: increase search capacity to look at usernames / color names or possibly even limit by sizes etc.
    const wildcard_term = "%" + term + "%";
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art WHERE name ILIKE $1 LIMIT 50",
        [wildcard_term])
    .then(res => res.rows)
}

const linkArtToColor = (art_id, color_ids) => {
    const id_pairs = color_ids.map(id => [id, art_id]);
    return pool.query(format("INSERT INTO color_art_index (color_id, art_id) VALUES %L", id_pairs))
}

const createArt = (art) => {
    return pool.query(
        "INSERT INTO art (user_id, name, size, data) VALUES "
        + "($1, $2, $3, $4) "
        + "RETURNING id, user_id, name, size, data, creation_time",
        [art.user_id, art.name, art.size, art.data])
    .then(res => res.rows[0])
    .then(new_art => {
        if (art.colors && art.colors.length > 0) {
            linkArtToColor(new_art.id, art.colors);
        }
        return new_art;
    })
}

const updateArt = (art) => {
    return pool.query("UPDATE art "
        + "SET name = $1"
        + "WHERE id = $2 "
        + "RETURNING id, user_id, name, size, data, creation_time",
        [art.name, art.id])
    .then(res => serviceUtil.firstResult(res))
}

const deleteArt = (id) => {
    return pool.query("DELETE FROM art WHERE id = $1", [id])
}

module.exports = {
    findAllArt,
    findArtById,
    findArtByUserId,
    findArtByColorId,
    searchArt,
    linkArtToColor,
    createArt,
    updateArt,
    deleteArt,
}
