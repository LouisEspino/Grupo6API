CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password: admin123
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$cSdSwjAa.i8/Vd4c5p.LGu.xpdy3lEE.ThJK911TX7D7xtQjXNM1e', 'admin');
