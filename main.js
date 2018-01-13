"use strict";

var markers = [];
var geocoder;
var directionsDisplay;
var infowindow;
var directionsService;;

var map;
function initMap() {
	infowindow = new google.maps.InfoWindow();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: true, preserveViewport: true});
	geocoder = new google.maps.Geocoder();
	var miLatlng = new google.maps.LatLng(43.354810,-5.851805);
	var misOpciones = {
	  center: miLatlng,
	  zoom: 14,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  map = new google.maps.Map(document.getElementById("map_container"), misOpciones);

  google.maps.event.addListener(map, 'click', function(event){
  	addMarker(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
  });


  	// Autocompletado
  	var input = (document.getElementById('search'));
	var types = document.getElementById('type-selector');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

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
}

function addMarker(location){
	console.log("adding marker...", location);
	infowindow.close();
	var marker = new google.maps.Marker({
		position: location, 
		map: map, 
	});
	markers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		alert("Has hecho click en el marcador.");
	});

	var ul = document.getElementById('markers_container');
	var li = document.getElementById('marker');
	li = li.cloneNode(true);
	li.removeAttribute("id");
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

			infowindow.setContent('<div><strong>' + results[0]['formatted_address']+ '</strong>');
			infowindow.open(map, markers[markers.length-1]);
  		} else {
  			console.log("Error encoding location");
  		}
  	});
  	// Actualiza la ruta
	displayRoute();
}

function displayRoute(){
	if(markers.length <= 1) return;
	var request = {
	    origin: markers[0].position,
	    destination: markers[markers.length-1].position,
	    travelMode: 'WALKING',
	   // provideRouteAlternatives: false,
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

function resetRoute(){
	directionsDisplay.setMap(null);
	displayRoute();
}

