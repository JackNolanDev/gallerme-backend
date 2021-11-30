const { createHash, randomBytes } = require("crypto");
const { validate } = require("uuid");

const validateID = (res, id) => {
    const check = !validate(id);
    if (check) {
        res.sendStatus(400);
    }
    return check;
};

// sends success response
const success = (res, val) => {
    if (val === undefined) {
        res.sendStatus(404);
    } else {
        const response = { status: 0 };
        if (val != undefined) {
            response.value = val;
        }
        res.json(response);
    }
}

// sends fail response
const fail = (res, message) => {
    const response = { status: 1 };
    if (message != undefined) {
        response.msg = message;
    }
    res.json(response);
}

const generateSalt = () => randomBytes(14).toString("base64");

const hashPassword = (password, salt) => {
    const hash = createHash("sha256");
    hash.update(password);
    hash.update(salt);
    return hash.digest("hex");
}

module.exports = {
    validateID,
    success,
    fail,
    generateSalt,
    hashPassword,
}
