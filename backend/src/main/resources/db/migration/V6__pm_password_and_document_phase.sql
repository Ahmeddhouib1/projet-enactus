-- Self-service password for each member's personal Project Space (a
-- lightweight unlock layered on top of the admin login, set on first use).
ALTER TABLE members
    ADD COLUMN pm_password_hash VARCHAR(255);

-- Which methodology phase a project document belongs to (only meaningful
-- when the document's scope is PROJECT).
ALTER TABLE documents
    ADD COLUMN phase VARCHAR(20);
