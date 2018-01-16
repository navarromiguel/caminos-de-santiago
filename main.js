
var markers = [];
var geocoder;
var directionsDisplay;
var infowindow;
var directionsService;;
// Load the Visualization API and the columnchart package.
// google.load("visualization", "1", {packages: ["columnchart"]});

var map;
function initMap() {
	infowindow = new google.maps.InfoWindow();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: localStorage.getItem("edit_mode") == "true", preserveViewport: true});
	geocoder = new google.maps.Geocoder();
	// Create an ElevationService.
    elevator = new google.maps.ElevationService();
	var miLatlng = new google.maps.LatLng(39.5, -3);
	var misOpciones = {
		center: miLatlng,
	  	zoom: 6,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  	map = new google.maps.Map(document.getElementById("map_container"), misOpciones);
  	// Crea y añade capaa WMS
  	var WMS_ADMIN = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "AU.AdministrativeUnit");
 	var CAPA_MADRID = createLayer("http://www.madrid.org/geoserver/mam/SIGI_MA_CAMINO_SANTIAGO/wms", "SIGI_MA_CAMINO_SANTIAGO");
	var CAPA_CIUDADES = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "GN.GeographicalNames");
	var CAPA_CAMINOS = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "PS.ProtectedSite");
 	map.overlayMapTypes.push(CAPA_MADRID); 
 	map.overlayMapTypes.push(WMS_ADMIN); 
 	map.overlayMapTypes.push(CAPA_CIUDADES); 
 	map.overlayMapTypes.push(CAPA_CAMINOS); 

 	if(localStorage.getItem("way"))
 		initialize(map);
  	google.maps.event.addListener(map, 'click', function(event){
  		if(localStorage.getItem("edit_mode") == "true"){
  			addMarker(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()), event, true);
  			drawPath();
  		}
  	});

  	// Autocompletado
  	var input = (document.getElementById('search'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
	    if (!place.geometry) {
	        // User entered the name of a Place that was not suggested and
	        // pressed the Enter key, or the Place Details request failed.
	        window.alert("No existe la ubicación: '" + place.name + "'");
	    	return;
	    }

	    // If the place has a geometry, then present it on a map.
	    if (place.geometry.viewport) {
	    	map.fitBounds(place.geometry.viewport);
	    } else {
	        map.setCenter(place.geometry.location);
	        map.setZoom(17); // Why 17? Because it looks good.
	    }

	    addMarker(place.geometry.location);
	    /*
	    var address = '';
	    if (place.address_components) {
	        address = [
	        	(place.address_components[0] && place.address_components[0].short_name || ''),
	          	(place.address_components[1] && place.address_components[1].short_name || ''),
	          	(place.address_components[2] && place.address_components[2].short_name || '')
	        ].join(' ');
	   	}
	   	*/
    });

	// Evento encargado de añadir un camino nuevo
	document.getElementById('save_way').addEventListener('click', function(){
		if(!document.getElementById('nombre_camino').value){
			alert("Tiene que elegir un nombre.");
			return;
		}
		loader.show();
		var ways = DB.getAllWays().then(function(ways){
			console.log("ways", ways);
			var edit_mode = localStorage.getItem("edit_mode") == "true";
			var id = localStorage.getItem("way");
			if(edit_mode && id != "false" && id){
				DB.updateWay(id, {
						name: document.getElementById('nombre_camino').value,
						markers: markers.map(function(marker){return {position: marker.position, content: marker.content}})
				}).then(function(){
					console.log("camino guardado");
					window.location.href = 'index.html';
				}).catch(function(error){console.log(error);});
			} else {
				DB.addWay({
					name: document.getElementById('nombre_camino').value,
					markers: markers.map(function(marker){return {position: marker.position, content: marker.content}})
				}).then(function(){
					console.log("camino guardado");
					window.location.href = 'index.html';
				}).catch(function(error){
					console.log(error);
				});
			}
			localStorage.setItem("way", false);
		});
	});
}

function createLayer(_url, layer_name){
	return new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var proj = map.getProjection();
		 	var zfactor = Math.pow(2, zoom);
		 	// Obtiene las coordenadas Long Lat
		 	var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 	var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 	var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 	//crea la cadena del Bounding box
		 	var url = _url;
		 	//URL del WMS
		 	url += "?REQUEST=GetMap"; //Operación WMS
		 	url += "&SERVICE=WMS"; //servicio WMS
		 	url += "&VERSION=1.1.1"; //Versión WMS
		 	url += "&LAYERS=" + layer_name; //Capas WMS
		 	url += "&FORMAT=image/png"; //Formato WMS
		 	url += "&STYLES=PS.ProtectedSite.Default";
		 	url += "&BGCOLOR=0xFFFFFF"; //Color de fondo
		 	url += "&TRANSPARENT=TRUE"; //Transparencia activada
		 	url += "&SRS=EPSG:4326"; //establece WGS84
		 	url += "&BBOX=" + bbox; // Establece el bounding box
		 	url += "&WIDTH=256"; //Tamaño de tesela en google
		 	url += "&HEIGHT=256";
		 	return url; // devuelve la URL para la tesela
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: true
  	});
}

function drawPath() {
    // Create a new chart in the elevation_chart DIV.
    chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));
    var path = markers.map(function(marker){return marker.position;})

    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    var pathRequest = {
    	'path': path,
    	'samples': 256
    }

    // Initiate the path request.
    if(path.length >= 2)
    	elevator.getElevationAlongPath(pathRequest, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(results, status) {
	if (status == google.maps.ElevationStatus.OK) {
    	elevations = results;

      	// Extract the elevation samples from the returned results
      	// and store them in an array of LatLngs.
      	var elevationPath = [];
      	for (var i = 0; i < results.length; i++) {
        	elevationPath.push(elevations[i].location);
      	}

      	// Display a polyline of the elevation path.
      	var pathOptions = {
        	path: elevationPath,
        	strokeColor: '#0000CC',
        	opacity: 0.4,
        	map: map
      	}
     	// polyline = new google.maps.Polyline(pathOptions);

      	// Extract the data from which to populate the chart.
      	// Because the samples are equidistant, the 'Sample'
      	// column here does double duty as distance along the
      	// X axis.
      	var data = new google.visualization.DataTable();
      	data.addColumn('string', 'Sample');
      	data.addColumn('number', 'Elevation');
      	for (var i = 0; i < results.length; i++) {
        	data.addRow(['', elevations[i].elevation]);
      	}

      	// Draw the chart using the data within its DIV. 
      	document.getElementById('elevation_chart').style.display = 'block';
      	chart.draw(data, {
        	width: 640,
        	height: 200,
        	legend: 'none',
        	titleY: 'Elevation (m)'
      	});
    }
} 

function getElevation(event, content, marker, txt) {
    var locations = [];
    // Retrieve the clicked location and push it on the array
    var clickedLocation = event.latLng;
    locations.push(clickedLocation);

    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest = {
    	'locations': locations
    }

    // Initiate the location request
    elevator.getElevationForLocations(positionalRequest, function(results, status) {
      	if (status == google.maps.ElevationStatus.OK) {
			// Retrieve the first result
        	if (results[0]) {
        		var res = Math.round(results[0].elevation * 100) / 100
        		marker.content = content + "La elevaci&oacute;n en este punto es de " + res + " metros."
          		txt.data += ".  Altura: " + res + " metros."
          		// Open an info window indicating the elevation at the clicked position
          		infowindow.setContent('<div><strong>' + marker.content + '</strong></div>');
        		//  infowindow.setPosition(clickedLocation);
          		infowindow.open(map, marker);
          		return results[0].elevation;
        	} else {
          		alert("No se han encontrado resultados");
        	}
      	} else {
        	alert("El servicio de elevación ha fallado debido a: " + status);
      	}
    });
}

function addMarker(location, event, edit_mode){
	console.log("adding marker...", location);
	infowindow.close();
	var marker = new google.maps.Marker({
		position: location, 
		map: map, 
	});
	//if(!localStorage.getItem("edit_mode") == "false"){
	//	getElevation(event, content, marker);
	//}
	
	markers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.content);
		infowindow.open(map, marker);
	});

	var ul = document.getElementById('markers_container');
	var li = document.getElementById('marker');
	li = li.cloneNode(true);
	var button = li.getElementsByTagName("button")[0];
	li.removeAttribute("id");
	if(!edit_mode)
		button.className = " hide";
	button.addEventListener('click', function(el){
		var result = confirm("¿Seguro que desea eliminar?");
		if(result){	
			marker.setMap(null);
			var index = markers.indexOf(marker);
			marker = null;
			markers.splice(index, 1);
			li.parentNode.removeChild(li);
			// Actualiza la ruta
			resetRoute();
		}
	});
	var txt;
	geocoder.geocode({'location': location}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) { 
			console.log(results);
			
			txt = document.createTextNode(results[0]['formatted_address']);
			li.appendChild(txt);
			ul.appendChild(li);

			marker.content = results[0]['formatted_address'] + "</br>";
			//	infowindow.setContent('<div><strong>' + results[0]['formatted_address']+ '</strong>');
			//	infowindow.open(map, markers[markers.length-1]);
			if(typeof(event) == "boolean")
				getElevation({latLng: marker.position}, marker.content, marker, txt);
			else
				getElevation(event, marker.content, marker, txt);
  		} else {
  			console.log("Error encoding location");
  		}
  	});
  	// Actualiza la ruta
	displayRoute();
}

// Carga los markers del camino actual
function initialize(){
	var id = localStorage.getItem("way");
	if(id == "false"){
		loader.hide();
		return;
	}
	DB.getWay(id).then(function(way){
		document.getElementById('nombre_camino').value = way.name;
		for (var i = 0; i < way.markers.length; i++) {
			addMarker(way.markers[i].position, false, localStorage.getItem("edit_mode") == "true");
		}
		if(localStorage.getItem("edit_mode") == "false"){
			document.getElementById("nombre_camino").readOnly = true;
			document.getElementById("save_way").className += " hide";
		}
		drawPath();
		loader.hide();
	});
}

function displayRoute(){
	if(markers.length <= 1) return;
	var request = {
	    origin: markers[0].position,
	    destination: markers[markers.length-1].position,
	    travelMode: 'WALKING',
	   	optimizeWaypoints: false,
	    waypoints: markers.slice(1, markers.length-1).map(function(el){
	    	return {location: el.position};
	    })
	};
	directionsService.route(request, function(result, status) {
	    if (status == 'OK') {
	      	directionsDisplay.setDirections(result);
	      	console.log("ruta creada", result);
	    } else {
	    	console.log("fallo al crear ruta");
	    }
	});
	directionsDisplay.setMap(map);
}

// Redibuja la ruta
function resetRoute(){
	directionsDisplay.setMap(null);
	displayRoute();
}

