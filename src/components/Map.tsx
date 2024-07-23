import React, { useState, useEffect, useMemo, useCallback } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Supercluster from "supercluster";
import {
  fetchMarkers,
  addMarker,
  updateMarker,
  deleteMarker,
  deleteAllMarkers,
  Marker as MarkerType,
} from "../firebase/markers";
import MapControls from "./MapControls";
import MarkerList from "./MarkerList";

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

const initialViewState: ViewState = {
  latitude: 48.92275590942748,
  longitude: 24.710380722476003,
  zoom: 10,
};

const MapComponent: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  useEffect(() => {
    const loadMarkers = async () => {
      const markersData = await fetchMarkers();
      setMarkers(markersData);
    };
    loadMarkers();
  }, []);

  const handleMapClick = useCallback(async (event: any) => {
    const { lng, lat } = event.lngLat;
    await addMarker(lng, lat);
    const markersData = await fetchMarkers();
    setMarkers(markersData);
  }, []);

  const handleMarkerDragEnd = useCallback(
    async (event: any, index: number) => {
      const { lng, lat } = event.lngLat;
      const marker = markers[index];
      await updateMarker(marker.id, lng, lat);
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker, i) =>
          i === index ? { ...marker, long: lng, lat } : marker
        )
      );
    },
    [markers]
  );

  const handleDeleteMarker = useCallback(async (id: string) => {
    await deleteMarker(id);
    const markersData = await fetchMarkers();
    setMarkers(markersData);
  }, []);

  const handleDeleteAllMarkers = useCallback(async () => {
    await deleteAllMarkers();
    setMarkers([]);
  }, []);

  const points = useMemo(
    () =>
      markers.map((marker, index) => ({
        type: "Feature",
        properties: { cluster: false, index },
        geometry: { type: "Point", coordinates: [marker.long, marker.lat] },
      })),
    [markers]
  );

  const supercluster = useMemo(
    () => new Supercluster({ radius: 75, maxZoom: 20 }).load(points),
    [points]
  );

  const clusters = useMemo(
    () =>
      supercluster.getClusters(
        [
          viewState.longitude - 180,
          viewState.latitude - 90,
          viewState.longitude + 180,
          viewState.latitude + 90,
        ],
        Math.floor(viewState.zoom)
      ),
    [supercluster, viewState]
  );

  return (
    <div style={{ height: "100vh" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_GL_TOKEN}
      >
        <Source
          id="markers"
          type="geojson"
          data={{ type: "FeatureCollection", features: clusters }}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer
            id="clusters"
            type="circle"
            source="markers"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "#51bbd6",
              "circle-radius": 20,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            source="markers"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            }}
            paint={{ "text-color": "#ffffff" }}
          />
          <Layer
            id="unclustered-point"
            type="circle"
            source="markers"
            filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-color": "#11b4da",
              "circle-radius": 8,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            }}
          />
        </Source>
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, index } = cluster.properties;

          return (
            !isCluster && (
              <Marker
                key={index}
                longitude={longitude}
                latitude={latitude}
                draggable
                onDragEnd={(event) => handleMarkerDragEnd(event, index)}
              >
                <img
                  src="https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png"
                  width={60}
                  height={60}
                  alt={`Marker ${index + 1}`}
                  style={{ position: "relative", bottom: "25px" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "27px",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </div>
              </Marker>
            )
          );
        })}
        <MapControls />
      </Map>
      {!!markers.length && (
        <MarkerList
          markers={markers}
          setViewState={setViewState}
          handleDeleteMarker={handleDeleteMarker}
          handleDeleteAllMarkers={handleDeleteAllMarkers}
        />
      )}
    </div>
  );
};

export default MapComponent;
