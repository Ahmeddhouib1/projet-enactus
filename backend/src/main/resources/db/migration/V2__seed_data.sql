-- Enactus ENSI Platform - development/demo seed data
-- Admin user is NOT seeded here: it is created at application startup from
-- ADMIN_EMAIL / ADMIN_PASSWORD environment variables (see AdminUserSeeder).

INSERT INTO site_content (id, enactus_description, enactus_ensi_description, mission, vision, main_concept)
VALUES (
    1,
    'Enactus is an international community of student, academic and business leaders committed to using the power of entrepreneurial action to transform lives and shape a better, more sustainable world.',
    'Enactus ENSI is the local chapter at Ecole Nationale des Sciences de l''Informatique, bringing together students who design and run social entrepreneurship projects with real, measurable impact on communities in Tunisia.',
    'Our mission is to develop the next generation of entrepreneurial leaders through experiential, project-based learning that creates sustainable social, economic and environmental value.',
    'We envision a world where entrepreneurial action is the most powerful force for building a better, more sustainable future for everyone.',
    'Enactus connects students, academics and business leaders to co-create projects that apply entrepreneurial thinking to social and environmental challenges, judged on real-world impact.'
);

INSERT INTO core_values (title, description, icon, display_order, active) VALUES
    ('Leadership', 'We empower every member to lead with vision, integrity and accountability.', 'compass', 1, true),
    ('Innovation', 'We challenge convention and design creative solutions to real problems.', 'lightbulb', 2, true),
    ('Entrepreneurship', 'We turn ideas into sustainable, scalable ventures.', 'rocket', 3, true),
    ('Social Impact', 'We measure success by the lives and communities we improve.', 'heart-handshake', 4, true),
    ('Teamwork', 'We achieve more together than any of us could alone.', 'users', 5, true),
    ('Sustainability', 'We build projects designed to last and to protect the planet.', 'leaf', 6, true);

INSERT INTO team_members (full_name, role, photo_url, display_order, active) VALUES
    ('Haithem Khemiri', 'Team Leader', '/images/team/placeholder.svg', 1, true),
    ('Mohamed Louai Darguech', 'Vice Team Leader', '/images/team/placeholder.svg', 2, true),
    ('Aziz Turki', 'Project Manager', '/images/team/placeholder.svg', 3, true),
    ('Mohamed Amin Siala', 'Project Manager', '/images/team/placeholder.svg', 4, true),
    ('Nour Chtourou', 'Project Manager', '/images/team/placeholder.svg', 5, true),
    ('Mariam Hammemi', 'Secrétaire Générale', '/images/team/placeholder.svg', 6, true),
    ('Takwa Hadj Ltaeif', 'RH', '/images/team/placeholder.svg', 7, true),
    ('Miniar Derouiche', 'Responsable Pôle Marketing', '/images/team/placeholder.svg', 8, true),
    ('Malek Bejar', 'Responsable Sponsoring', '/images/team/placeholder.svg', 9, true),
    ('Hatem Ben Akacha', 'Responsable Logistique & Financier', '/images/team/placeholder.svg', 10, true);

-- Demo content below is clearly flagged as [DEMO] and only meant to exercise the UI.

INSERT INTO projects (slug, name, short_description, full_description, context, solution, impact, objectives, cover_image, category, status, start_date, featured, display_order) VALUES
    ('demo-agrilink', '[DEMO] AgriLink', 'Connecting smallholder farmers directly to urban markets.', 'AgriLink is a demo project illustrating how Enactus ENSI teams present a full project page: problem, solution, impact and objectives.', 'Smallholder farmers lose a large share of their margin to intermediaries.', 'A mobile marketplace connecting farmers directly with urban buyers and cooperatives.', 'Demo impact figures: +30% farmer income, 120 farmers onboarded.', 'Scale to 3 additional regions and reach 500 farmers.', '/images/projects/placeholder.svg', 'Agriculture', 'ACTIVE', '2024-01-15', true, 1),
    ('demo-recycle-plus', '[DEMO] Recycle+', 'A community recycling and awareness initiative.', 'Recycle+ is a demo project showing waste-collection partnerships with local schools and municipalities.', 'Low recycling rates and limited awareness in local communities.', 'Neighborhood collection points paired with a schools awareness program.', 'Demo impact figures: 4 tons collected, 6 partner schools.', 'Expand collection points to 10 neighborhoods.', '/images/projects/placeholder.svg', 'Environment', 'IN_PROGRESS', '2025-02-01', true, 2);

INSERT INTO events (slug, name, description, cover_image, featured) VALUES
    ('demo-entrepreneurship-day', '[DEMO] Entrepreneurship Day', 'An annual flagship event bringing together students, mentors and partners around social entrepreneurship.', '/images/events/placeholder.svg', true);

INSERT INTO event_editions (event_id, edition_name, edition_year, description, start_date, end_date, location, cover_image, display_order) VALUES
    ((SELECT id FROM events WHERE slug = 'demo-entrepreneurship-day'), 'Edition 2025', 2025, 'Demo edition description with workshops, pitch competitions and networking.', '2025-11-10', '2025-11-11', 'ENSI Campus, Manouba', '/images/events/placeholder.svg', 1);

INSERT INTO partners (name, logo, website_url, description, partner_type, display_order, active) VALUES
    ('[DEMO] TechCorp', '/images/partners/placeholder.svg', 'https://example.com', 'Demo technology sponsor supporting Enactus ENSI projects.', 'SPONSOR', 1, true),
    ('[DEMO] ENSI', '/images/partners/placeholder.svg', 'https://example.com', 'Demo academic institution partner.', 'ACADEMIC', 2, true);
