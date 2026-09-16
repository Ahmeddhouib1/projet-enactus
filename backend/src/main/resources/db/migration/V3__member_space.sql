-- Member Space: internal club roster, project team assignment, and
-- attendance ("presence sheet") tracking for formations/workshops/meetings.
-- Admin-only; unrelated to the public Team page (team_members table).

CREATE TABLE members (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(50),
    photo_url     VARCHAR(500),
    department    VARCHAR(30)  NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE member_projects (
    member_id  BIGINT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, project_id)
);

CREATE TABLE activities (
    id            BIGSERIAL PRIMARY KEY,
    type          VARCHAR(20)  NOT NULL,
    title         VARCHAR(255) NOT NULL,
    activity_date DATE         NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_date ON activities (activity_date);

CREATE TABLE attendances (
    id          BIGSERIAL PRIMARY KEY,
    member_id   BIGINT    NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    activity_id BIGINT    NOT NULL REFERENCES activities (id) ON DELETE CASCADE,
    present     BOOLEAN   NOT NULL DEFAULT false,
    remark      TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uk_attendance_member_activity UNIQUE (member_id, activity_id)
);
CREATE INDEX idx_attendance_member ON attendances (member_id);
CREATE INDEX idx_attendance_activity ON attendances (activity_id);
