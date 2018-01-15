// Lógica para el preloader
var loader = {
	show: function(){
		$(".content").fadeTo(400, 0, function() {
	        $(".preload").fadeTo(100, 1);        
	    });
	},
	hide: function(){
		$(".preload").fadeTo(800, 0, function() {
	        $(".content").fadeTo(500, 1);        
	    });
	},
}