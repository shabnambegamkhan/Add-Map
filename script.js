
mapboxgl.accessToken = "pk.eyJ1IjoiZ2F1cmF2bmciLCJhIjoiY20xdGx3ODhuMDNzNTJ0cHI2YWphY2p1ZCJ9.DCncOYgA91GXOkejz0CilQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [78.9629, 20.5937], // India's center point
  zoom: 5,
});

let marker = null; // Global marker to avoid adding new markers with each search

function fetchdata() {
  let cityName = document.getElementById("location").value;
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${mapboxgl.accessToken}&country=IN&types=place,poi,locality,region`;

  // Fetch geocoding data
  fetch(geocodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch geocoding data");
      }
      return response.json();
    })
    .then((data) => {
      if (data.features.length === 0) {
        console.log("No location found");
        return;
      }

      const coordinates = data.features[0].geometry.coordinates;

      // Center and zoom the map on the new location
      map.setCenter(coordinates);
      map.setZoom(12);

      // Remove the previous marker if it exists
      if (marker) {
        marker.remove();
      }

      // Add a new marker to the map
      marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

      // Display the place name and clear the input
      displaydata(data.features);
      document.getElementById("location").value = ""; // Clear input field
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Display location name, specifying if it’s a village or state
function displaydata(features) {
  const userlist = document.getElementById("displayBox");
  userlist.innerHTML = ""; // Clear previous results
  features.forEach((feature) => {
    const listitem = document.createElement("li");
    let placeType = feature.place_type[0]; // Gets the type of place (e.g., "locality", "region")

    // Set the place type as "Village" or "State" if applicable
    if (placeType === "locality") {
      listitem.textContent = `Village: ${feature.place_name}`;
    } else if (placeType === "region") {
      listitem.textContent = `State: ${feature.place_name}`;
    } else {
      listitem.textContent = feature.place_name; // Default display for other types
    }

    userlist.appendChild(listitem);
  });
}

























































