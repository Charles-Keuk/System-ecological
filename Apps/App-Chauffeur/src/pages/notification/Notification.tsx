import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonToggle,
} from "@ionic/react";

import {
  alertCircle,
  location,
  checkmark,
  ellipsisVertical,
  checkmarkDone,
  trash,
  filter,
  settings,

} from "ionicons/icons";

const NotificationPage: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const [preferences, setPreferences] = useState({
    push: true,
    retard: true,
    route: true,
    rapport: false,
  });

  const notifications = [
    {
      type: "Alertes",
      icon: alertCircle,
      color: "text-red-500 bg-red-100",
      title: "Alerte — Retard détecté",
      desc: "Livraison #4821 a 18 min de retard sur l'horaire prévu.",
      time: "il y a 5 min",
      read: false,
    },
    {
      type: "Itinéraires",
      icon: location,
      color: "text-blue-500 bg-blue-100",
      title: "Itinéraire modifié",
      desc: "Votre route vers Akwa a été mise à jour suite à un embouteillage.",
      time: "il y a 23 min",
      read: false,
    },
    {
      type: "Rapports",
      icon: checkmark,
      color: "text-green-500 bg-green-100",
      title: "Livraison confirmée",
      desc: "Colis #3305 déposé avec succès chez le client Mboppi.",
      time: "il y a 1h",
      read: true,
    },
  ];

  const filteredNotifications = notifications
    .filter((n) => {
      // SEARCH (title + desc)
      const matchSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.desc.toLowerCase().includes(search.toLowerCase());

      // FILTER CATEGORY
      const matchFilter =
        activeFilter === "Tous" || n.type === activeFilter;

      // PREFS (simulate real filtering logic)
      const matchPrefs =
        (preferences.retard || n.type !== "Alertes") &&
        (preferences.route || n.type !== "Itinéraires");

      return matchSearch && matchFilter && matchPrefs;
    });

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-screen bg-[#f1f5f9]">

          {/* HEADER */}
          <div className="relative flex items-center justify-center px-4 py-4 backdrop-blur-md bg-white/60">
            <h1 className="text-lg-gray font-bold">Notifications</h1>

            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="absolute right-4 top-1/2 -translate-y-1/2 
              w-10 h-10 flex items-center justify-center 
              rounded-full bg-white/40 backdrop-blur-md 
              shadow-md active:scale-95 transition"
            >
              <IonIcon icon={ellipsisVertical} />
            </button>

            {/* MENU */}
            {openMenu && (
              <div className="absolute right-4 top-14 w-64 bg-white rounded-xl shadow-xl p-3 z-50 animate-fadeIn">

                <p className="text-xs text-gray-400 mb-2">Actions</p>

                <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100">
                  <IonIcon icon={checkmarkDone} />
                  <span className="text-sm">Tout marquer lu</span>
                </button>

                <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 text-red-500">
                  <IonIcon icon={trash} />
                  <span className="text-sm">Supprimer</span>
                </button>

                <p className="text-xs text-gray-400 mt-4 mb-2">Filtrer par</p>

                {["Tous", "Alertes", "Rapports", "Itinéraires"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg transition
                      ${activeFilter === f ? "bg-blue-100" : "hover:bg-blue-50"}`}
                  >
                    <IonIcon icon={filter} />
                    <span className="text-sm">{f}</span>
                  </button>
                ))}

                <div className="border-t mt-3 pt-3">
                  <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100">
                    <IonIcon icon={settings} />
                    <span className="text-sm">Gérer le filtrage</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <div className="px-4 md:px-6 mt-4">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-4 py-3 w-full md:w-[60%] md:mx-auto">
              <IonIcon icon={search} className="text-gray-500 text-lg" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une notification..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* LAYOUT */}
          <div className="md:flex md:gap-6 md:p-6">

            {/* LEFT */}
            <div className="flex-1 px-4 py-4 md:p-0">

              <p className="text-xs text-gray-500 font-semibold mb-3">
                AUJOURD'HUI
              </p>

              {filteredNotifications.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-start justify-between"
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color}`}>
                      <IonIcon icon={item.icon} />
                    </div>

                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>

                  {!item.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}

            </div>

            {/* RIGHT */}
            <div className="hidden md:block w-[320px]">

              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <h2 className="font-semibold mb-4">Résumé</h2>

                <div className="flex gap-3">
                  <div className="flex-1 shadow rounded-lg p-3">
                    <p className="text-sm text-gray-500">Non lues</p>
                    <p className="text-xl font-bold text-red-500">
                      {filteredNotifications.filter(n => !n.read).length}
                    </p>
                  </div>

                  <div className="flex-1 shadow rounded-lg p-3">
                    <p className="text-sm text-gray-500">Alertes</p>
                    <p className="text-xl font-bold text-orange-500">
                      {filteredNotifications.filter(n => n.type === "Alertes").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* PREFS (DYNAMIQUE) */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="font-semibold mb-4">Préférences</h2>

                {[
                  { key: "push", label: "Push browser" },
                  { key: "retard", label: "Alertes retard" },
                  { key: "route", label: "Mises à jour route" },
                  { key: "rapport", label: "Rapports validés" },
                ].map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center justify-between py-2 last:border-none"
                  >
                    <p className="text-sm">{p.label}</p>
                    <IonToggle
                      checked={preferences[p.key as keyof typeof preferences]}
                      onIonChange={() => togglePref(p.key as keyof typeof preferences)}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotificationPage;