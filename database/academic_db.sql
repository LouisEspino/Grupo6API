CREATE DATABASE IF NOT EXISTS academic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academic_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  materia ENUM(
    'Metodología para el Desarrollo de Sistemas',
    'Arquitectura de Software',
    'Bases de Datos Avanzadas'
  ) NOT NULL,
  calificacion DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
