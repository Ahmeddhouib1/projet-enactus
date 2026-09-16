-- Each activity now targets an audience: everyone, one department, or one
-- project's team. Existing activities default to ALL (unchanged behavior).

ALTER TABLE activities
    ADD COLUMN scope_type       VARCHAR(20) NOT NULL DEFAULT 'ALL',
    ADD COLUMN scope_department VARCHAR(30),
    ADD COLUMN scope_project_id BIGINT REFERENCES projects (id) ON DELETE SET NULL;

CREATE INDEX idx_activity_scope_project ON activities (scope_project_id);
