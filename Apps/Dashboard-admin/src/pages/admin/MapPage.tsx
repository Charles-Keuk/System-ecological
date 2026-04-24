import React, { useEffect, useState, useCallback } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import {
  layersOutline,
  refreshOutline,
} from "ionicons/icons";
import { alertesAPI, zonesAPI } from "../../services/api";
import "leaflet/dist/leaflet.css";

/* ---------------- TYPES ---------------- */
type Priorite = "elevee" | "moyenne" | "faible";
type Statut = "enAttente" | "enCours" | "traite";

interface Alerte {
  id: number;
  latitude: string;
  longitude: string;
  description: string;
  priorite: Priorite;
  statut: Statut;
  zone?: string;
  citoyen?: string;
}

interface Zone {
  id: number;
  name: string;
  totalAlertes?: number;
  enAttente?: number;
}

/* ---------------- LEAFLET FIX ---------------- */
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- CONSTANTS ---------------- */
const PRIO_COLORS: Record<Priorite, string> = {
  elevee: "#ef4444",
  moyenne: "#f59e0b",
  faible: "#10b981",
};

const STAT_LABEL: Record<Statut, string> = {
  enAttente: "En Attente",
  enCours: "En Cours",
  traite: "Traitée",
};

/* ---------------- COMPONENT ---------------- */
const MapPage: React.FC = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [filter, setFilter] = useState<string>("tous");
  const [layer, setLayer] = useState<"street" | "satellite">("street");

  const CENTER: [number, number] = [4.0511, 9.7679];

  const load = useCallback(async () => {
    try {
      const [aR, zR] = await Promise.all([
        alertesAPI.getMap(),
        zonesAPI.getAll(),
      ]);

      setAlertes(aR.data ?? []);
      setZones(zR.data ?? []);
    } catch (error) {
      console.error("Erreur chargement carte :", error);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "tous"
      ? alertes
      : alertes.filter(
          (a) => a.priorite === filter || a.statut === filter
        );

  const TILE_URLS = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  return (
    <IonPage>
      <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2FF" }}>
        <div style={{ marginLeft: 15, flex: 1, display: "flex", flexDirection: "column" }}>
          <IonContent style={{ "--background": "#EEF2FF" }}>
            <div style={{ padding: "24px 28px", height: "calc(100vh - 64px)" }}>

              {/* Toolbar */}
              <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                {/* Layer */}
                <div style={{ display: "flex", background: "#fff", borderRadius: 10 }}>
                  {(["street", "satellite"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLayer(l)}
                      style={{
                        padding: "8px 14px",
                        background: layer === l ? "#3b7ef8" : "transparent",
                        color: layer === l ? "#fff" : "#64748b",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <IonIcon icon={layersOutline} />{" "}
                      {l === "street" ? "Carte" : "Satellite"}
                    </button>
                  ))}
                </div>

                {/* Filters */}
                {["tous", "elevee", "moyenne", "faible", "enAttente", "enCours"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "7px 12px",
                      background:
                        filter === f
                          ? PRIO_COLORS[f as Priorite] || "#3b7ef8"
                          : "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                ))}

                <button onClick={load}>
                  <IonIcon icon={refreshOutline} /> Actualiser
                </button>
              </div>

              {/* Map */}
              <MapContainer center={CENTER} zoom={13} style={{ height: "100%" }}>
                <TileLayer url={TILE_URLS[layer]} />

                {filtered.map((a) => (
                  <CircleMarker
                    key={a.id}
                    center={[parseFloat(a.latitude), parseFloat(a.longitude)]}
                    radius={
                      a.priorite === "elevee"
                        ? 14
                        : a.priorite === "moyenne"
                        ? 11
                        : 8
                    }
                    pathOptions={{
                      fillColor: PRIO_COLORS[a.priorite],
                      color: "#fff",
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <strong>Alerte #{a.id}</strong>
                      <p>{a.description}</p>
                      <div>{STAT_LABEL[a.statut]}</div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </IonContent>
        </div>
      </div>
    </IonPage>
  );
};

export default MapPage;