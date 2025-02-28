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
        'turk_kahvesi.jpg',
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
        'tuborg_gold.jpeg',
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
    ('Masa 2', 'masa-2'),
    ('Masa 3', 'masa-3'),
    ('Masa 4', 'masa-4'),
    ('Masa 5', 'masa-5'),
    ('Masa 6', 'masa-6'),
    ('Masa 7', 'masa-7'),
    ('Masa 8', 'masa-8'),
    ('Masa 9', 'masa-9'),
    ('Masa 10', 'masa-10');

INSERT INTO
    settings (`key`, `value`)
VALUES
    ('logo', 'logo.png'),
    (
        'stockProductImage',
        'stockProductImage.png'
    ),
    (
        'colors',
        '{
            "text-color-3": "#999999",
            "text-color-2": "#cccccc",
            "text-color-1": "#333333",
            "text-color-4": "#aaaaaa",
            "text-color-5": "#ffffff",
            "text-color-6": "#7d5a3a",
            "text-color-7": "#5a3e1b",
            "text-color-8": "#1a1a1a",
            "text-color-9": "#eaeaea",
            "text-color-10": "#f3c47f",
            "text-color-11": "#bd2131",
            "text-color-12": "#c55c1e",
            "text-color-13": "#4bb543",
            "text-color-14": "#ff4d4d",
            "bg-color-1": "#ffffff",
            "bg-color-2": "#f5f5f5",
            "bg-color-3": "#efefef",
            "bg-color-4": "#000000",
            "bg-color-5": "#bbbbbb",
            "bg-color-6": "#eeeeee",
            "bg-color-7": "#1a1a1a",
            "bg-color-8": "#eaeaea",
            "bg-color-9": "#f3c47f",
            "bg-color-10": "#bd2131",
            "bg-color-11": "#c55c1e",
            "bg-color-12": "#4bb543",
            "bg-color-13": "#ff4d4d",
            "bg-color-14": "#cdcdcd",
            "scroll-1": "#ff6600",
            "scroll-2": "#e55b00",
            "scroll-3": "#c94e00",
            "scroll-4": "#f1f1f1",
            "border-color-1": "#cccccc",
            "border-color-2": "#dddddd",
            "border-color-3": "#e0e0e0",
            "border-color-4": "#1a1a1a"
        }'
    ),
    (
        'adress',
        '1234sk. no:1 Buca/Izmir'
    ),
    ('phone', '0512 345 67 89'),
    ('companyName', 'XYZ Cafe');