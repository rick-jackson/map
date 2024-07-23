import {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

const MapControls: React.FC = () => (
  <>
    <NavigationControl position="top-left" />
    <FullscreenControl position="top-left" />
    <ScaleControl position="bottom-right" />
    <GeolocateControl position="top-left" />
  </>
);

export default MapControls;
