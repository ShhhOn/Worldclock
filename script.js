const TIMEZONES = [
  { group: "Americas", label: "New York (ET)", value: "America/New_York" },
  { group: "Americas", label: "Chicago (CT)", value: "America/Chicago" },
  { group: "Americas", label: "Denver (MT)", value: "America/Denver" },
  { group: "Americas", label: "Los Angeles (PT)", value: "America/Los_Angeles" },
  { group: "Americas", label: "Anchorage (AKT)", value: "America/Anchorage" },
  { group: "Americas", label: "Honolulu (HT)", value: "America/Honolulu" },
  { group: "Americas", label: "Toronto", value: "America/Toronto" },
  { group: "Americas", label: "Vancouver", value: "America/Vancouver" },
  { group: "Americas", label: "Mexico City", value: "America/Mexico_City" },
  { group: "Americas", label: "Bogota", value: "America/Bogota" },
  { group: "Americas", label: "São Paulo", value: "America/Sao_Paulo" },
  { group: "Americas", label: "Buenos Aires", value: "America/Argentina/Buenos_Aires" },

  { group: "Europe", label: "London (GMT/BST)", value: "Europe/London" },
  { group: "Europe", label: "Paris (CET)", value: "Europe/Paris" },
  { group: "Europe", label: "Berlin (CET)", value: "Europe/Berlin" },
  { group: "Europe", label: "Amsterdam (CET)", value: "Europe/Amsterdam" },
  { group: "Europe", label: "Rome (CET)", value: "Europe/Rome" },
  { group: "Europe", label: "Madrid (CET)", value: "Europe/Madrid" },
  { group: "Europe", label: "Zurich (CET)", value: "Europe/Zurich" },
  { group: "Europe", label: "Helsinki (EET)", value: "Europe/Helsinki" },
  { group: "Europe", label: "Moscow (MSK)", value: "Europe/Moscow" },
  { group: "Europe", label: "Istanbul", value: "Europe/Istanbul" },

  { group: "Asia / Pacific", label: "Dubai (GST)", value: "Asia/Dubai" },
  { group: "Asia / Pacific", label: "Mumbai (IST)", value: "Asia/Kolkata" },
  { group: "Asia / Pacific", label: "Bangkok (ICT)", value: "Asia/Bangkok" },
  { group: "Asia / Pacific", label: "Singapore (SGT)", value: "Asia/Singapore" },
  { group: "Asia / Pacific", label: "Hong Kong (HKT)", value: "Asia/Hong_Kong" },
  { group: "Asia / Pacific", label: "Shanghai (CST)", value: "Asia/Shanghai" },
  { group: "Asia / Pacific", label: "Seoul (KST)", value: "Asia/Seoul" },
  { group: "Asia / Pacific", label: "Tokyo (JST)", value: "Asia/Tokyo" },
  { group: "Asia / Pacific", label: "Sydney (AEST)", value: "Australia/Sydney" },
  { group: "Asia / Pacific", label: "Auckland (NZST)", value: "Pacific/Auckland" },

  { group: "Africa", label: "Cairo (EET)", value: "Africa/Cairo" },
  { group: "Africa", label: "Lagos (WAT)", value: "Africa/Lagos" },
  { group: "Africa", label: "Nairobi (EAT)", value: "Africa/Nairobi" },
  { group: "Africa", label: "Johannesburg (SAST)", value: "Africa/Johannesburg" },
  { group: "Africa", label: "Casablanca", value: "Africa/Casablanca" },
];

const DEFAULTS = [
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
];

const PANELS = [1, 2, 3];

function populateDropdown(selectEl, defaultTz) {
  const groups = {};
  for (const tz of TIMEZONES) {
    if (!groups[tz.group]) groups[tz.group] = [];
    groups[tz.group].push(tz);
  }

  for (const [groupName, zones] of Object.entries(groups)) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = groupName;
    for (const zone of zones) {
      const option = document.createElement("option");
      option.value = zone.value;
      option.textContent = zone.label;
      optgroup.appendChild(option);
    }
    selectEl.appendChild(optgroup);
  }

  selectEl.value = defaultTz;
}

function getTimeInZone(tz) {
  const now = new Date();

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  // Calculate UTC offset
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find((p) => p.type === "timeZoneName");
  const offset = offsetPart ? offsetPart.value : "";

  return { time, date, offset };
}

function updatePanels() {
  for (const i of PANELS) {
    const select = document.getElementById(`tz-select-${i}`);
    const tz = select.value;
    const { time, date, offset } = getTimeInZone(tz);

    document.getElementById(`time-${i}`).textContent = time;
    document.getElementById(`date-${i}`).textContent = date;
    document.getElementById(`offset-${i}`).textContent = offset;
  }
}

function loadSaved(panelIndex) {
  return localStorage.getItem(`worldclock-tz-${panelIndex}`);
}

function saveTz(panelIndex, tz) {
  localStorage.setItem(`worldclock-tz-${panelIndex}`, tz);
}

// Initialize
for (const i of PANELS) {
  const select = document.getElementById(`tz-select-${i}`);
  const saved = loadSaved(i);
  const defaultTz = saved || DEFAULTS[i - 1];

  populateDropdown(select, defaultTz);

  select.addEventListener("change", () => {
    saveTz(i, select.value);
    updatePanels();
  });
}

updatePanels();
setInterval(updatePanels, 1000);
