const translations = {
  en: {
    navHome: "Home", navEvents: "Events", navStaff: "Staff", navGallery: "Gallery", navAbout: "About",
    discordButton: "Join Discord", eyebrow: "FINAL FANTASY XIV NIGHTCLUB",
    heroSubtitle: "More than a club. A higher experience.", nextEvent: "Next Event",
    discover: "Discover The LEVƎ⅃", location: "Light · Raiden · Empyreum · Ward 2 · Plot 60",
    quickEvents: "Events", quickEventsSub: "Upcoming nights", quickStaff: "Staff", quickStaffSub: "Join our team",
    quickGallery: "Gallery", quickGallerySub: "Moments & Gpose", quickAbout: "About", quickAboutSub: "Our story",
    welcomeEyebrow: "WELCOME TO", welcomeTitle: "A different level of nightlife.",
    welcomeText: "The LEVƎ⅃ is a Final Fantasy XIV nightclub built for unforgettable nights, great people, music, atmosphere and a welcoming community.",
    welcomeTextDe: "Immerse yourself in music, atmosphere and a world where fantasy meets reality.",
    moreAbout: "More about us →", nextEventLabel: "NEXT EVENT", eventTitle: "Grand Opening — Level 1",
    eventDetails: "6:00 PM ST · DJ Lineup · The LEVƎ⅃", eventDetailsButton: "Event Details",
    staffEyebrow: "BECOME PART OF IT", staffTitle: "Join the team.",
    staffText: "We are looking for friendly, reliable and creative people for our club team. Applications and staff tools will be connected in the next version.",
    applyButton: "Staff Application", galleryEyebrow: "FEATURED IMPRESSIONS", galleryTitle: "Moments after dark.",
    aboutEyebrow: "THE LEVƎ⅃", aboutTitle: "Same night. Different level.",
    aboutText: "A place for music, friendship, fantasy and expressive characters. Everyone is welcome to enjoy the atmosphere and create memories together."
  },
  de: {
    navHome: "Start", navEvents: "Events", navStaff: "Team", navGallery: "Galerie", navAbout: "Über uns",
    discordButton: "Discord beitreten", eyebrow: "FINAL FANTASY XIV NACHTCLUB",
    heroSubtitle: "Mehr als ein Club. Ein höheres Erlebnis.", nextEvent: "Nächstes Event",
    discover: "The LEVƎ⅃ entdecken", location: "Light · Raiden · Empyreum · Bezirk 2 · Grundstück 60",
    quickEvents: "Events", quickEventsSub: "Kommende Nächte", quickStaff: "Team", quickStaffSub: "Werde Teil davon",
    quickGallery: "Galerie", quickGallerySub: "Momente & Gpose", quickAbout: "Über uns", quickAboutSub: "Unsere Geschichte",
    welcomeEyebrow: "WILLKOMMEN BEI", welcomeTitle: "Nachtleben auf einem anderen Level.",
    welcomeText: "The LEVƎ⅃ ist ein Final-Fantasy-XIV-Nachtclub für unvergessliche Nächte, großartige Menschen, Musik, Atmosphäre und eine offene Community.",
    welcomeTextDe: "Tauche ein in Musik, Atmosphäre und eine Welt, in der Fantasie auf Realität trifft.",
    moreAbout: "Mehr über uns →", nextEventLabel: "NÄCHSTES EVENT", eventTitle: "Grand Opening — Level 1",
    eventDetails: "18:00 ST · DJ-Lineup · The LEVƎ⅃", eventDetailsButton: "Event-Details",
    staffEyebrow: "WERDE TEIL DAVON", staffTitle: "Werde Teil unseres Teams.",
    staffText: "Wir suchen freundliche, zuverlässige und kreative Menschen für unser Club-Team. Bewerbungen und Staff-Werkzeuge werden in der nächsten Version integriert.",
    applyButton: "Staff-Bewerbung", galleryEyebrow: "EINBLICKE", galleryTitle: "Momente nach Einbruch der Dunkelheit.",
    aboutEyebrow: "THE LEVƎ⅃", aboutTitle: "Die gleiche Nacht. Ein anderes Level.",
    aboutText: "Ein Ort für Musik, Freundschaft, Fantasie und ausdrucksstarke Charaktere. Jeder ist willkommen, die Atmosphäre zu genießen und gemeinsam Erinnerungen zu schaffen."
  }
};

let language = "en";
const toggle = document.getElementById("languageToggle");

function renderLanguage() {
  document.documentElement.lang = language;
  toggle.textContent = language === "en" ? "DE" : "EN";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = translations[language][key];
  });
}
toggle.addEventListener("click", () => {
  language = language === "en" ? "de" : "en";
  renderLanguage();
});
renderLanguage();



/* Public approved staff directory */
const publicStaffList = document.getElementById("publicStaffList");

function createStaffCard(profile) {
  const card = document.createElement("article");
  card.className = "public-staff-card";

  const image = document.createElement("img");
  image.src = profile.avatar_url || "assets/character.png";
  image.alt = `${profile.username || "Staff"} profile picture`;
  image.loading = "lazy";
  image.onerror = () => {
    image.src = "assets/character.png";
  };

  const name = document.createElement("h3");
  name.textContent = profile.username || "The LƎVE⅃ Staff";

  const role = document.createElement("div");
  role.className = "staff-role";
  role.textContent = profile.role || "Staff";

  const bio = document.createElement("p");
  bio.className = "staff-bio";
  bio.textContent = profile.bio || "A valued member of The LƎVE⅃ team.";

  card.append(image, name, role, bio);

  if (profile.discord_name) {
    const discord = document.createElement("p");
    discord.className = "muted";
    discord.textContent = `Discord: ${profile.discord_name}`;
    card.appendChild(discord);
  }

  return card;
}

async function loadPublicStaffProfiles() {
  if (!publicStaffList) return;

  const { data, error } = await supabaseClient
    .from("staff_profiles")
    .select("username, role, avatar_url, bio, discord_name, status")
    .eq("status", "approved")
    .order("username", { ascending: true });

  publicStaffList.replaceChildren();

  if (error) {
    const errorMessage = document.createElement("p");
    errorMessage.className = "public-staff-empty";
    errorMessage.textContent = "Staff profiles could not be loaded right now.";
    publicStaffList.appendChild(errorMessage);
    console.error("Public staff profile error:", error);
    return;
  }

  if (!data?.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "public-staff-empty";
    emptyMessage.textContent = "Approved staff profiles will appear here soon.";
    publicStaffList.appendChild(emptyMessage);
    return;
  }

  data.forEach((profile) => {
    publicStaffList.appendChild(createStaffCard(profile));
  });
}

/* The LEVƎ⅃ Staff Authentication */
const SUPABASE_URL = "https://uhwtdiyjkyjtpipikolh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVod3RkaXlqa3lqdHBpcGlrb2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTUzNDQsImV4cCI6MjEwNTU3MTM0NH0.9TOFWL_NcR1Iluw74YWPEYixJEh-hQ-rbxrfZ3T7Mu0";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const staffPanel = document.getElementById("staffPanel");
const authArea = document.getElementById("authArea");
const applicationArea = document.getElementById("applicationArea");
const dashboardArea = document.getElementById("dashboardArea");
const authMessage = document.getElementById("authMessage");
const applicationMessageStatus = document.getElementById("applicationMessageStatus");
const profileArea = document.getElementById("profileArea");
const profileMessage = document.getElementById("profileMessage");
const profileRoleInfo = document.getElementById("profileRoleInfo");

function showStaffPanel(area) {
  staffPanel.hidden = false;
  authArea.hidden = area !== "auth";
  applicationArea.hidden = area !== "application";
  dashboardArea.hidden = area !== "dashboard";
  if (profileArea) profileArea.hidden = area !== "dashboard";
  if (adminArea) adminArea.hidden = true;
  staffPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("openLoginButton")?.addEventListener("click", () => showStaffPanel("auth"));
document.getElementById("openApplicationButton")?.addEventListener("click", () => showStaffPanel("application"));

document.getElementById("registerButton")?.addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  authMessage.textContent = "Registrierung läuft...";
  const { error } = await supabaseClient.auth.signUp({ email, password });
  authMessage.textContent = error ? error.message : "Registrierung erfolgreich. Prüfe deine E-Mail.";
});

document.getElementById("loginButton")?.addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  authMessage.textContent = "Anmeldung läuft...";
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    authMessage.textContent = error.message;
    return;
  }
  await renderDashboard(data.user);
});

async function renderDashboard(user) {
  showStaffPanel("dashboard");
  document.getElementById("dashboardWelcome").textContent = `Angemeldet als: ${user.email}`;
  await showAdminArea(user);
  const { data, error } = await supabaseClient
    .from("staff_profiles")
    .select("username, role, status, avatar_url, bio, discord_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    document.getElementById("dashboardStatus").textContent = error.message;
    return;
  }

  if (!data) {
    document.getElementById("dashboardStatus").textContent =
      "Dein Konto ist angelegt. Dein Staff-Profil wird nach der Freischaltung durch einen Admin sichtbar.";
    return;
  }

  document.getElementById("dashboardStatus").textContent =
    `Rolle: ${data.role || "Noch nicht zugewiesen"} · Status: ${data.status || "pending"}`;

  document.getElementById("profileUsername").value = data.username || "";
  document.getElementById("profileImageUrl").value = data.avatar_url || "";
  document.getElementById("profileDiscord").value = data.discord_name || "";
  document.getElementById("profileBio").value = data.bio || "";
  profileRoleInfo.textContent = `Zugewiesene Rolle: ${data.role || "Noch nicht zugewiesen"} · Status: ${data.status || "pending"}`;
}


document.getElementById("saveProfileButton")?.addEventListener("click", async () => {
  const { data: userData } = await supabaseClient.auth.getUser();
  const user = userData?.user;
  if (!user) {
    profileMessage.textContent = "Bitte zuerst einloggen.";
    return;
  }

  profileMessage.textContent = "Profil wird gespeichert...";
  const payload = {
    username: document.getElementById("profileUsername").value.trim(),
    avatar_url: document.getElementById("profileImageUrl").value.trim(),
    discord_name: document.getElementById("profileDiscord").value.trim(),
    bio: document.getElementById("profileBio").value.trim()
  };

  const { error } = await supabaseClient
    .from("staff_profiles")
    .update(payload)
    .eq("user_id", user.id);

  profileMessage.textContent = error
    ? error.message
    : "Profil erfolgreich gespeichert.";
});

document.getElementById("logoutButton")?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showStaffPanel("auth");
  authMessage.textContent = "Du wurdest ausgeloggt.";
});

document.getElementById("submitApplicationButton")?.addEventListener("click", async () => {
  const payload = {
    name: document.getElementById("applicationName").value.trim(),
    email: document.getElementById("applicationEmail").value.trim(),
    desired_role: document.getElementById("applicationRole").value.trim(),
    experience: document.getElementById("applicationExperience").value.trim(),
    message: document.getElementById("applicationMessage").value.trim()
  };

  applicationMessageStatus.textContent = "Bewerbung wird gesendet...";
  const { error } = await supabaseClient.from("staff_applications").insert(payload);
  applicationMessageStatus.textContent = error
    ? error.message
    : "Danke! Deine Bewerbung wurde erfolgreich übermittelt.";
});

/* Admin application management
   IMPORTANT: Replace ADMIN_EMAIL with your own admin email.
   The matching Supabase RLS policies must also be created in SQL Editor. */
const ADMIN_EMAIL = "dominikpree@gmail.com";
const adminArea = document.getElementById("adminArea");
const adminMessage = document.getElementById("adminMessage");
const applicationsList = document.getElementById("applicationsList");

function isAdmin(user) {
  return Boolean(user?.email) && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

async function showAdminArea(user) {
  if (!isAdmin(user)) {
    adminMessage.textContent = "Kein Admin-Zugriff.";
    adminArea.hidden = true;
    return;
  }
  adminArea.hidden = false;
}

async function loadApplications(user) {
  if (!isAdmin(user)) {
    adminMessage.textContent = "Kein Admin-Zugriff.";
    return;
  }

  adminMessage.textContent = "Bewerbungen werden geladen...";
  applicationsList.replaceChildren();

  const { data, error } = await supabaseClient
    .from("staff_applications")
    .select("id, name, email, desired_role, experience, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    adminMessage.textContent = error.message;
    return;
  }

  if (!data?.length) {
    adminMessage.textContent = "Keine Bewerbungen vorhanden.";
    return;
  }

  data.forEach((application) => {
    const card = document.createElement("article");
    card.className = "application-card";

    const title = document.createElement("h4");
    title.textContent = `${application.name} · ${application.desired_role}`;
    card.appendChild(title);

    const details = document.createElement("p");
    details.textContent =
      `E-Mail: ${application.email} | Erstellt: ${new Date(application.created_at).toLocaleString()}`;
    card.appendChild(details);

    const experience = document.createElement("p");
    experience.textContent = `Erfahrung: ${application.experience || "Keine Angabe"}`;
    card.appendChild(experience);

    const message = document.createElement("p");
    message.textContent = application.message || "Keine Nachricht";
    card.appendChild(message);

    const select = document.createElement("select");
    ["pending", "approved", "rejected"].forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      option.selected = application.status === status;
      select.appendChild(option);
    });

    const roleInput = document.createElement("input");
    roleInput.type = "text";
    roleInput.placeholder = "Zugewiesene Staff-Rolle";
    roleInput.value = application.desired_role || "";
    roleInput.style.marginTop = "10px";
    roleInput.style.width = "100%";
    roleInput.style.boxSizing = "border-box";
    roleInput.style.padding = "10px";
    roleInput.style.borderRadius = "8px";
    roleInput.style.background = "#111";
    roleInput.style.color = "inherit";

    select.addEventListener("change", async () => {
      const { error: updateError } = await supabaseClient.rpc("admin_review_application", {
        p_application_id: application.id,
        p_new_status: select.value,
        p_assigned_role: roleInput.value.trim() || application.desired_role
      });

      adminMessage.textContent = updateError
        ? updateError.message
        : "Status aktualisiert. Bei Genehmigung wurde das Staff-Profil erstellt.";
    });

    card.appendChild(roleInput);

    card.appendChild(select);
    applicationsList.appendChild(card);
  });

  adminMessage.textContent = `${data.length} Bewerbung(en) geladen.`;
}

document.getElementById("loadApplicationsButton")?.addEventListener("click", async () => {
  const { data } = await supabaseClient.auth.getUser();
  await loadApplications(data.user);
});

supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session?.user) renderDashboard(data.session.user);
});

loadPublicStaffProfiles();


/* Admin staff profile management */
const adminProfilesArea = document.getElementById("adminProfilesArea");
const adminProfilesList = document.getElementById("adminProfilesList");

async function loadAdminProfiles(user) {
  if (!adminProfilesArea || !adminProfilesList || !isAdmin(user)) return;

  adminProfilesArea.hidden = false;
  adminProfilesList.replaceChildren();

  const { data, error } = await supabaseClient
    .from("staff_profiles")
    .select("id, username, role, avatar_url, bio, discord_name, status")
    .order("username", { ascending: true });

  if (error) {
    adminProfilesList.textContent = error.message;
    return;
  }

  if (!data?.length) {
    adminProfilesList.textContent = "Keine Staff-Profile vorhanden.";
    return;
  }

  data.forEach((profile) => {
    const card = document.createElement("article");
    card.className = "admin-profile-card";

    const title = document.createElement("h4");
    title.textContent = profile.username || "Unbenanntes Profil";
    card.appendChild(title);

    const username = document.createElement("input");
    username.placeholder = "Anzeigename";
    username.value = profile.username || "";

    const role = document.createElement("input");
    role.placeholder = "Rolle";
    role.value = profile.role || "";

    const avatar = document.createElement("input");
    avatar.placeholder = "Profilbild-URL";
    avatar.value = profile.avatar_url || "";

    const discord = document.createElement("input");
    discord.placeholder = "Discord-Name";
    discord.value = profile.discord_name || "";

    const bio = document.createElement("textarea");
    bio.placeholder = "Bio";
    bio.value = profile.bio || "";

    const status = document.createElement("select");
    ["approved", "inactive", "pending"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = profile.status === value;
      status.appendChild(option);
    });

    const save = document.createElement("button");
    save.type = "button";
    save.className = "button primary";
    save.textContent = "Profil aktualisieren";
    save.addEventListener("click", async () => {
      save.disabled = true;
      const { error: updateError } = await supabaseClient
        .from("staff_profiles")
        .update({
          username: username.value.trim(),
          role: role.value.trim(),
          avatar_url: avatar.value.trim(),
          discord_name: discord.value.trim(),
          bio: bio.value.trim(),
          status: status.value
        })
        .eq("id", profile.id);

      adminMessage.textContent = updateError
        ? updateError.message
        : "Staff-Profil erfolgreich aktualisiert.";
      save.disabled = false;
      await loadPublicStaffProfiles();
    });

    card.append(username, role, avatar, discord, bio, status, save);
    adminProfilesList.appendChild(card);
  });
}

const originalShowAdminArea = showAdminArea;
showAdminArea = async function(user) {
  await originalShowAdminArea(user);
  if (isAdmin(user)) await loadAdminProfiles(user);
};


/* Admin: create staff profile directly */
const createProfileButton = document.getElementById("createProfileButton");
createProfileButton?.addEventListener("click", async () => {
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!isAdmin(userData.user)) return;

  const message = document.getElementById("createProfileMessage");
  createProfileButton.disabled = true;

  const payload = {
    username: document.getElementById("newProfileUsername").value.trim(),
    role: document.getElementById("newProfileRole").value.trim(),
    avatar_url: document.getElementById("newProfileAvatar").value.trim(),
    discord_name: document.getElementById("newProfileDiscord").value.trim(),
    bio: document.getElementById("newProfileBio").value.trim(),
    status: document.getElementById("newProfileStatus").value
  };

  if (!payload.username) {
    message.textContent = "Bitte einen Anzeigenamen eingeben.";
    createProfileButton.disabled = false;
    return;
  }

  const { error } = await supabaseClient.rpc("admin_create_staff_profile", {
    p_username: payload.username,
    p_role: payload.role,
    p_avatar_url: payload.avatar_url,
    p_discord_name: payload.discord_name,
    p_bio: payload.bio,
    p_status: payload.status
  });

  message.textContent = error ? error.message : "Staff-Profil erstellt.";
  if (!error) {
    ["newProfileUsername","newProfileRole","newProfileAvatar","newProfileDiscord","newProfileBio"]
      .forEach((id) => { document.getElementById(id).value = ""; });
    const alignmentSelect = document.getElementById("newEventDescriptionAlign");
    if (alignmentSelect) alignmentSelect.value = "left";
    await loadAdminProfiles(userData.user);
    await loadPublicStaffProfiles();
  }
  createProfileButton.disabled = false;
});



function makeRichEditor(textarea, initialValue = "") {
  if (!textarea || textarea.dataset.richReady === "true") return textarea;
  textarea.dataset.richReady = "true";
  textarea.style.display = "none";

  const wrap = document.createElement("div");
  wrap.className = "rich-editor-wrap";
  const toolbar = document.createElement("div");
  toolbar.className = "rich-toolbar";
  const editor = document.createElement("div");
  editor.className = "rich-editor";
  editor.contentEditable = "true";
  editor.dataset.placeholder = "Beschreibung schreiben …";
  editor.innerHTML = initialValue || textarea.value || "";

  const button = (label, command, value = null) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", () => {
      editor.focus();
      document.execCommand(command, false, value);
      textarea.value = editor.innerHTML;
      editor.dispatchEvent(new Event("input", {bubbles:true}));
    });
    return b;
  };
  toolbar.append(
    button("B", "bold"),
    button("I", "italic"),
    button("U", "underline"),
    button("←", "justifyLeft"),
    button("↔", "justifyCenter"),
    button("→", "justifyRight"),
    button("• Liste", "insertUnorderedList"),
    button("1. Liste", "insertOrderedList")
  );
  const size = document.createElement("select");
  size.innerHTML = '<option value="">Schriftgröße</option><option value="2">Klein</option><option value="3">Normal</option><option value="5">Groß</option><option value="7">Sehr groß</option>';
  size.addEventListener("change", () => {
    if (!size.value) return;
    editor.focus();
    document.execCommand("fontSize", false, size.value);
    textarea.value = editor.innerHTML;
    size.value = "";
  });
  toolbar.append(size);

  const image = document.createElement("button");
  image.type = "button";
  image.textContent = "Bild einfügen";
  image.addEventListener("click", () => {
    const url = prompt("Bild-URL einfügen:");
    if (!url) return;
    editor.focus();
    document.execCommand("insertHTML", false, `<img src="${url.replace(/"/g,"&quot;")}" alt="Event-Bild">`);
    textarea.value = editor.innerHTML;
  });
  toolbar.append(image);

  editor.addEventListener("input", () => { textarea.value = editor.innerHTML; });
  wrap.append(toolbar, editor);
  textarea.parentNode.insertBefore(wrap, textarea.nextSibling);
  textarea.value = editor.innerHTML;
  return textarea;
}

function renderRichDescription(target, value, align = "left") {
  if (!target) return;
  target.innerHTML = value || "";
  target.classList.remove("description-align-left","description-align-center");
  target.classList.add(align === "center" ? "description-align-center" : "description-align-left");
}

makeRichEditor(document.getElementById("newEventDescription"));


function readDJs(prefix="newEvent") {
  return [1,2,3].map(i => ({
    slot: i,
    time: document.getElementById(`${prefix}Slot${i}Time`)?.value?.trim() || "",
    dj: document.getElementById(`${prefix}Slot${i}DJ`)?.value?.trim() || "",
    link: document.getElementById(`${prefix}Slot${i}Link`)?.value?.trim() || ""
  })).filter(x => x.time || x.dj || x.link);
}
function parseDJs(lineup) {
  try { const v = JSON.parse(lineup || ""); return Array.isArray(v) ? v : []; } catch { return []; }
}
function renderDJs(lineup) {
  const slots = parseDJs(lineup);
  if (!slots.length) return "";
  return `<div class="dj-slot-display">${slots.map(s => `<div class="dj-slot-item"><strong>Slot ${s.slot}</strong>${s.time ? ` · ${s.time}` : ""}${s.dj ? ` · ${s.link ? `<a href="${s.link.replace(/"/g,"&quot;")}" target="_blank" rel="noopener">${s.dj}</a>` : s.dj}` : ""}</div>`).join("")}</div>`;
}

/* Event management */
const publicEventsList = document.getElementById("publicEventsList");
const adminEventsArea = document.getElementById("adminEventsArea");
const adminEventsList = document.getElementById("adminEventsList");
const createEventButton = document.getElementById("createEventButton");

function eventText(value) {
  return value || "";
}

function buildPublicEventCard(event) {
  const card = document.createElement("article");
  card.className = "public-event-card";

  if (event.image_url) {
    const image = document.createElement("img");
    image.src = event.image_url;
    image.alt = event.title || "Event banner";
    image.loading = "lazy";
    card.appendChild(image);
  }

  const title = document.createElement("h3");
  title.textContent = event.title;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "muted";
  meta.textContent = [event.event_date, event.event_time, event.theme].filter(Boolean).join(" · ");
  card.appendChild(meta);

  const description = document.createElement("p");
  renderRichDescription(description, event.description, event.description_align);
  card.appendChild(description);

  const location = document.createElement("p");
  location.className = "muted";
  location.textContent = event.location || "";
  card.appendChild(location);

  if (event.lineup) {
    const lineup = document.createElement("div");
    const rendered = renderDJs(event.lineup);
    if (rendered) lineup.innerHTML = rendered;
    else lineup.textContent = `DJ-Lineup: ${event.lineup}`;
    card.appendChild(lineup);
  }

  return card;
}

async function loadPublicEvents() {
  if (!publicEventsList) return;

  const { data, error } = await supabaseClient
    .from("events")
    .select("id, title, event_date, event_time, theme, description, location, lineup, image_url, description_align, status")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true });

  publicEventsList.replaceChildren();

  if (error) {
    publicEventsList.textContent = error.message;
    return;
  }

  if (!data?.length) {
    publicEventsList.textContent = "Noch keine kommenden Events.";
    return;
  }

  data.forEach((event) => publicEventsList.appendChild(buildPublicEventCard(event)));
}

function eventInput(placeholder, value, type = "text") {
  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.value = value || "";
  input.type = type;
  return input;
}

async function loadAdminEvents(user) {
  if (!adminEventsArea || !adminEventsList || !isAdmin(user)) return;

  adminEventsArea.hidden = false;
  adminEventsList.replaceChildren();

  const { data, error } = await supabaseClient
    .from("events")
    .select("id, title, event_date, event_time, theme, description, location, lineup, image_url, description_align, status")
    .order("event_date", { ascending: true });

  if (error) {
    adminEventsList.textContent = error.message;
    return;
  }

  (data || []).forEach((event) => {
    const card = document.createElement("article");
    card.className = "admin-event-card";

    const heading = document.createElement("h4");
    heading.textContent = `Event bearbeiten: ${event.title || "Unbenanntes Event"}`;
    card.appendChild(heading);

    const editHint = document.createElement("p");
    editHint.className = "muted";
    editHint.textContent = "Felder ändern und anschließend „Speichern“ klicken.";
    card.appendChild(editHint);

    const title = eventInput("Event-Titel", event.title);
    const date = eventInput("Datum", event.event_date, "date");
    const time = eventInput("Zeit", event.event_time);
    const theme = eventInput("Theme / Genre", event.theme);
    const location = eventInput("Location", event.location);
    const lineup = eventInput("DJ-Lineup", event.lineup);
    const editDJs = document.createElement("div");
    editDJs.className = "dj-slot-display";
    editDJs.innerHTML = renderDJs(event.lineup) || "<span class='muted'>DJ-Slots werden über das neue Slot-Formular gepflegt.</span>";

    const image = eventInput("Banner-URL", event.image_url);
    const description = document.createElement("textarea");
    description.placeholder = "Beschreibung";
    description.value = event.description || "";
    makeRichEditor(description, event.description || "");
    const descriptionAlign = document.createElement("select");
    descriptionAlign.innerHTML = '<option value="left">Linksbündig</option><option value="center">Zentriert</option>';
    descriptionAlign.value = event.description_align || "left";

    const status = document.createElement("select");
    ["published", "draft"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = event.status === value;
      status.appendChild(option);
    });

    const save = document.createElement("button");
    save.type = "button";
    save.className = "button primary";
    save.textContent = "Speichern";
    save.addEventListener("click", async () => {
      save.disabled = true;
      const { error: updateError } = await supabaseClient
        .from("events")
        .update({
          title: title.value.trim(),
          event_date: date.value || null,
          event_time: time.value.trim(),
          theme: theme.value.trim(),
          location: location.value.trim(),
          lineup: lineup.value.trim(),
          image_url: image.value.trim(),
          description: description.value.trim(),
          description_align: descriptionAlign.value,
          status: status.value
        })
        .eq("id", event.id);

      adminMessage.textContent = updateError ? updateError.message : "Event gespeichert.";
      save.disabled = false;
      await loadAdminEvents(user);
      await loadPublicEvents();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button secondary";
    remove.textContent = "Löschen";
    remove.addEventListener("click", async () => {
      if (!confirm(`Event "${event.title}" wirklich löschen?`)) return;
      remove.disabled = true;
      const { error: deleteError } = await supabaseClient.from("events").delete().eq("id", event.id);
      adminMessage.textContent = deleteError ? deleteError.message : "Event gelöscht.";
      await loadAdminEvents(user);
      await loadPublicEvents();
    });

    card.append(title, date, time, theme, location, lineup, editDJs, image, description, descriptionAlign, status, save, remove);
    adminEventsList.appendChild(card);
  });
}

createEventButton?.addEventListener("click", async () => {
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!isAdmin(userData.user)) return;

  const message = document.getElementById("createEventMessage");
  createEventButton.disabled = true;

  const payload = {
    title: document.getElementById("newEventTitle").value.trim(),
    event_date: document.getElementById("newEventDate").value || null,
    event_time: document.getElementById("newEventTime").value.trim(),
    theme: document.getElementById("newEventTheme").value.trim(),
    location: document.getElementById("newEventLocation").value.trim(),
    lineup: JSON.stringify(readDJs()),
    image_url: document.getElementById("newEventImage").value.trim(),
    description: document.getElementById("newEventDescription").value.trim(),
    description_align: document.getElementById("newEventDescriptionAlign")?.value || "left",
    status: document.getElementById("newEventStatus").value
  };

  if (!payload.title || !payload.event_date) {
    message.textContent = "Bitte mindestens Titel und Datum angeben.";
    createEventButton.disabled = false;
    return;
  }

  const { error } = await supabaseClient.rpc("admin_create_event", {
    p_title: payload.title,
    p_event_date: payload.event_date,
    p_event_time: payload.event_time,
    p_theme: payload.theme,
    p_description: payload.description,
    p_location: payload.location,
    p_lineup: payload.lineup,
    p_image_url: payload.image_url,
    p_status: payload.status
  });

  message.textContent = error ? error.message : "Event erstellt.";
  if (!error) {
    ["newEventTitle","newEventDate","newEventTime","newEventTheme","newEventLineup","newEventImage","newEventDescription","newEventSlot1Time","newEventSlot1DJ","newEventSlot1Link","newEventSlot2Time","newEventSlot2DJ","newEventSlot2Link","newEventSlot3Time","newEventSlot3DJ","newEventSlot3Link"]
      .forEach((id) => { document.getElementById(id).value = ""; });
    await loadAdminEvents(userData.user);
    await loadPublicEvents();
  }
  createEventButton.disabled = false;
});

const previousShowAdminAreaForEvents = showAdminArea;
showAdminArea = async function(user) {
  await previousShowAdminAreaForEvents(user);
  if (isAdmin(user)) await loadAdminEvents(user);
};

loadPublicEvents();



function applyDescriptionAlignment(element, alignment) {
  if (!element) return;
  element.classList.remove("description-align-left", "description-align-center");
  element.classList.add(alignment === "center" ? "description-align-center" : "description-align-left");
}

/* Homepage event synchronization */
async function syncHomepageEventDetails() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("id, title, event_date, event_time, theme, description, location, lineup, image_url, description_align, status")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })
    .limit(1);

  if (error || !data?.length) return;

  const event = data[0];
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value != null) element.textContent = value;
  };

  setText("nextEventTitle", event.title);
  setText("next-event-details-title", event.title);
  setText("nextEventDescription", event.event_time || "");
  setText("next-event-details-description", event.description || "Für dieses Event wurde noch keine Beschreibung hinterlegt.");
  
  applyDescriptionAlignment(document.getElementById("next-event-details-description"), event.description_align);

  const dateElement = document.getElementById("nextEventDate");
  if (dateElement) {
    const date = new Date(`${event.event_date}T12:00:00`);
    dateElement.innerHTML = `<strong>${String(date.getDate()).padStart(2, "0")}</strong><span>${date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}<br />${date.getFullYear()}</span>`;
  }

  const details = document.getElementById("eventDetails");
  if (details) {
    details.replaceChildren();
    const detailsDescription = document.createElement("p");
    renderRichDescription(detailsDescription, event.description || "Für dieses Event wurde noch keine Beschreibung hinterlegt.", event.description_align);
    details.appendChild(detailsDescription);
    [
      ["Datum", event.event_date],
      ["Zeit", event.event_time],
      ["Theme", event.theme],
      ["Location", event.location],
      ["DJ-Lineup", event.lineup]
    ].forEach(([label, value]) => {
      if (!value) return;
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(value));
      details.appendChild(row);
    });
  }

  const button = document.getElementById("nextEventDetailsButton");
  if (button) button.href = "#next-event-details";
}

syncHomepageEventDetails();
