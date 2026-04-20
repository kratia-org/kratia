--1️⃣ Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS geography;
--2️⃣ Crear tabla regions
CREATE TABLE IF NOT EXISTS geography.countries (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    iso_numeric CHAR(3) NOT NULL,
    iso_alpha2 CHAR(2) NOT NULL,
    iso_alpha3 CHAR(3) NOT NULL,
    name_native VARCHAR(128) NOT NULL,
    name_common VARCHAR(128) NOT NULL,
    name_official VARCHAR(128) NOT NULL,
    flag_emoji VARCHAR(2) NOT NULL,
    flag_png VARCHAR(256) NOT NULL,
    flag_svg VARCHAR(256) NOT NULL,
    shield_png VARCHAR(256) NOT NULL,
    shield_svg VARCHAR(256) NOT NULL,
    region VARCHAR(64) NOT NULL,
    subregion VARCHAR(64) NOT NULL,
    call_code VARCHAR(4) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    deleted_at TIMESTAMP NULL,
    deleted_by UUID NULL,
    CONSTRAINT geography_countries_unique UNIQUE (
        region,
        subregion,
        iso_numeric,
        iso_alpha2,
        iso_alpha3,
        name_native,
        name_official
    )
);

--4️⃣ Insertar datos iniciales
INSERT INTO
    geography.countries (
        iso_numeric,
        iso_alpha2,
        iso_alpha3,
        name_native,
        name_common,
        name_official,
        flag_emoji,
        flag_png,
        flag_svg,
        shield_png,
        shield_svg,
        region,
        subregion,
        call_code
    )
VALUES (
        '170',
        'CO',
        'COL',
        'Colombia',
        'Colombia',
        'Republic of Colombia',
        '🇨🇴',
        'https://flagcdn.com/w320/co.png',
        'https://flagcdn.com/co.svg',
        'https://mainfacts.com/media/images/coats_of_arms/co.png',
        'https://mainfacts.com/media/images/coats_of_arms/co.svg',
        'Americas',
        'South America',
        '+57'
    )