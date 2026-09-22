THE LƎVE⅃ — Cyberpunk Nightclub Website
============================================

Version 1 starter website.

FILES
- index.html  -> page structure/content
- style.css   -> visual design/animations
- script.js   -> boot sequence/interactions
- assets/     -> place your club images here

OPENING
Double-click index.html to preview it locally in a browser.

CUSTOMIZATION
1. Replace the gallery placeholders in index.html with your images.
2. Change event text/dates in the EVENTS section.
3. Replace the # Discord link with your real Discord invite.
4. You can later connect this frontend to Supabase for dynamic events/staff/gallery.

Branding used: The LƎVE⅃
Location used from the supplied club information: Light • Raiden • Empyreum • Ward 2 • Plot 60


ADMIN-ONLY STAFF MANAGEMENT
============================
The public site only displays staff. Adding/editing/deleting staff requires Supabase Auth plus an entry in public.admin_users.

Setup:
1. Create your own user in Supabase Authentication.
2. Run supabase-staff-setup.sql in Supabase SQL Editor.
3. Copy your Supabase public anon key into supabase-config.js.
4. Copy your Auth user's UUID into the admin_users table using the SQL comment at the bottom of the setup file.
5. Deploy the project again.

Do NOT put a Supabase service_role key in the frontend.
