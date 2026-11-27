CREATE TABLE IF NOT EXISTS usuarios (
    nome            TEXT NOT NULL,
    data_nascimento TEXT NOT NULL,
    email           TEXT NOT NULL, UNIQUE,
    senha           TEXT NOT NULL,
);