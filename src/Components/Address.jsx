import React from 'react'
import { useState } from 'react';

function Address() {
    const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const getUserCoordinates = async() => {
    const geolocationAPI =await navigator.geolocation.getCurrentPosition(   position)  
      //   codeLatLng(coords.latitude, coords.longitude)
    
    console.log(geolocationAPI);
    
    //    geolocationAPI.getCurrentPosition(
    //     (position) => {
    //       const { coords } = position;
    //       setLat(coords.latitude);
    //       setLong(coords.longitude);
    //     //   codeLatLng(coords.latitude, coords.longitude)
    //     },
    //     (error) => {
    //       console.log("Something went wrong getting your position!");
    //     }
    //   );
    
    // console.log(lat,long)

  };
  return (
<>
<button onClick={getUserCoordinates}>hello</button>
</>  )
}

export default Address