
var markers = [];
var geocoder;
var directionsDisplay;
var infowindow;
var directionsService;;

var map;
function initMap() {
	infowindow = new google.maps.InfoWindow();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: localStorage.getItem("edit_mode") == "true", preserveViewport: true});
	geocoder = new google.maps.Geocoder();
	var miLatlng = new google.maps.LatLng(39.5, -3);//43.354810,-5.851805);
	var misOpciones = {
	  center: miLatlng,
	  zoom: 6,//14,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  map = new google.maps.Map(document.getElementById("map_container"), misOpciones);
  var WMS_ADMIN = new google.maps.ImageMapType({
	getTileUrl: function(coord, zoom) {
		 var proj = map.getProjection();
		 var zfactor = Math.pow(2, zoom);
		 // Obtiene las coordenadas Long Lat
		 var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 //crea la cadena del Bounding box
		 var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 //URL del WMS
		 var url = "http://www.ign.es/wms-inspire/camino-santiago";
		 url += "?REQUEST=GetMap"; //Operación WMS
		 url += "&SERVICE=WMS"; //servicio WMS
		 url += "&VERSION=1.1.1"; //Versión WMS
		 url += "&LAYERS=" + "AU.AdministrativeUnit"; //Capas WMS
		 url += "&FORMAT=image/png"; //Formato WMS
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
 var CAPA_MADRID = new google.maps.ImageMapType({
	getTileUrl: function(coord, zoom) {
		 var proj = map.getProjection();
		 var zfactor = Math.pow(2, zoom);
		 // Obtiene las coordenadas Long Lat
		 var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 //crea la cadena del Bounding box
		 var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 //URL del WMS
		 var url = "http://www.madrid.org/geoserver/mam/SIGI_MA_CAMINO_SANTIAGO/wms";
		 url += "?REQUEST=GetMap"; //Operación WMS
		 url += "&SERVICE=WMS"; //servicio WMS
		 url += "&VERSION=1.1.1"; //Versión WMS
		 url += "&LAYERS=" + "SIGI_MA_CAMINO_SANTIAGO"; //Capas WMS
		 url += "&FORMAT=image/png"; //Formato WMS
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
var CAPA_CIUDADES = new google.maps.ImageMapType({
	getTileUrl: function(coord, zoom) {
		 var proj = map.getProjection();
		 var zfactor = Math.pow(2, zoom);
		 // Obtiene las coordenadas Long Lat
		 var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 //crea la cadena del Bounding box
		 var url = "http://www.ign.es/wms-inspire/camino-santiago";
		 //URL del WMS
		 url += "?REQUEST=GetMap"; //Operación WMS
		 url += "&SERVICE=WMS"; //servicio WMS
		 url += "&VERSION=1.1.1"; //Versión WMS
		 url += "&LAYERS=" + "GN.GeographicalNames"; //Capas WMS
		 url += "&FORMAT=image/png"; //Formato WMS
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
var CAPA_CAMINOS = new google.maps.ImageMapType({
	getTileUrl: function(coord, zoom) {
		 var proj = map.getProjection();
		 var zfactor = Math.pow(2, zoom);
		 // Obtiene las coordenadas Long Lat
		 var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
		 var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

		 var bbox = (top.lng()) + "," + (bot.lat()) + "," + (bot.lng()) + "," + (top.lat());
		 //crea la cadena del Bounding box
		 var url = "http://www.ign.es/wms-inspire/camino-santiago";
		 //URL del WMS
		 url += "?REQUEST=GetMap"; //Operación WMS
		 url += "&SERVICE=WMS"; //servicio WMS
		 url += "&VERSION=1.1.1"; //Versión WMS
		 url += "&LAYERS=" + "PS.ProtectedSite"; //Capas WMS
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
	//Añade capaS WMS
 	map.overlayMapTypes.push(CAPA_MADRID); 
 	map.overlayMapTypes.push(WMS_ADMIN); 
 	map.overlayMapTypes.push(CAPA_CIUDADES); 
 	map.overlayMapTypes.push(CAPA_CAMINOS); 

 	if(localStorage.getItem("way"))
 		initialize(map);
  google.maps.event.addListener(map, 'click', function(event){
  	if(localStorage.getItem("edit_mode") == "true")
  		addMarker(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()), true);
  });

  	// Autocompletado
  	var input = (document.getElementById('search'));
	var types = document.getElementById('type-selector');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

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
	        map.setZoom(17);  // Why 17? Because it looks good.
	      }

	      addMarker(place.geometry.location);
	      var address = '';
	      if (place.address_components) {
	        address = [
	          (place.address_components[0] && place.address_components[0].short_name || ''),
	          (place.address_components[1] && place.address_components[1].short_name || ''),
	          (place.address_components[2] && place.address_components[2].short_name || '')
	        ].join(' ');
	      }
    });

	// Evento encargado de añadir un camino nuevo
	document.getElementById('save_way').addEventListener('click', function(){
		if(!document.getElementById('nombre_camino').value){
			alert("Tiene que elegir un nombre.");
			return;
		}
		var ways = JSON.parse(localStorage.getItem("ways")) || [];
		console.log("ways", ways);
		var edit_mode = localStorage.getItem("edit_mode") == "true";
		var id = localStorage.getItem("way");
		if(edit_mode && id != "false" && id){
			for (var i = 0; i < ways.length; i++) {
				if(ways[i].id == id){
					ways[i] = {
						id: id,
						name: document.getElementById('nombre_camino').value,
						markers: markers.map(function(marker){return marker.position;})
					}
				}
			};
		} else {
			ways.push({
				id: function(){ // Genera id único
					var id = -1;
					for (var i = 0; i < ways.length; i++) {
						if(ways[i].id > id)
							id = ways[i].id;
					};
					return id + 1;
				}(),
				name: document.getElementById('nombre_camino').value,
				markers: markers.map(function(marker){return marker.position;})
			});
		}
		localStorage.setItem('geoData', map.data);
		localStorage.setItem("ways", JSON.stringify(ways));
		localStorage.setItem("way", false);
		console.log("camino guardado");
		window.location.href = 'index.html';
	});
}

function addMarker(location, edit_mode){
	console.log("adding marker...", location);
	infowindow.close();
	var marker = new google.maps.Marker({
		position: location, 
		map: map, 
	});
	markers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent('<div><strong>' + marker.content + '</strong>');
		infowindow.open(map, marker);
	});

	var ul = document.getElementById('markers_container');
	var li = document.getElementById('marker');
	li = li.cloneNode(true);
	li.removeAttribute("id");
	if(!edit_mode)
		li.getElementsByTagName("button")[0].className = " hide";
	li.addEventListener('click', function(el){
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

			marker.content = results[0]['formatted_address'];
			infowindow.setContent('<div><strong>' + results[0]['formatted_address']+ '</strong>');
			infowindow.open(map, markers[markers.length-1]);
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
	var ways = JSON.parse(localStorage.getItem("ways")) || [];
	for (var i = 0; i < ways.length; i++) {
		if(ways[i].id == id){
			var way = ways[i];
			document.getElementById('nombre_camino').value = way.name;
			for (var j = 0; j < way.markers.length; j++) {
				addMarker(way.markers[j], localStorage.getItem("edit_mode") == "true");
			};
		}
	};
	if(localStorage.getItem("edit_mode") == "false"){
		document.getElementById("nombre_camino").readOnly = true;
		document.getElementById("save_way").className += " hide";
	}
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


