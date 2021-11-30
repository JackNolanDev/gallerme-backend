/* UserRoles table (portable ENUM table) */
CREATE TABLE user_roles (
    role            varchar(20) PRIMARY KEY
);

/* Insert basic user roles */
INSERT INTO user_roles VALUES ('USER'), ('ADMIN');

/* Users table */
CREATE TABLE users (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username        varchar(50) UNIQUE NOT NULL,
    password        varchar(80) NOT NULL,
    salt            varchar(20) NOT NULL,
    email           varchar(50) UNIQUE NOT NULL,
    role            varchar(20) NOT NULL,
    first_name      varchar(50),
    last_name       varchar(50),
    date_of_birth   date,
    creation_time   timestamp DEFAULT current_timestamp,
    FOREIGN KEY (role) REFERENCES user_roles(role)
);

/* Art table */
CREATE TABLE art (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid,
    name            varchar(100) NOT NULL,
    size            int,
    data            varchar(1600),
    creation_time   timestamp DEFAULT current_timestamp,
    /* Could be SET NULL if we want to keep art if user leaves */
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* Colors table */
CREATE TABLE colors (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid,
    name            varchar(100) NOT NULL,
    color           varchar(10),
    creation_time   timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ColorArtIndex table */
CREATE TABLE color_art_index (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    color_id        uuid NOT NULL,
    art_id          uuid NOT NULL,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE,
    FOREIGN KEY (art_id) REFERENCES art(id) ON DELETE CASCADE,
    UNIQUE (color_id, art_id)
);

/* EXAMPLE data */
INSERT INTO users (username, password, salt, email, role, first_name, last_name, date_of_birth) VALUES
('user1', 'would be hashed if this were real', 'salty', 'email@example.com', 'USER', 'EXAMPLE', 'USER', NOW()),
('user2', 'secret password', 'salted', 'email2@example.com', 'ADMIN', NULL, NULL, NULL),
('RenaissanceMan', 'invent0r', 'salty', 'renaissanceMan@example.com', 'USER', 'Leonardo', 'da Vinci', '1452-4-15');

/* Using IDs from the data that has already been inserted above */
INSERT INTO art (user_id, name, size, data) VALUES
('49cf00e1-6ea0-4499-a11a-94a7f44aaa9d', 'underwater world of doom!', 8, '47309c6c54c4411cc4411cc4411cc420461b411cc4411cc447309c20461b27661e411cc4411cc41e096d1e096d411cc41e096d1e096d1e096d1e096d411cc41e096d411cc41e096d1e096d17094c17094c1e096d27661e1e096d411cc4411cc41e096d17094c17094c1e096d1e096d1e096d1e096d1e096d17094c17094c17094c17094c1e096d841f1f1e096d17094c17094c17094c1e096d1e096d1e096d1e096d1e096d0b1b0817094c17094c1e096d17094c17094c17094c0b1b080b1b08'),
('49cf00e1-6ea0-4499-a11a-94a7f44aaa9d', 'Pink', 2, 'ce6973f5b2b9644447ce838a'),
('612a7328-f8d9-4a9d-aa05-e33030709aa0', 'Blue Pixel', 1, '226c91');

INSERT INTO colors (user_id, name, color) VALUES
('49cf00e1-6ea0-4499-a11a-94a7f44aaa9d', 'Neat Color', '#5cadd6'),
('49cf00e1-6ea0-4499-a11a-94a7f44aaa9d', 'Fancy Schmancy Aquamarine', '#3ddc97'),
('49cf00e1-6ea0-4499-a11a-94a7f44aaa9d', 'Pink', '#f5b2b9'),
('612a7328-f8d9-4a9d-aa05-e33030709aa0', 'BLUE', '#226c91');

INSERT INTO color_art_index (color_id, art_id) VALUES
('b7335c32-4ab9-4b3a-8315-f998148df34f', '419e59b5-5cfb-4213-a1d0-ad4ce90ab319'),
('adfe12df-5cac-4f71-a073-29a7b39dc9df', 'b5713477-ed69-4d61-9bd5-94f0a759792a');
