-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  oauth_provider VARCHAR(255) NOT NULL,
  oauth_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create oauth_tokens table
CREATE TABLE oauth_tokens (
  token_id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create albums table
CREATE TABLE albums (
  album_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  album_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE images (
  image_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  album_id INT REFERENCES albums(album_id),
  file_path VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);