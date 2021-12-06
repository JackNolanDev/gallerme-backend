const userDao = require("../daos/user-dao");
const serviceUtil = require("../util/service-utils");

const getAllUsers = (req, res) => {
    if (serviceUtil.validateAdmin(req, res)) {
        return;
    }
    // need to validate user is admin probably
    userDao.findAllUsers()
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const getUserById = (req, res) => {
    // need to validate user is logged in probably
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    userDao.findUserById(id)
    // send 404 if user not found
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const createUser = (req, res) => {
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

    userDao.updateUser(user)
    .then(result => serviceUtil.success(res, result))
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

    let deleteSessionUser = false;
    if (req.session.user.id === user.id) {
        deleteSessionUser = true;
    }

    userDao.deleteUser(id)
    .then(result => {
        if (deleteSessionUser) {
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
    app.get("/api/users/:id", getUserById);
    app.post("/api/users", createUser);
    app.put("/api/users", updateUser);
    app.delete("/api/users/:id", deleteUser);
}
