-- Not every board role belongs to Marketing or Sponsoring (Team Leader, RH,
-- Project Manager, etc.), so department is no longer mandatory.
ALTER TABLE members
    ALTER COLUMN department DROP NOT NULL;

-- Seed the executive board into the internal Member roster too (they were
-- previously only public TeamMember records) so the real Project Managers
-- - Aziz Turki, Mohamed Amin Siala, Nour Chtourou - can actually appear in
-- the Project Space picker. Emails are placeholders; update them from the
-- Members admin page. No project team assignments are made here - an admin
-- still needs to assign each PM to the project(s) they actually manage.
INSERT INTO members (full_name, email, department, role, active, photo_url) VALUES
    ('Haithem Khemiri', 'haithem.khemiri@enactus-ensi.org', NULL, 'Team Leader', true, '/images/team/placeholder.svg'),
    ('Mohamed Louai Darguech', 'mohamed.darguech@enactus-ensi.org', NULL, 'Vice Team Leader', true, '/images/team/placeholder.svg'),
    ('Aziz Turki', 'aziz.turki@enactus-ensi.org', NULL, 'Project Manager', true, '/images/team/placeholder.svg'),
    ('Mohamed Amin Siala', 'amin.siala@enactus-ensi.org', NULL, 'Project Manager', true, '/images/team/placeholder.svg'),
    ('Nour Chtourou', 'nour.chtourou@enactus-ensi.org', NULL, 'Project Manager', true, '/images/team/placeholder.svg'),
    ('Mariam Hammemi', 'mariam.hammemi@enactus-ensi.org', NULL, 'Secretaire Generale', true, '/images/team/placeholder.svg'),
    ('Takwa Hadj Ltaeif', 'takwa.hadjltaeif@enactus-ensi.org', NULL, 'RH', true, '/images/team/placeholder.svg'),
    ('Miniar Derouiche', 'miniar.derouiche@enactus-ensi.org', 'MARKETING', 'Responsable Pole Marketing', true, '/images/team/placeholder.svg'),
    ('Malek Bejar', 'malek.bejar@enactus-ensi.org', 'SPONSORING', 'Responsable Sponsoring', true, '/images/team/placeholder.svg'),
    ('Hatem Ben Akacha', 'hatem.benakacha@enactus-ensi.org', NULL, 'Responsable Logistique & Financier', true, '/images/team/placeholder.svg')
ON CONFLICT (email) DO NOTHING;
