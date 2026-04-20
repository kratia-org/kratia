-- Active: 1773506900851@@103.99.32.32@25433@platform
--1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS system;
--2️⃣ Crear tabla regions
CREATE TABLE IF NOT EXISTS system.accounts (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    username VARCHAR(16) NOT NULL,
    password VARCHAR(255) NOT NULL,
    terms BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(16) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    updated_at TIMESTAMP NOT NULL,
    updated_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    deleted_at TIMESTAMP NULL,
    deleted_by UUID NULL
);