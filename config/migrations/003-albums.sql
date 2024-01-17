-- Up
CREATE TABLE albums (
    album_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    album_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Down
DROP TABLE albums;