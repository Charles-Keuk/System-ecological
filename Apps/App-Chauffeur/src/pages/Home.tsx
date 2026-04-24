import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

/* ================= FIX ICONS ================= */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ================= TYPES ================= */
type Point = {
  coords: [number, number];
};

/* ================= UTILS ================= */
const toPoint = (lat: number, lng: number): Point => ({
  coords: [lat, lng],
});

/* ================= ICONS ================= */
const startIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const waypointIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

/* ================= GPS (WEB + MOBILE) ================= */
const getCurrentPosition = async (): Promise<[number, number]> => {
  if (Capacitor.isNativePlatform()) {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    return [pos.coords.latitude, pos.coords.longitude];
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      (err) => reject(err.message),
      { enableHighAccuracy: true }
    );
  });
};

/* ================= ROUTE API ================= */
const getRoute = async (points: Point[]) => {
  const res = await axios.post(
    "/ors/v2/directions/driving-car/geojson",
    {
      coordinates: points.map((p) => [p.coords[1], p.coords[0]]),
    },
    {
      headers: {
        Authorization: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA1ZmJlYzgxNzIxMTQzNmU4MzhmMDUxOWRhY2ZkMmY3IiwiaCI6Im11cm11cjY0In0=", // ⚠️ remplace ici
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.data?.features?.length) {
    throw new Error("Route invalide");
  }

  return res.data.features[0].geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
};

/* ================= MAP CLICK ================= */
const MapClickHandler = ({
  addWaypoint,
}: {
  addWaypoint: (p: Point) => void;
}) => {
  useMapEvents({
    click(e) {
      addWaypoint(toPoint(e.latlng.lat, e.latlng.lng));
    },
  });

  return null;
};

/* ================= FIX MAP ================= */
const FixMapResize = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);

  return null;
};

/* ================= MAIN ================= */
const Home: React.FC = () => {
  const [start, setStart] = useState<Point | null>(null);
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= INIT GPS ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const coords = await getCurrentPosition();
        setStart({ coords });
      } catch (err) {
        console.error(err);
        setError("Impossible d’obtenir le GPS");
      }
    };

    init();
  }, []);

  /* ================= WAYPOINTS ================= */
  const addWaypoint = (p: Point) => {
    setWaypoints((prev) => [...prev, p]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= ROUTE ================= */
  const calculateRoute = async () => {
    setError(null);

    if (!start || waypoints.length === 0) {
      setError("Ajoute au moins un point !");
      return;
    }

    try {
      setLoading(true);

      const allPoints = [start, ...waypoints];
      const polyline = await getRoute(allPoints);

      setRoute(polyline);
    } catch (err) {
      console.error(err);
      setError("Erreur de calcul de la route");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const reset = () => {
    setWaypoints([]);
    setRoute([]);
    setError(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Navigation multi-arrêts 🚗</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MapContainer
          center={[4.05, 9.7]}
          zoom={13}
          style={{ height: "60vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FixMapResize />
          <MapClickHandler addWaypoint={addWaypoint} />

          {start && <Marker position={start.coords} icon={startIcon} />}

          {waypoints.map((wp, i) => (
            <Marker
              key={i}
              position={wp.coords}
              icon={i === waypoints.length - 1 ? endIcon : waypointIcon}
            />
          ))}

          {route.length > 0 && (
            <Polyline positions={route} pathOptions={{ color: "blue" }} />
          )}
        </MapContainer>

        <div style={{ padding: 16 }}>
          <IonText color="danger">
            {error && <p>{error}</p>}
          </IonText>

          <IonButton expand="block" onClick={calculateRoute}>
            {loading ? "Calcul..." : "Calculer la route"}
          </IonButton>

          <IonButton expand="block" color="danger" onClick={reset}>
            Reset
          </IonButton>

          <IonList>
            {waypoints.map((wp, i) => (
              <IonItem key={i}>
                <IonLabel>
                  Point {i + 1}: {wp.coords[0].toFixed(4)},{" "}
                  {wp.coords[1].toFixed(4)}
                </IonLabel>
                <IonButton
                  color="danger"
                  onClick={() => removeWaypoint(i)}
                >
                  Supprimer
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;