const colorDao = require("../daos/color-dao");
const serviceUtil = require("../util/service-utils");

const getAllColors = (req, res) => {
    // need to validate user is admin probably
    colorDao.findAllColors()
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getColorsByUserId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    colorDao.findColorsByUserId(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getColorsByArtId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    colorDao.findColorsByArtId(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const searchColors = (req, res) => {
    const term = req.query.term;
    if (term === undefined || term === "") {
        res.sendStatus(400);
        return;
    }
    colorDao.searchColors(term)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getColorById = (req, res) => {
    // need to validate user is logged in probably
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    colorDao.findColorById(id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const createColor = (req, res) => {
    // need to validate user is admin probably (regular users use signup?? E.g. starts session)
    const color = req.body;
    if (!color.user_id || !color.name || !color.color) {
        res.sendStatus(400);
        return;
    }

    if (serviceUtil.validateUser(req, res, color.user_id)) {
        return;
    }

    colorDao.createColor(color)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const updateColor = (req, res) => {
    // need to validate logged in & id matches user's id - otherwise is admin
    const color = req.body;
    if (!color.name || !color.id) {
        res.sendStatus(400);
        return;
    }
    
    if (serviceUtil.validateUser(req, res, color.user_id)) {
        return;
    }
    
    colorDao.updateColor(color)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const deleteColor = (req, res) => {
    // need to validate logged in & id matches user's id - otherwise is admin
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }

    // TODO: ADD PERMISSION TESTING SOMEHOW

    colorDao.deleteColor(id)
    // send 404 if color not found
    // shpuld maybe delete art && colors too?
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}


module.exports = (app) => {
    app.get("/api/colors", getAllColors);
    app.get("/api/colors/user/:id", getColorsByUserId);
    app.get("/api/colors/art/:id", getColorsByArtId);
    app.get("/api/colors/search", searchColors);
    app.get("/api/colors/:id", getColorById);
    app.post("/api/colors", createColor);
    app.put("/api/colors", updateColor);
    app.delete("/api/colors/:id", deleteColor);
}
