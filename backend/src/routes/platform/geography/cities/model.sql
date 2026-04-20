--1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS geography;

--2️⃣ Crear tabla regions
CREATE TABLE IF NOT EXISTS geography.continents (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    code CHAR(3) NOT NULL,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    deleted_at TIMESTAMP NULL,
    deleted_by UUID NULL,
    CONSTRAINT geography_continents_unique UNIQUE (code, name)
);

--4️⃣ Insertar datos iniciales
INSERT INTO
    geography.continents (code, name)
VALUES ('002', 'Africa'),
    ('019', 'Americas'),
    ('142', 'Asia'),
    ('150', 'Europe'),
    ('009', 'Oceania');