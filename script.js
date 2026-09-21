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
