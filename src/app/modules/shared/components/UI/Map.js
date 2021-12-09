import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./Map.css";

const Map = (props) => {
  const { center, zoom } = props;
  const mapRef = useRef();
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic291cmF2YiIsImEiOiJja3d5b2t2ZzgwcGgyMm5tbjAxc3pkeHByIn0.SgF9RjWoozF0NA3RVFibsQ";
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });
    new mapboxgl.Marker({ position: center, map: map });
    map.addControl(new mapboxgl.NavigationControl());
  }, [center, zoom]);
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
