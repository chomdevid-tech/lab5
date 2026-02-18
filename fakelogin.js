// lab5_II.js

const API_BASE =
  "https://corsproxy.io/?https://cambo-gazetteer.manethpak.dev/api/v1";

const selects = {
  province: document.getElementById("province"),
  district: document.getElementById("district"),
  commune: document.getElementById("commune"),
  village: document.getElementById("village"),
};

// Fetch helper
async function getGeodata(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

// Populate dropdown
function updateDropdown(element, data, label) {
  element.innerHTML = `<option disabled selected>Select ${label}</option>`;
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.code || item.id; // code for API query, fallback to id
    option.textContent = item.name_en
      ? `${item.name_en} (${item.name_km})`
      : item.name;
    element.appendChild(option);
  });
  element.disabled = data.length === 0;
}

// Province → District
selects.province.addEventListener("change", async () => {
  const provinceCode = selects.province.value;

  // Reset lower selects
  selects.district.innerHTML = `<option disabled selected>Select District</option>`;
  selects.district.disabled = true;
  selects.commune.innerHTML = `<option disabled selected>Select Commune</option>`;
  selects.commune.disabled = true;
  selects.village.innerHTML = `<option disabled selected>Select Village</option>`;
  selects.village.disabled = true;

  if (provinceCode) {
    const districts = await getGeodata(`/districts?province=${provinceCode}`);
    updateDropdown(selects.district, districts, "District");
  }
});

// District → Commune
selects.district.addEventListener("change", async () => {
  const districtCode = selects.district.value;

  selects.commune.innerHTML = `<option disabled selected>Select Commune</option>`;
  selects.commune.disabled = true;
  selects.village.innerHTML = `<option disabled selected>Select Village</option>`;
  selects.village.disabled = true;

  if (districtCode) {
    const communes = await getGeodata(`/communes?district=${districtCode}`);
    updateDropdown(selects.commune, communes, "Commune");
  }
});

// Commune → Village
selects.commune.addEventListener("change", async () => {
  const communeCode = selects.commune.value;

  selects.village.innerHTML = `<option disabled selected>Select Village</option>`;
  selects.village.disabled = true;

  if (communeCode) {
    const villages = await getGeodata(`/villages?commune=${communeCode}`);
    updateDropdown(selects.village, villages, "Village");
  }
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  selects.province.selectedIndex = 0;

  selects.district.innerHTML = `<option disabled selected>Select District</option>`;
  selects.commune.innerHTML = `<option disabled selected>Select Commune</option>`;
  selects.village.innerHTML = `<option disabled selected>Select Village</option>`;

  selects.district.disabled = true;
  selects.commune.disabled = true;
  selects.village.disabled = true;
});

// Submit button
document.getElementById("submitBtn").addEventListener("click", () => {
  alert(`
Province: ${selects.province.options[selects.province.selectedIndex]?.text || ""}
District: ${selects.district.options[selects.district.selectedIndex]?.text || ""}
Commune: ${selects.commune.options[selects.commune.selectedIndex]?.text || ""}
Village: ${selects.village.options[selects.village.selectedIndex]?.text || ""}
    `);
});

// Initialize provinces on page load
(async () => {
  const provinces = await getGeodata("/provinces");
  updateDropdown(selects.province, provinces, "Province");
})();