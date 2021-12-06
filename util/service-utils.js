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

const validateAdmin = (req, res) => {
    if (req.session.user === undefined || req.session.user.role !== "ADMIN") {
        res.sendStatus(403);
        return true;
    }
    return false;
};

const validateUser = (req, res, user_id) => {
    if (validateID(res, user_id)) {
        return;
    }
    if (req.session.user === undefined || (req.session.user.id !== user_id && req.session.user.role !== "ADMIN")) {
        res.sendStatus(403);
        return true;
    }
    return false;
};

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

module.exports = {
    validateID,
    validateAdmin,
    validateUser,
    success,
    successOnly,
    fail,
    generateSalt,
    hashPassword,
}
