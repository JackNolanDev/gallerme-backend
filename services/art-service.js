const artDao = require("../daos/art-dao");
const serviceUtil = require("../util/service-utils");

const getAllArt = (req, res) => {
    artDao.findAllArt()
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getArtByColorId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    artDao.findArtByColorId(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getArtByUserId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    artDao.findArtByUserId(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const searchArt = (req, res) => {
    const term = req.query.term;
    if (term === undefined || term === "") {
        res.sendStatus(400);
        return;
    }
    artDao.searchArt(term)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getArtById = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
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
    const art = req.body;
    if (!art.user_id || !art.name || !art.size || !art.data) {
        res.sendStatus(400);
        return;
    }

    if (serviceUtil.validateUser(req, res, art.user_id)) {
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
    if (!art.id || !art.user_id || !art.name) {
        res.sendStatus(400);
        return;
    }
    if (serviceUtil.validateID(res, art.id)) {
        return;
    }

    if (serviceUtil.validateUser(req, res, art.user_id)) {
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
    if (serviceUtil.validateID(res, id)) {
        return;
    }

    // TODO: ADD PERMISSION TESTING SOMEHOW

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
    app.get("/api/art/color/:id", getArtByColorId);
    app.get("/api/art/user/:id", getArtByUserId);
    app.get("/api/art/search", searchArt);
    app.get("/api/art/:id", getArtById);
    app.post("/api/art", createArt);
    app.put("/api/art", updateArt);
    app.delete("/api/art/:id", deleteArt);
}
