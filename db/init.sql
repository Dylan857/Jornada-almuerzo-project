CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    quantity_requested INT NOT NULL,
    quantity_completed INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    recipe_id INT REFERENCES recipes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    stock INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_history (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id),
    change INT NOT NULL,
    reason VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id),
    ingredient_id INT REFERENCES ingredients(id),
    quantity INT NOT NULL
);

CREATE TABLE market_purchases (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id),
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ingredients_name ON ingredients(name);

INSERT INTO ingredients (name, stock) VALUES
('tomato', 5),
('lemon', 5),
('potato', 5),
('rice', 5),
('ketchup', 5),
('lettuce', 5),
('onion', 5),
('cheese', 5),
('meat', 5),
('chicken', 5);

INSERT INTO recipes (name, difficulty) VALUES
('Burger', 'easy'),
('Chicken Rice', 'medium'),
('Fresh Salad', 'easy'),
('Grilled Chicken', 'medium'),
('Cheese Potato Bowl', 'easy'),
('Rice Meat Bowl', 'medium');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(1, 9, 1),
(1, 8, 1),
(1, 1, 1),
(1, 6, 1),
(1, 5, 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(2, 10, 1),
(2, 4, 1),
(2, 7, 1),
(2, 1, 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(3, 6, 1),
(3, 1, 1),
(3, 7, 1),
(3, 2, 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(4, 10, 1),
(4, 7, 1),
(4, 2, 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(5, 3, 1),
(5, 8, 1),
(5, 7, 1),
(5, 5, 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(6, 4, 1),
(6, 9, 1),
(6, 7, 1),
(6, 1, 1);