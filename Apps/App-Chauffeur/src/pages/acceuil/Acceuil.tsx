import React from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";

import {
  statsChart,
  cube,
  time,
  checkmarkCircle,
  eye,
  create,
  alertCircle,
  navigate,
} from "ionicons/icons";

const Dashboard: React.FC = () => {
  return (
    <IonPage>

      {/* 🔥 HEADER AVEC MENU */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="bg-white shadow-sm px-2">

          <IonButtons slot="start">
            <IonMenuButton className="text-[#3A5FFF]" />
          </IonButtons>

          <IonTitle className="font-semibold text-gray-800">
            Tableau de bord
          </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-gray-100">
        <div className="p-4 space-y-4">

          {/* TOP CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Km aujourd'hui",
                value: "342",
                badge: "+12% vs hier",
                color: "bg-green-100 text-green-600",
                icon: statsChart,
              },
              {
                title: "Livraisons",
                value: "8 / 9",
                badge: "En cours",
                color: "bg-blue-100 text-blue-600",
                icon: cube,
              },
              {
                title: "Temps conduite",
                value: "4h 32",
                badge: "Normal",
                color: "bg-green-100 text-green-600",
                icon: time,
              },
              {
                title: "Ponctualité",
                value: "96%",
                badge: "Excellent",
                color: "bg-green-100 text-green-600",
                icon: checkmarkCircle,
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <IonIcon
                    icon={card.icon}
                    className="text-gray-400 text-lg"
                  />
                </div>

                <h2 className="text-2xl font-bold mt-1">
                  {card.value}
                </h2>

                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${card.color}`}
                >
                  {card.badge}
                </span>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* PERFORMANCE */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between mb-2 items-center">
                <h3 className="font-semibold">
                  Performance de la semaine
                </h3>

                <div className="flex items-center gap-1 text-blue-500 text-sm cursor-pointer">
                  <IonIcon icon={eye} />
                  Voir tout
                </div>
              </div>

              <div className="h-32 bg-gradient-to-t from-blue-100 to-transparent rounded-lg flex items-end">
                <div className="w-full h-1 bg-blue-500 rounded"></div>
              </div>
            </div>

            {/* TOURNEE */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between mb-2 items-center">
                <h3 className="font-semibold">Tournée du jour</h3>

                <div className="flex items-center gap-1 text-blue-500 text-sm cursor-pointer">
                  <IonIcon icon={create} />
                  Modifier
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                6 arrêts sur 9 complétés
              </p>

              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                66% • 12.4 km restants
              </p>

              {[
                {
                  name: "Dépôt Central",
                  status: "OK",
                  color: "bg-green-100 text-green-600",
                },
                {
                  name: "Arrêt Akwa",
                  status: "En cours",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  name: "Client Bonanjo",
                  status: "À venir",
                  color: "bg-orange-100 text-orange-600",
                },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">{item.name}</p>

                  <span className={`px-2 py-1 text-xs rounded-full ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* LIVRAISONS */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between mb-2 items-center">
                <h3 className="font-semibold">Livraisons récentes</h3>

                <div className="flex items-center gap-1 text-blue-500 text-sm">
                  <IonIcon icon={eye} />
                  Voir tout
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  {
                    id: "#4821",
                    name: "Mboppi SARL",
                    zone: "Akwa",
                    time: "08:15",
                    status: "Livré",
                    color: "bg-green-100 text-green-600",
                  },
                  {
                    id: "#4822",
                    name: "Ets Momo",
                    zone: "Bonanjo",
                    time: "09:40",
                    status: "Livré",
                    color: "bg-green-100 text-green-600",
                  },
                  {
                    id: "#4823",
                    name: "Carrefour Bali",
                    zone: "Bali",
                    time: "11:00",
                    status: "En cours",
                    color: "bg-blue-100 text-blue-600",
                  },
                  {
                    id: "#4824",
                    name: "Supermarché Deido",
                    zone: "Deido",
                    time: "14:00",
                    status: "À venir",
                    color: "bg-orange-100 text-orange-600",
                  },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {row.id} {row.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {row.zone} • {row.time}
                      </p>
                    </div>

                    <span className={`px-2 py-1 text-xs rounded-full ${row.color}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ALERTES */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Alertes</h3>

              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full">
                    <IonIcon icon={alertCircle} className="text-red-500" />
                  </div>

                  <div>
                    <p className="font-medium">Retard détecté #4821</p>
                    <p className="text-xs text-gray-500">
                      18 min de retard sur Akwa
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
                    <IonIcon icon={navigate} className="text-orange-500" />
                  </div>

                  <div>
                    <p className="font-medium">Itinéraire recalculé</p>
                    <p className="text-xs text-gray-500">
                      Embouteillage Akwa → Bali
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;