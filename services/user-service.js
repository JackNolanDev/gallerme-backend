const userDao = require("../daos/user-dao");
const serviceUtil = require("../util/service-utils");

const getAllUsers = (req, res) => {
    if (serviceUtil.validateAdmin(req, res)) {
        return;
    }
    // `showHidden` is true by default because this is an admin only endpoint
    userDao.findAllUsers(true)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getUserByArtId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    userDao.findUserByArtId(id, serviceUtil.isUserOrAdmin(req, id))
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getUserByColorId = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    userDao.findUserByColorId(id, serviceUtil.isUserOrAdmin(req, id))
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getUserById = (req, res) => {
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    userDao.findUserById(id, serviceUtil.isUserOrAdmin(req, id))
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const createUser = (req, res) => {
    // this endpoint is only for admins - there is a regular endpoint in `account-service.js`
    const user = req.body;
    if (!user.username || !user.password || !user.email || !user.role) {
        res.sendStatus(400);
        return;
    }

    if (serviceUtil.validateAdmin(req, res)) {
        return;
    }

    user.salt = serviceUtil.generateSalt();
    user.password = serviceUtil.hashPassword(user.password, user.salt);

    userDao.createUser(user)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const updateUser = (req, res) => {
    // need to validate logged in & id matches user's id - otherwise is admin
    const user = req.body;
    if (!user.id || !user.username || !user.email || !user.role) {
        res.sendStatus(400);
        return;
    }

    if (serviceUtil.validateUser(req, res, user.id)) {
        return;
    }

    let updateSession = false;
    if (req.session.user.id === user.id) {
        updateSession = true;
    }

    userDao.updateUser(user)
    .then(result => {
        if (updateSession) {
            req.session.user = user;
        }
        serviceUtil.success(res, result)
    })
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const deleteUser = (req, res) => {
    const id = req.params.id;

    if (serviceUtil.validateUser(req, res, id)) {
        return;
    }

    let deleteSession = false;
    if (req.session.user.id === id) {
        deleteSession = true;
    }

    userDao.deleteUser(id)
    .then(result => {
        if (deleteSession) {
            req.session.destroy();
        }
        serviceUtil.success(res, result)
    })
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}


module.exports = (app) => {
    app.get("/api/users", getAllUsers);
    app.get("/api/users/art/:id", getUserByArtId);
    app.get("/api/users/color/:id", getUserByColorId);
    app.get("/api/users/:id", getUserById);
    app.post("/api/users", createUser);
    app.put("/api/users", updateUser);
    app.delete("/api/users/:id", deleteUser);
}
