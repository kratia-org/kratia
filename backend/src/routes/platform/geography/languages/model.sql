-- Active: 1774966623821@@172.16.1.20@5432@platform
--1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS geography;

--2️⃣ Crear tabla languages
CREATE TABLE IF NOT EXISTS geography.languages (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    country_iso_alpha_2 CHAR(2) NOT NULL,
    iso_alpha2 CHAR(2) NOT NULL,
    iso_alpha3 CHAR(3) NOT NULL,
    name_native VARCHAR(64) NOT NULL,
    name_official VARCHAR(64) NOT NULL,
    flag_emoji VARCHAR(2) NOT NULL,
    flag_png VARCHAR(255) NOT NULL,
    flag_svg VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    deleted_at TIMESTAMP NULL,
    deleted_by UUID NULL,
    CONSTRAINT geography_languages_unique UNIQUE (
        country_iso_alpha_2,
        iso_alpha2,
        iso_alpha3,
        name_native,
        name_official
    )
);

--4️⃣ Insertar datos iniciales
INSERT INTO
    geography.languages (
        country_iso_alpha_2,
        iso_alpha2,
        iso_alpha3,
        name_native,
        name_official,
        flag_emoji,
        flag_png,
        flag_svg
    )
VALUES (
        'us',
        'en',
        'eng',
        'English',
        'English',
        '🇺🇸',
        'https://flagcdn.com/w320/us.png',
        'https://flagcdn.com/us.svg'
    );