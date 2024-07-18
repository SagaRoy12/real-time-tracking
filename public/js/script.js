const socket = io() // connection request to the backend
console.log("hey")
// checking for browssers geo location availability

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude , longitude}=position.coords        // getting the position coordinates
        socket.emit("send-location" , {latitude , longitude})   // commiting an event from the frontend named send-location
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

// from the leaflet in the index we got a map that gives us sertain things
L.map("map").setView([0 , 0])