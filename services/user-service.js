const userDao = require("../daos/user-dao");
const serviceUtil = require("../util/service-utils");

const getAllUsers = (req, res) => {
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
    // need to validate user is admin probably (regular users use signup?? E.g. starts session)
    const user = req.body;
    if (user.username === undefined || user.password === undefined || user.email === undefined || user.role === undefined) {
        res.sendStatus(400);
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
    if (user.username === undefined || user.email === undefined || user.role === undefined) {
        res.sendStatus(400);
        return;
    }
    if (serviceUtil.validateID(res, user.id)) {
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
    // need to validate logged in & id matches user's id - otherwise is admin
    // if regular user, end their session
    const id = req.params.id;
    if (serviceUtil.validateID(res, id)) {
        return;
    }
    userDao.deleteUser(id)
    // send 404 if user not found
    // shpuld maybe delete art && colors too?
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}


const currentUser = (req, res) => {
    if (!req.session.userID) {
        serviceUtil.fail(res, "Not Logged In");
    } else {
        // TODO: This should talk to the database and get info on user
        serviceUtil.success(res, req.session.userID)
    }
}

module.exports = (app) => {
    app.get("/api/users", getAllUsers);
    app.get("/api/users/current", currentUser);
    app.get("/api/users/:id", getUserById);
    app.post("/api/users", createUser);
    app.put("/api/users", updateUser);
    app.delete("/api/users/:id", deleteUser);
}
