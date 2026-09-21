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

function showStaffPanel(area) {
  staffPanel.hidden = false;
  authArea.hidden = area !== "auth";
  applicationArea.hidden = area !== "application";
  dashboardArea.hidden = area !== "dashboard";
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
  const { data, error } = await supabaseClient
    .from("staff_profiles")
    .select("username, role, status")
    .eq("id", user.id)
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
}

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

supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session?.user) renderDashboard(data.session.user);
});
