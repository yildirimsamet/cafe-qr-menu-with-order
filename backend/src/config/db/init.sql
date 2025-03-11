DROP DATABASE IF EXISTS cafe;

CREATE DATABASE IF NOT EXISTS cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

USE cafe;

SET
    NAMES utf8mb4;

SET
    CHARACTER SET utf8mb4;

SET
    GLOBAL time_zone = '+03:00';

CREATE TABLE IF NOT EXISTS `users` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('waiter', 'admin', 'superadmin') DEFAULT 'waiter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `categories` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `items` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES `categories`(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `sizes` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS `item_sizes` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    size_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES `items`(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES `sizes`(id) ON DELETE RESTRICT,
    UNIQUE (item_id, size_id)
);

CREATE TABLE IF NOT EXISTS `tables` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_slug VARCHAR(255) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('active', 'done')),
    done_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_groups (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(10) CHECK (status IN ('waiting', 'send')),
    note TEXT,
    updated_by VARCHAR(255) REFERENCES users(username) ON DELETE
    SET
        NULL,
        created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_group_id INT REFERENCES order_groups(id) ON DELETE CASCADE,
    item_id INT NOT NULL,
    item_size_id INT,
    item_quantity INT NOT NULL CHECK (item_quantity > 0)
);

CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` LONGTEXT
);

INSERT INTO
    `categories` (name)
VALUES
    ('Kahve'),
    ('Pizza'),
    ('Tatlilar'),
    ('Bira');

-- Boyut eklemeleri
INSERT INTO
    sizes (name)
VALUES
    ('Tek Boyut'),
    ('Small'),
    ('Medium'),
    ('Large'),
    ('33cl'),
    ('50cl');

-- Ürünler ve ara tablo eklemeleri
INSERT INTO
    items (id, name, description, image, category_id)
VALUES
    (
        1,
        'Pepperoni Pizza',
        'Lezzetli pepperoni pizza',
        '',
        2
    ),
    (
        2,
        'Margherita Pizza',
        'Klasik margherita pizza',
        '',
        2
    ),
    (
        3,
        'Türk Kahvesi',
        'Sıcak türk hahvesi kahve',
        '',
        1
    ),
    (
        4,
        'Cheese Cake Limon',
        'Böğürtlenli cheesecake',
        '',
        3
    ),
    (
        5,
        'Cheese Cake Bögürtlen',
        'Limonlu cheesecake',
        '',
        3
    ),
    (
        6,
        'Tuborg Gold',
        'Tuborg Gold Bira',
        '',
        4
    ),
    (7, 'Efes Pilsen ', 'Efes Bira', '', 4);

INSERT INTO
    item_sizes (item_id, size_id, price)
VALUES
    (1, 2, 15.99),
    (1, 3, 16.99),
    (1, 4, 17.99),
    (2, 2, 12.99),
    (2, 3, 13.99),
    (2, 4, 14.99),
    (3, 1, 9.99),
    (4, 1, 9.99),
    (5, 1, 9.99),
    (6, 5, 5.99),
    (6, 6, 6.99),
    (7, 5, 5.99),
    (7, 6, 6.99);

INSERT INTO
    `tables` (name, slug)
VALUES
    ('Masa 1', 'masa-1'),
    ('Masa 2', 'masa-2');

INSERT INTO
    settings (`key`, `value`)
VALUES
    ('logo', 'default_logo.webp'),
    (
        'colors',
        '{
            "bg-1": "#143642",
            "bg-1-dark": "#263c41",
            "bg-1-darker": "#38413f",
            "bg-2": "#b76935",
            "bg-2-dark": "#a56336",
            "bg-2-darker": "#935e38",
            "bg-3": "#d7d7d7",
            "bg-4": "#efefef",
            "bg-5": "#e5e5e5",
            "text-1": "#336475",
            "text-1-dark": "#3a5258",
            "text-1-darker": "#46524f",
            "text-2": "#b76935",
            "text-2-dark": "#a56336",
            "text-2-darker": "#935e38",
            "text-3": "#ECF2F3",
            "text-4": "#cbcbcb",
            "text-accent-1": "#e5ac5c",
            "text-accent-2": "#D4A96A",
            "border-1": "#4e8a9e",
            "border-2": "#8A4B2D",
            "border-neutral": "#7D8E95",
            "accent-1": "#e5ac5c",
            "accent-2": "#D4A96A",
            "success": "#379b52",
            "danger": "#d32f2f",
            "warning": "#c59238"
        }'
    ),
    (
        'address',
        '1234sk. no:1 Buca/Izmir'
    ),
    ('phoneNumber', '0512 345 67 89'),
    ('companyName', 'XYZ Cafe');

INSERT INTO
    users (username, password, role)
VALUES
    (
        'superadmin',
        '$2b$10$dU6x1dNOu9ORbBRFrkLZn.5yj4HpREra7Ezgd7qGQqaq/XuqrEjXu',
        'superadmin'
    );