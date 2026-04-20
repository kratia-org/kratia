-- 1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS persons;

-- 2️⃣ Crear tabla persons.naturals
CREATE TABLE IF NOT EXISTS persons.naturals (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_uuid UUID NOT NULL,
    country_uuid UUID NULL,
    nuip VARCHAR(20) NOT NULL,
    birthdate TIMESTAMPTZ NULL,
    names VARCHAR(64) [] NULL,
    surnames VARCHAR(64) [] NULL,
    deathdate TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    deleted_by UUID NULL,

-- Constraints
CONSTRAINT persons_naturals_account_fk FOREIGN KEY (account_uuid) REFERENCES system.accounts (uuid),
    CONSTRAINT persons_naturals_country_fk FOREIGN KEY (country_uuid) REFERENCES geography.countries (uuid),
    CONSTRAINT persons_naturals_nuip_unique UNIQUE (nuip),
    CONSTRAINT persons_naturals_created_by_fk FOREIGN KEY (created_by) REFERENCES system.accounts (uuid),
    CONSTRAINT persons_naturals_updated_by_fk FOREIGN KEY (updated_by) REFERENCES system.accounts (uuid),
    CONSTRAINT persons_naturals_deleted_by_fk FOREIGN KEY (deleted_by) REFERENCES system.accounts (uuid)
);
-- Se eliminó la coma extra aquí