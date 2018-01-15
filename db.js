
const WAYS = "ways";

var DB = {
	getAllWays: function(){
		return db.collection(WAYS).get().then(function(querySnapshoot) {
		    console.log("getWays:", datas);
		    var datas = [];
		    querySnapshoot.forEach(function(doc){
		    	var way = doc.data();
		    	way.markers = JSON.parse(way.markers);
		    	way.id = doc.id;
		    	datas.push(way);
		    });
		    return datas;
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		    return [];
		});
	},
	getWay: function(wayDoc){
		return db.collection(WAYS).doc(wayDoc).get().then(function(doc) {
		    if (doc.exists) {
		        console.log("Document data:", doc.data());
		        var data = doc.data();
		        data.id = doc.id;
		        data.markers = JSON.parse(data.markers);
		        return data;
		    } else {
		        console.log("No such document!");
		    }
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		});
	},
	addWay: function (way){
		return db.collection(WAYS).add({
			name: way.name,
			markers: JSON.stringify(way.markers)
		})
		.then(function(docRef) {
		    console.log("Way written with ID: ", docRef.id);
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		});
	},
	updateWay: function(wayDoc, newWay){
		return db.collection(WAYS).doc(wayDoc).update({
		    name: newWay.name,
			markers: JSON.stringify(newWay.markers)
		})
		.then(function() {
		    console.log("Way successfully updated!");
		})
		.catch(function(error) {
		    // The document probably doesn't exist.
		    console.error("Error updating way: ", error);
		});
	},
	removeWay: function(wayDoc){
		return db.collection(WAYS).doc(wayDoc).delete().then(function() {
		    console.log("Way successfully deleted!");
		}).catch(function(error) {
		    console.error("Error removing way: ", error);
		});
	}
}