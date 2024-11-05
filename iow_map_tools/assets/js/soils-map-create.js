// ==================================================================================================
// MAP LOADING
// ==================================================================================================
// Load and center the map
const map = L.map('map').setView([50.670908, -1.326458], 11);

// Add attribution to the map
map.attributionControl.addAttribution('IoW Soils data provided by NSRI Soils');

// Load the OSM tile layer
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ==================================================================================================
// INFORMATION BOX LOADING
// ==================================================================================================
// Load the control that shows state info on hover
const info = L.control();

// A function that creates the div element for this box
info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

// Define the dynamic contentsof this info box
info.update = function (props) {
	const contents = props ? `<b>${props.Name_Prope}</b><br />${props.DOMINANT_S}<hr><b><i>Geology: </b></i>${props.GEOLOGY}<br /><b><i>Land Use: </b></i>${props.LAND_USE}` : '<i>Hover over a region for more information.<br />Click on a region to zoom in.</i>';
	this._div.innerHTML = `<h6>Isle of Wight Soil Types</h6>${contents}`;
};

// Add the info box to the map
info.addTo(map);

// ==================================================================================================
// MAP STYLING
// ==================================================================================================
// Set color depending on soil type
function getColor(soil) {
	return soil == "Aberford" ? '#b9f7ff' :
		soil == "Andover 1"  ? '#ecb3fd' :
		soil == "Bignor"  ? '#fdb8b2' :
		soil == "Bursledon"  ? '#f2fdba' :
		soil == "Carstens"  ? '#bcc9fe' :
		soil == "Coombe 1"  ? '#fde8d2' :
		soil == "Efford 1"  ? '#b4feb5' :
		soil == "Fladbury 3"  ? '#fdd2eb' :
		soil == "Fyfield 4"  ? '#ceffd5' :
		soil == "Harwell"  ? '#b6ddfd' :
		soil == "Hucklesbrook"  ? '#b3feeb' :
		soil == "Icknield"  ? '#edccff' :
		soil == "Lake"  ? '#feecb7' :
		soil == "Mcf"  ? '#c4b4fd' :
		soil == "Oxpasture"  ? '#fdd3d2' :
		soil == "Saline 1"  ? '#fafdd3' :
		soil == "Sandwich"  ? '#feb6e6' :
		soil == "Sonning 1"  ? '#ffceb4' :
		soil == "Sonning 2"  ? '#d7ecff' :
		soil == "Upton 1"  ? '#d3fdf4' :
		soil == "Wallasea 1"  ? '#cefdbf' :
		soil == "Wickham 4"   ? '#feb8ce' : '#828282';
}

// Set the style of the soil features
function style(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'grey',
		dashArray: '0',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.Name_Prope)
	};
}

// Change this style when features are highlighted (to be activated on mouseover)
function highlightFeature(e) {
	const layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.55
	});

	layer.bringToFront();

	info.update(layer.feature.properties);
}

// Zoom the map to the selected feature (to be activated on click)
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

// ==================================================================================================
// GEOJSON IMPORT
// ==================================================================================================
// The link to the GeoJSON from GeoServer
var geoJsonUrl = "http://50cr007.sims.cranfield.ac.uk:8080/geoserver/IoW_Maps/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=IoW_Maps%3AIOW_Soils&outputFormat=text/javascript&format_options=callback:loadGeoJson" // coordinate system is wrong

// Once AJAX has obtained the GeoJSON, run this script to load it and provide more styling
function loadGeoJson(geojson) {

	// Load the GeoJSON as a layer, run the styling functions above, and set mouse actions.
	const geojsonLayer = L.geoJson(geojson, {
		style,
		onEachFeature
	});

	// Define mouse actions for the layer
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	// Definea final action to reset highlights (when mouse leaves)
	function resetHighlight(e) {
		geojsonLayer.resetStyle(e.target);
		info.update();
	}
	
	// Add the GeoJSON layer to the map
	map.addLayer(geojsonLayer); // add data layer to map

};

// Run AJAX script (from jQuery) to retreive the GeoJSON from GeoServer and run the above function
$.ajax({ 
	url: geoJsonUrl, 
	dataType: 'jsonp',
	success: loadGeoJson
});

// ==================================================================================================
// LEGEND LOADING
// ==================================================================================================
// Load the legend element
const legend = L.control({position: 'bottomright'});

// Set up the legend names and dynamically populate with the colours defined earlier
legend.onAdd = function (map) {
	const div = L.DomUtil.create('div', 'info legend');
	const grades = ["Aberford", "Andover 1", "Bignor", "Bursledon", "Carstens", "Coombe 1", "Efford 1", "Fladbury 3", "Fyfield 4", "Harwell", "Hucklesbrook", "Icknield", "Lake", "Mcf", "Oxpasture", "Saline 1", "Sandwich", "Sonning 1", "Sonning 2", "Upton 1", "Wallasea 1", "Wickham 4"];
	const labels = [];
	let from, to;

	for (let i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(`<i style="background:${getColor(from)}"></i> ${from}`);
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

// Add the legend to the map
legend.addTo(map);

// ==================================================================================================