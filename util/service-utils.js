const { createHash, randomBytes } = require("crypto");
const { validate } = require("uuid");

// validate uuid is valid in shape
const validateID = (res, id) => {
    if (!validate(id)) {
        res.sendStatus(400);
        return true;
    }
    return false;
};

const isAdmin = (req) => {
    return !(req.session.user === undefined || req.session.user.role !== "ADMIN");
}

const isUserOrAdmin = (req, user_id) => {
    return !(req.session.user === undefined || (req.session.user.id !== user_id && req.session.user.role !== "ADMIN"));
}

const isLoggedIn = (req) => {
    return req.session.user !== undefined;
}

const validateAdmin = (req, res) => {
    if (!isAdmin(req)) {
        res.sendStatus(403);
        return true;
    }
    return false;
};

const validateUser = (req, res, user_id) => {
    if (validateID(res, user_id)) {
        return;
    }
    if (!isUserOrAdmin(req, user_id)) {
        res.sendStatus(403);
        return true;
    }
    return false;
};

const validateLoggedIn = (req, res) => {
    if (!isLoggedIn(req)) {
        res.sendStatus(403);
        return true;
    }
    return false;
}

// sends success response
const success = (res, val) => {
    if (val === undefined) {
        res.sendStatus(404);
    } else {
        res.json({ status: 0, value: val });
    }
}

const successOnly = (res) => {
    res.json({ status: 0 });
}

// sends fail response
const fail = (res, message) => {
    const response = { status: 1 };
    if (message != undefined) {
        response.msg = message;
    }
    res.json(response);
}

// generate salt for password
const generateSalt = () => randomBytes(14).toString("base64");

// salt & hash password
const hashPassword = (password, salt) => {
    const hash = createHash("sha256");
    hash.update(password);
    hash.update(salt);
    return hash.digest("hex");
}

// grab the first result from a PSQL query or undefined
const firstResult = (res) => {
    if (res.rows.length > 0) {
        return res.rows[0];
    }
    return undefined;
}

module.exports = {
    validateID,
    isAdmin,
    isUserOrAdmin,
    isLoggedIn,
    validateAdmin,
    validateUser,
    validateLoggedIn,
    success,
    successOnly,
    fail,
    generateSalt,
    hashPassword,
    firstResult,
}
