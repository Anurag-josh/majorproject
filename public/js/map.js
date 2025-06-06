document.addEventListener("DOMContentLoaded", () => {
    const location = document.getElementById('map').getAttribute('data-location');
    const country = document.getElementById('map').getAttribute('data-country');
  
    const map = L.map('map').setView([19.0760, 72.8777], 5); // Mumbai as default view
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    async function geocodeLocation() {
      const searchQuery = `${location}, ${country}`;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
  
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 13);
          L.marker([lat, lon]).addTo(map)
            .bindPopup(`${location}, ${country}`)
            .openPopup();
        } else {
          alert("Location not found.");
        }
      } catch (error) {
        console.error('Error during geocoding:', error);
      }
    }
  
    geocodeLocation();
  });
  