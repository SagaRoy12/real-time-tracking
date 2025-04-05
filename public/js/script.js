const socket = io() // connection request to the backend
console.log("hey")
// checking for browssers geo location availability

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude , longitude}=position.coords;       // getting the position coordinates
        socket.emit("send-location" , {latitude , longitude})   // emmiting an event from the frontend named send-location
    } , (error)=>{
        console.log(error)
    } ,
    // watchposition settings for higher accurecy
    {
        enableHighAccuracy: true,
        maximumAge: 0, // no cashing
        timeout: 6000
    }

    );
} 

// from the leaflet in the index we got a map that gives us certain things
const map = L.map("map").setView([0 , 0] , 16)     // 0,0 are centered lat and long in earth and 10 is level of zoom i want
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
    attribution : "real map"
}).addTo(map) // z,y,x are the dynamic values put by openstreet to let us see the tyle of map

const markers ={}        // emptey nmarker object

socket.on("received-location" , function(data){
    const {id , latitude , longitude} = data   // extraction of the data
    map.setView([latitude , longitude])
    if(markers[id]){  // if rthe marker is already present then we just need to update the lat and long of the marker
        markers[id].setLatLng([latitude , longitude])
    }
    else{
        markers[id] = L.marker([latitude , longitude]).addTo(map) // if the marker is not present then we need to create a new marker and add it to the map
    }
})

socket.on("user-disconnected" , function(id){    // removing the marker when the user is disconnected ,handelled in backend by the event 'user-disconnected'
    if(markers[id]){
        map.removeLayer(markers[id]);
            delete markers[id]; // deleting the marker from the markers object
    }
})
