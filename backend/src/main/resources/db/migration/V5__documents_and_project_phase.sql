-- Enactus methodology phase, tracked per project for the PM's space.
ALTER TABLE projects
    ADD COLUMN phase VARCHAR(20) NOT NULL DEFAULT 'PROBLEMATIQUE';

-- Document spaces: one per project, one per department (Marketing/
-- Sponsoring), and one general space shared by all responsables.
CREATE TABLE documents (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    scope       VARCHAR(20)  NOT NULL,
    project_id  BIGINT REFERENCES projects (id) ON DELETE CASCADE,
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_document_scope ON documents (scope);
CREATE INDEX idx_document_project ON documents (project_id);
