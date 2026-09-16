-- Enactus ENSI Platform - initial schema

CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE site_content (
    id                       BIGINT PRIMARY KEY,
    enactus_description      TEXT,
    enactus_ensi_description TEXT,
    mission                  TEXT,
    vision                   TEXT,
    main_concept             TEXT,
    created_at               TIMESTAMP NOT NULL DEFAULT now(),
    updated_at               TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE core_values (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    icon          VARCHAR(100),
    display_order INTEGER      NOT NULL DEFAULT 0,
    active        BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_value_display_order ON core_values (display_order);

CREATE TABLE team_members (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(255) NOT NULL,
    role          VARCHAR(255) NOT NULL,
    photo_url     VARCHAR(500),
    display_order INTEGER      NOT NULL DEFAULT 0,
    active        BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_team_member_display_order ON team_members (display_order);

CREATE TABLE projects (
    id                 BIGSERIAL PRIMARY KEY,
    slug               VARCHAR(255) NOT NULL UNIQUE,
    name               VARCHAR(255) NOT NULL,
    short_description  TEXT,
    full_description   TEXT,
    context            TEXT,
    solution           TEXT,
    impact             TEXT,
    objectives         TEXT,
    cover_image        VARCHAR(500),
    logo               VARCHAR(500),
    category           VARCHAR(150),
    status             VARCHAR(30)  NOT NULL DEFAULT 'IDEA',
    start_date         DATE,
    end_date           DATE,
    featured           BOOLEAN      NOT NULL DEFAULT false,
    display_order      INTEGER      NOT NULL DEFAULT 0,
    created_at         TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_project_display_order ON projects (display_order);

CREATE TABLE project_images (
    id            BIGSERIAL PRIMARY KEY,
    project_id    BIGINT       NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    image_url     VARCHAR(500) NOT NULL,
    caption       VARCHAR(500),
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_project_image_project ON project_images (project_id);

CREATE TABLE events (
    id           BIGSERIAL PRIMARY KEY,
    slug         VARCHAR(255) NOT NULL UNIQUE,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    cover_image  VARCHAR(500),
    featured     BOOLEAN      NOT NULL DEFAULT false,
    created_at   TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE event_editions (
    id            BIGSERIAL PRIMARY KEY,
    event_id      BIGINT       NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    edition_name  VARCHAR(255) NOT NULL,
    edition_year  INTEGER      NOT NULL,
    description   TEXT,
    start_date    DATE,
    end_date      DATE,
    location      VARCHAR(255),
    cover_image   VARCHAR(500),
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_edition_event ON event_editions (event_id);

CREATE TABLE event_images (
    id            BIGSERIAL PRIMARY KEY,
    edition_id    BIGINT       NOT NULL REFERENCES event_editions (id) ON DELETE CASCADE,
    image_url     VARCHAR(500) NOT NULL,
    caption       VARCHAR(500),
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_event_image_edition ON event_images (edition_id);

CREATE TABLE partners (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    logo          VARCHAR(500) NOT NULL,
    website_url   VARCHAR(500),
    description   TEXT,
    partner_type  VARCHAR(30)  NOT NULL DEFAULT 'OTHER',
    display_order INTEGER      NOT NULL DEFAULT 0,
    active        BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_partner_display_order ON partners (display_order);
