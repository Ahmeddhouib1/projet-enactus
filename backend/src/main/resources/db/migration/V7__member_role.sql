-- Free-text job title on a member (e.g. "Project Manager"), used to filter
-- the Project Space's "who are you" picker to actual project managers.
ALTER TABLE members
    ADD COLUMN role VARCHAR(255);
