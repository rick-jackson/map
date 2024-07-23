import {
  List,
  ListItemText,
  Button,
  Paper,
  ListItemButton,
} from "@mui/material";
import { Marker as MarkerType } from "../firebase/markers";

interface MarkerListProps {
  markers: MarkerType[];
  setViewState: (viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  }) => void;
  handleDeleteMarker: (id: string) => void;
  handleDeleteAllMarkers: () => void;
}

const MarkerList: React.FC<MarkerListProps> = ({
  markers,
  setViewState,
  handleDeleteMarker,
  handleDeleteAllMarkers,
}) => {
  return (
    <Paper
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "white",
        padding: "10px",
        zIndex: 1,
      }}
    >
      <Button
        onClick={handleDeleteAllMarkers}
        variant="contained"
        color="secondary"
      >
        Delete All Markers
      </Button>
      <List sx={{ maxHeight: "50vh", overflow: "auto" }}>
        {markers.map((marker, index) => (
          <ListItemButton key={marker.id}>
            <ListItemText
              primary={`Marker: ${index + 1}`}
              onClick={() =>
                setViewState({
                  latitude: marker.lat,
                  longitude: marker.long,
                  zoom: 11,
                })
              }
            />
            <Button
              onClick={() => handleDeleteMarker(marker.id)}
              variant="outlined"
              color="secondary"
            >
              Delete
            </Button>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default MarkerList;
