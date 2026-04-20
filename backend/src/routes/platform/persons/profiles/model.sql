-- 1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS persons;

-- 2️⃣ Crear tabla persons.naturals
CREATE TABLE IF NOT EXISTS persons.profiles (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_uuid UUID NOT NULL,
    phone VARCHAR(16) NOT NULL,
    email VARCHAR(256) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    deleted_by UUID NULL,

-- Constraints
CONSTRAINT persons_profiles_person_uuid_unique UNIQUE (person_uuid),
    CONSTRAINT persons_profiles_person_fk FOREIGN KEY (person_uuid) REFERENCES persons.naturals (uuid),
    CONSTRAINT persons_profiles_created_by_fk FOREIGN KEY (created_by) REFERENCES system.accounts (uuid),
    CONSTRAINT persons_profiles_updated_by_fk FOREIGN KEY (updated_by) REFERENCES system.accounts (uuid),
    CONSTRAINT persons_profiles_deleted_by_fk FOREIGN KEY (deleted_by) REFERENCES system.accounts (uuid)
);
-- Se eliminó la coma extra aquí