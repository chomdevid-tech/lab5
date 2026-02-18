/**
 * 1. Configuration: Using the specific proxy from your requirements
 */
const API_BASE = "https://corsproxy.io/?https://cambo-gazetteer.manethpak.dev/api/v1";

const selects = {
    province: document.getElementById("province-select"),
    district: document.getElementById("district-select"),
    commune: document.getElementById("commune-select"),
    village: document.getElementById("village-select")
};

/**
 * 2. Optimized Fetcher: Handles the .data wrapper and CORS
 */
async function getGeodata(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        const result = await response.json();
        // The API returns { data: [...] }, so we must access .data
        return result.data || []; 
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

/**
 * 3. Clean Render Function: Populates dropdowns with En/Km names
 */
function updateDropdown(element, data, label) {
    element.innerHTML = `<option value="">Select ${label}</option>`;
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.code; // Use code for the API query
        option.textContent = `${item.name_en} (${item.name_km})`;
        element.appendChild(option);
    });
}

/**
 * 4. Cascading Logic: Filters districts based on selected province
 */
selects.province.addEventListener("change", async (e) => {
    const provinceCode = e.target.value;
    
    // Clear and lock downstream selects
    selects.district.innerHTML = '<option value="">Select District</option>';
    selects.district.disabled = true;
    // ... repeat for commune/village if needed

    if (provinceCode) {
        // Fetch districts filtered by the selected province code
        const districts = await getGeodata(`/districts?province=${provinceCode}`);
        updateDropdown(selects.district, districts, "District");
        selects.district.disabled = false;
    }
});

// Initial Load
(async () => {
    const provinces = await getGeodata("/provinces");
    updateDropdown(selects.province, provinces, "Province");
})();