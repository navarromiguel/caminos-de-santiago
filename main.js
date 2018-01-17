// Declaración de variables globales
var markers = [];
var places = [];
var geocoder;
var directionsDisplay;
var infowindow;
var directionsService;;
var map;
var miLatlng;
var WMS_ADMIN, CAPA_MADRID, CAPA_CIUDADES, CAPA_CAMINOS;

function getPlace(service, type, color){
	service.nearbySearch({
        location : miLatlng,
        radius : 5500,
        type : [ type ]
    }, function callback(results, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	    for (var i = 0; i < results.length; i++) {
	      var place = results[i];
	      createMarker(results[i], color);
	    }
	  }
	});
}

// Busca los lugares para cada tipo solicitado
function getPlaces(service){
	if(!show_places) return;
	if (show_restaurants)
		getPlace(service, 'restaurant', '0000ff');
	if (show_bars)
		getPlace(service, 'bar', 'ff0000');
	if (show_cafes)
		getPlace(service, 'cafe', 'ff00ff');
	if (show_churches)
		getPlace(service, 'church', 'ffff00');
}

// Oculta o muestra los lugares creados
function fadePlaces(){
	for (var i = 0; i < places.length; i++) {
		places[i].setVisible(!places[i].getVisible());
	};
}

// Oculta o muestra una capa
function fadeLayer(layer){
	if(map.overlayMapTypes.indexOf(layer) != -1)
		map.overlayMapTypes.removeAt(map.overlayMapTypes.getArray().indexOf(layer));
	else
		map.overlayMapTypes.push(layer);
}

// Crea un marcador para un lugar y le asigna un color
function createMarker(place, color) {
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
 
	infowindow = new google.maps.InfoWindow();
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map : map,
        icon: pinImage,
        position : place.geometry.location
    });

    places.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

// Crea el camino Primitivo a partir de datos KML
function initPrimitivo(){
	miLatlng = new google.maps.LatLng(39.5, -3);
	var misOpciones = {
		center: miLatlng,
	  	zoom: 6,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("map_container"), misOpciones);
	var service = new google.maps.places.PlacesService(map);
  	google.maps.event.addListener(map, 'mousedown', function(event){
  		console.log(event);
  		miLatlng = event.latLng;
  		getPlaces(service);
  	});    

  	// Capa primitivo
  	var primiLayer = new google.maps.KmlLayer({url: 'https://www.dropbox.com/s/ojozlp5sniovtba/01-Oviedo-Grado.kml?dl=1', preserveViewport: true});
  	primiLayer.setMap(map);
  	var primiLayer2 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/jodc5ekipsyvwfe/02-Grado-Salas.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer2.setMap(map);
  	var primiLayer3 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/6ogca9gsp8do9ga/03-Salas-Tineo.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer3.setMap(map);
  	var primiLayer4 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/uba6j9526we2cmj/04a-Tineo-Pola-de-Allande.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer4.setMap(map);
  	var primiLayer5 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/zr5357vnyvp5h4e/04b-variante-de-Hospitales.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer5.setMap(map);
  	var primiLayer6 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/0yciom50g7dcnr4/05-Pola-de-Allande-La-Mesa.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer6.setMap(map);
  	var primiLayer7 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/vhh7ovbez8z6her/07-Grandas-de-Salime-A-Fonsagrada.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer7.setMap(map);
  	var primiLayer8 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/nk7uy8xhhhqv35q/08-A-Fonsagrada-Cadavo-Baleira.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer8.setMap(map);
  	var primiLayer9 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/um3rxtm72zdbrzd/08b-variante-Paradanova-Montouto.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer9.setMap(map);
  	var primiLayer10 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/jgsdcbey6gtx33m/09-Cadavo-Baleira-Lugo.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer10.setMap(map);
  	var primiLayer11 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/qjf25x03nh7zqah/10-Lugo-San-Romao-da-Retorta.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer11.setMap(map);
  	var primiLayer12 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/uv5sz253gikedpp/11a-San-Romao-da-Retorta-Melide.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer12.setMap(map);
  	var primiLayer13 = new google.maps.KmlLayer({
  		url: 'https://www.dropbox.com/s/g662l1red9oq6a9/11b-variante-Ferreira-de-Negral.kml?dl=1', 
  		preserveViewport: true});
  	primiLayer13.setMap(map);
  	loader.hide(); // Oculta el preloader y muestra el mapa
}

// Creación e inicialización del mapa
function initMap() {
	infowindow = new google.maps.InfoWindow();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: localStorage.getItem("edit_mode") == "true", preserveViewport: true});
	geocoder = new google.maps.Geocoder();
	// Create an ElevationService.
    elevator = new google.maps.ElevationService();
	miLatlng = new google.maps.LatLng(39.5, -3);
	var misOpciones = {
		center: miLatlng,
	  	zoom: 6,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  	map = new google.maps.Map(document.getElementById("map_container"), misOpciones);
	var service = new google.maps.places.PlacesService(map);
  	google.maps.event.addListener(map, 'mousedown', function(event){
  		console.log(event);
  		miLatlng = event.latLng;
  		getPlaces(service);
  	});   

  	// Crea y añade capa WMS
  	//  WMS_ADMIN = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "AU.AdministrativeUnit");
 	//	CAPA_MADRID = createLayer("http://www.madrid.org/geoserver/mam/SIGI_MA_CAMINO_SANTIAGO/wms", "SIGI_MA_CAMINO_SANTIAGO");
	CAPA_CIUDADES = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "GN.GeographicalNames");
	//	CAPA_CAMINOS = createLayer("http://www.ign.es/wms-inspire/camino-santiago", "PS.ProtectedSite");

	// Si estamos cargando el mapa de un itinerario ya creado...
 	if(localStorage.getItem("way"))
 		initialize(map); // lo inicializamos y cargamos sus datos y componentes
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
	    addMarker(place.geometry.location, false, localStorage.getItem("edit_mode") == "true");
    });

	// Evento encargado de crear o actualizar el itinerario
	document.getElementById('save_way').addEventListener('click', function(){
		if(!document.getElementById('nombre_camino').value){
			alert("Tiene que elegir un nombre.");
			return;
		}
		loader.show(); // Mostramos preloader mientras se procesa la transacción
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

// Crea una capa a partir de un servicio WMS
function createLayer(_url, layer_name){
	return new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var proj = map.getProjection();
		 	var zfactor = Math.pow(2, zoom);
		 	// Obtiene las coordenadas Long Lat
		 	var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 	var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 	var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 	// Crea la cadena del Bounding box
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

// Calcula la elevación y la distancia de un marcador y modifica el DOM 
// con el valor devuelto
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
        		var dist;
        		var res = Math.round(results[0].elevation * 100) / 100
        		if(markers.indexOf(marker) > 0)
        			dist = Math.round(google.maps.geometry.spherical.computeDistanceBetween (markers[markers.indexOf(marker) - 1].position, marker.position) * 100) / 100;
        		marker.content = content + "La elevaci&oacute;n en este punto es de " + res + " metros."
          		if(markers.indexOf(marker) > 0)
          			txt.data += ".  Altura: " + res + " metros. Distancia: " + dist + " metros.";
          		else
          			txt.data += ".  Altura: " + res + " metros.";
          		// Open an info window indicating the elevation at the clicked position
          		infowindow.setContent('<div><strong>' + marker.content + '</strong></div>');
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

// Añade un nuevo marcador del itinerario
function addMarker(location, event, edit_mode){
	console.log("adding marker...", location);
	infowindow.close();
	var marker = new google.maps.Marker({
		position: location, 
		map: map, 
	});
	
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
			if(!event || typeof(event) == "boolean")
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

// Dibuja la ruta del itinerario
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

