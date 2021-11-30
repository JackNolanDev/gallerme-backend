const pool = require("../util/postgres-pool");

const findAllArt = () => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art")
    .then(res => res.rows)
}

const findArtById = (id) => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art WHERE id = $1", [id])
    .then(res => {
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return undefined;
    })
}

const findArtByUserId = (user_id) => {
    return pool.query("SELECT id, user_id, name, size, data, creation_time FROM art WHERE user_id = $1", [user_id])
    .then(res => res.rows)
}

const createArt = (art) => {
    return pool.query(
        "INSERT INTO art (user_id, name, size, data) VALUES "
        + "($1, $2, $3, $4) "
        + "RETURNING id, user_id, name, size, data, creation_time",
        [art.user_id, art.name, art.size, art.data])
    .then(res => res.rows[0])
}

const updateArt = (art) => {
    return pool.query("UPDATE art "
        + "SET name = $1"
        + "WHERE id = $2 "
        + "RETURNING id, user_id, name, size, data, creation_time",
        [art.name, art.id])
    .then(res => {
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return undefined;
    })
}

const deleteArt = (id) => {
    return pool.query("DELETE FROM art WHERE id = $1", [id])
}

module.exports = {
    findAllArt,
    findArtById,
    findArtByUserId,
    createArt,
    updateArt,
    deleteArt,
}
