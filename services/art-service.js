const artDao = require("../daos/art-dao");
const serviceUtil = require("../util/service-utils");

const getAllArt = (req, res) => {
    // need to validate user is admin probably
    artDao.findAllArt()
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getArtById = (req, res) => {
    // need to validate user is logged in probably
    const id = req.params.id;
    if (validateID(res, id)) {
        return;
    }
    artDao.findArtById(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const createArt = (req, res) => {
    // need to validate user is admin probably (regular users use signup?? E.g. starts session)
    const art = req.body;
    if (!art.user_id || !art.name || !art.size || !art.data) {
        res.sendStatus(400);
    }
    if (validateID(res, art.user_id)) {
        return;
    }
    artDao.createArt(art)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const updateArt = (req, res) => {
    // need to validate logged in & id matches user's id - otherwise is admin
    const art = req.body;
    if (!art.name || !art.id) {
        res.sendStatus(400);
    }
    if (validateID(res, art.id)) {
        return;
    }
    artDao.updateArt(art)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const deleteArt = (req, res) => {
    // need to validate logged in & id matches user's id - otherwise is admin
    const id = req.params.id;
    if (validateID(res, id)) {
        return;
    }
    artDao.deleteArt(id)
    // send 404 if art not found
    // shpuld maybe delete art && colors too?
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

module.exports = (app) => {
    app.get("/api/art", getAllArt);
    app.get("/api/art/:id", getArtById);
    app.post("/api/art", createArt);
    app.put("/api/art", updateArt);
    app.delete("/api/art/:id", deleteArt);
}
