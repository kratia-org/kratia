-- Active: 1773863035656@@103.99.32.32@25433@platform
--1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS security;
--2️⃣ Crear tabla regions
CREATE TABLE IF NOT EXISTS security.validations (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    account_uuid UUID NOT NULL,
    type VARCHAR(16) NOT NULL,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    updated_at TIMESTAMP NOT NULL,
    updated_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    deleted_at TIMESTAMP NULL,
    deleted_by UUID NULL,
    CONSTRAINT fk_account_uuid FOREIGN KEY (account_uuid) REFERENCES system.accounts (uuid),
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES system.accounts (uuid),
    CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES system.accounts (uuid),
    CONSTRAINT fk_deleted_by FOREIGN KEY (deleted_by) REFERENCES system.accounts (uuid)
);