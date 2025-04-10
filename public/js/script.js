const socket = io() // connection request to the backend
console.log("hey")
// checking for browssers geo location availability

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude , longitude}=position.coords; // getting the position coordinates
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${position.coords.accuracy} meters`);       
        socket.emit("send-location" , {latitude , longitude})   // emmiting an event from the frontend named send-location
    } , (error)=>{
        console.log(error)
    } ,
    // watchposition settings for higher accurecy
    {
        enableHighAccuracy: true,
        maximumAge: 0, // no cashing
        timeout: 3000
    }

    );
} 

// from the leaflet in the index we got a map that gives us certain things
const map = L.map("map").setView([0 , 0] , 15)     // 0,0 are centered lat and long in earth and 10 is level of zoom i want
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
    attribution : "Ready to use maps" , // this is the attribution for the map we are using
}).addTo(map) // z,y,x are the dynamic values put by openstreet to let us see the tyle of map

const markers ={}        // emptey nmarker object

socket.on("received-location" , function(data){
    const {id , latitude , longitude} = data   // extraction of the data
    map.setView([latitude , longitude])
    if (!markers[id]) {
        // Add a new marker and center the map for new users
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 15); // Center map on the new user
    } else {
        // Update the marker position for existing users
        markers[id].setLatLng([latitude, longitude]);
    }
})

socket.on("user-disconnected" , function(id){    // removing the marker when the user is disconnected ,handelled in backend by the event 'user-disconnected'
    console.log(`User disconnected: ${id}`); // Debug log
    if(markers[id]){
        map.removeLayer(markers[id]);
            delete markers[id]; // deleting the marker from the markers object
            console.log(`Marker for user ${id} removed`); // Debug log
    } else {
        console.log(`No marker found for user ${id}`); // Debug log
    }
})
