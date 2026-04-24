import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonToggle,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonIcon,
} from "@ionic/react";

import {
  notificationsSharp,
  volumeHighSharp,
  globeSharp,
  mapSharp,
  navigateSharp,
  keySharp,
  moonSharp,
  logOutSharp,
} from "ionicons/icons";

type Lang = "fr" | "en";

export default function SettingsFullPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Lang>("fr");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const match = (text: string) =>
    text.toLowerCase().includes(search.toLowerCase());

  return (
    <IonPage>
      <IonContent className="bg-gray-100 dark:bg-[#0f172a]">

        <div className="p-4 space-y-4">

          {/* 🔍 SEARCH */}
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value!)}
            placeholder="Rechercher..."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* LEFT COLUMN */}
            <div className="hidden lg:flex flex-col gap-4">

              {/* TOUR CARD */}
              <div className="bg-green-100 rounded-2xl p-4 shadow">
                <h3 className="font-semibold text-green-800">
                  Tournée #T-2024-04-08
                </h3>
                <p className="text-sm text-green-700">
                  6 arrêts sur 9 complétés
                </p>

                <div className="w-full h-2 bg-green-200 rounded-full mt-2">
                  <div className="w-2/3 h-2 bg-green-500 rounded-full"></div>
                </div>

                <p className="text-xs mt-2 text-green-700">
                  66% — 12.4 km restants
                </p>
              </div>

              {/* STOPS */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow">
                <h3 className="font-semibold mb-3">Arrêts</h3>

                <div className="space-y-3">

                  {[1,2,3,4]
                    .filter((i) =>
                      match(
                        i === 1
                          ? "Dépôt Akwa"
                          : i === 2
                          ? "Akwa Bonanjo"
                          : i === 3
                          ? "Bonanjo Bali"
                          : "Bali Deido"
                      )
                    )
                    .map((i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          i === 3 ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center font-bold">
                            {i}
                          </div>

                          <div>
                            <p className="font-medium">
                              {i === 1 && "Dépôt → Akwa"}
                              {i === 2 && "Akwa → Bonanjo"}
                              {i === 3 && "Bonanjo → Bali"}
                              {i === 4 && "Bali → Deido"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {i === 3
                                ? "En cours · 5.0 km"
                                : i === 4
                                ? "À venir · 2.8 km"
                                : "Livré"}
                            </p>
                          </div>
                        </div>

                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      </div>
                    ))}

                </div>
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="hidden lg:flex flex-col gap-4">

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3">
                  KD
                </div>

                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  Kofi Diabaté
                </h2>

                <p className="text-sm text-gray-500">
                  Chauffeur confirmé · Zone Nord
                </p>

                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Actif
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Permis B+C
                  </span>
                </div>

                <div className="grid grid-cols-3 mt-4 text-center">
                  <div>
                    <p className="font-bold">2 847</p>
                    <p className="text-xs text-gray-500">Km totaux</p>
                  </div>
                  <div>
                    <p className="font-bold">134</p>
                    <p className="text-xs text-gray-500">Livraisons</p>
                  </div>
                  <div>
                    <p className="font-bold">4.9</p>
                    <p className="text-xs text-gray-500">Note</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow">
                <h3 className="font-semibold mb-3">Informations</h3>

                <div className="space-y-2 text-sm">
                  <p>Téléphone: +237 655 00 12 34</p>
                  <p>Email: k.diabate@fleet.cm</p>
                  <p>Véhicule: Toyota Hilux</p>
                  <p>Ancienneté: 3 ans</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-1 space-y-4">

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow space-y-6">

                <h2 className="font-bold text-lg dark:text-white">
                  Paramètres
                </h2>

                {/* GENERAL */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">GÉNÉRAL</p>

                  {match("Langue") && (
                    <IonItem lines="none">
                      <IonIcon icon={globeSharp} slot="start" />
                      <IonLabel>Langue</IonLabel>
                      <select
                        value={language}
                        onChange={(e) =>
                          setLanguage(e.target.value as Lang)
                        }
                        className="bg-gray-100 dark:bg-slate-800 p-2 rounded"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </IonItem>
                  )}

                  {match("Notifications") && (
                    <IonItem lines="none">
                      <IonIcon icon={notificationsSharp} slot="start" />
                      <IonLabel>Notifications push</IonLabel>
                      <IonToggle checked />
                    </IonItem>
                  )}

                  {match("Son") && (
                    <IonItem lines="none">
                      <IonIcon icon={volumeHighSharp} slot="start" />
                      <IonLabel>Son d'alerte</IonLabel>
                      <IonToggle checked />
                    </IonItem>
                  )}
                </div>

                {/* NAVIGATION */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">NAVIGATION</p>

                  {match("Mode carte") && (
                    <IonItem lines="none">
                      <IonIcon icon={mapSharp} slot="start" />
                      <IonLabel>Mode carte</IonLabel>
                      <span className="text-sm text-gray-500">
                        Satellite
                      </span>
                    </IonItem>
                  )}

                  {match("péages") && (
                    <IonItem lines="none">
                      <IonIcon icon={navigateSharp} slot="start" />
                      <IonLabel>Éviter péages</IonLabel>
                      <IonToggle />
                    </IonItem>
                  )}

                  {match("Recalcul") && (
                    <IonItem lines="none">
                      <IonIcon icon={navigateSharp} slot="start" />
                      <IonLabel>Recalcul auto</IonLabel>
                      <IonToggle checked />
                    </IonItem>
                  )}
                </div>

                {/* ACCOUNT */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">COMPTE</p>

                  {match("mot de passe") && (
                    <IonItem lines="none">
                      <IonIcon icon={keySharp} slot="start" />
                      <IonLabel>Changer mot de passe</IonLabel>
                    </IonItem>
                  )}

                  {match("Version") && (
                    <IonItem lines="none">
                      <IonLabel>Version app</IonLabel>
                      <span className="text-sm text-gray-500">
                        v2.4.1
                      </span>
                    </IonItem>
                  )}
                </div>

                {/* DARK MODE */}
                {match("Mode sombre") && (
                  <IonItem lines="none">
                    <IonIcon icon={moonSharp} slot="start" />
                    <IonLabel>Mode sombre</IonLabel>
                    <IonToggle
                      checked={darkMode}
                      onIonChange={(e) =>
                        setDarkMode(e.detail.checked)
                      }
                    />
                  </IonItem>
                )}

                {/* DIVERS */}
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Divers
                </p>

              </div>

              {/* LOGOUT */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow">
                <button className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold">
                  <IonIcon icon={logOutSharp} />
                  Se déconnecter
                </button>
              </div>

            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}