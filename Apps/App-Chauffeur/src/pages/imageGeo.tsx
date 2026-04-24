// src/pages/imageGeo.tsx

import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonText,
} from "@ionic/react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation, GeolocationPosition } from "@capacitor/geolocation";

// Fix icône marker Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Typage précis pour la photo + coordonnées
interface PhotoPoint {
  image: string;
  lat: number;
  lng: number;
}

// Composant pour recentrer la carte dynamiquement
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], 15);
  return null;
};

const ImageGeo: React.FC = () => {
  const [point, setPoint] = useState<PhotoPoint | null>(null);

  const takePhotoWithLocation = async () => {
    try {
      // 📸 Prendre une photo
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      // 📍 Récupérer la position GPS
      const position: GeolocationPosition = await Geolocation.getCurrentPosition();

      const newPoint: PhotoPoint = {
        image: photo.dataUrl || "",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setPoint(newPoint);
    } catch (err) {
      console.error("Erreur lors de la capture photo/GPS :", err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo + Position automatique</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonButton expand="block" onClick={takePhotoWithLocation}>
          📸 Prendre une photo
        </IonButton>

        {/* Affichage de la photo et coordonnées */}
        {point && (
          <>
            <IonImg src={point.image} style={{ marginTop: "10px" }} />
            <IonText>
              <p>Latitude: {point.lat}</p>
              <p>Longitude: {point.lng}</p>
            </IonText>
          </>
        )}

        {/* Carte Leaflet */}
        <MapContainer
          center={point ? [point.lat, point.lng] : [4.05, 9.7]} // Douala par défaut
          zoom={13}
          style={{ height: "400px", marginTop: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {point && (
            <>
              <Marker position={[point.lat, point.lng]}>
                <Popup>📸 Photo prise ici</Popup>
              </Marker>
              <RecenterMap lat={point.lat} lng={point.lng} />
            </>
          )}
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default ImageGeo;