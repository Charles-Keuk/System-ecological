import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonModal,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { createOutline, close } from "ionicons/icons";

const Profile: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const Form = () => (
    <div className="space-y-4">
      <IonItem>
        <IonLabel position="stacked">Nom complet</IonLabel>
        <IonInput value="Kofi Diabaté" />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Téléphone</IonLabel>
        <IonInput value="+237 655 00 12 34" />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput value="k.diabate@fleet.cm" />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Véhicule</IonLabel>
        <IonInput value="Toyota Hilux - DLA-2456-A" />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Ancienneté</IonLabel>
        <IonInput value="3 ans" />
      </IonItem>

      <IonButton expand="block" className="mt-4">
        Enregistrer
      </IonButton>
    </div>
  );

  return (
    <IonPage>

      {/* HEADER */}
      <IonHeader className="bg-white/70 backdrop-blur-md shadow-sm">
        <IonToolbar className="bg-transparent flex justify-between items-center px-4">

          <IonTitle>Profil</IonTitle>

          {/* MOBILE BUTTON */}
          <IonButton
            fill="clear"
            className="md:hidden"
            onClick={() => setOpenModal(true)}
          >
            <IonIcon icon={createOutline} />
          </IonButton>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-gray-100">
        <div className="p-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div>

            {/* PROFILE */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                KD
              </div>

              <h2 className="text-xl font-bold mt-3">
                Kofi Diabaté
              </h2>

              <p className="text-gray-500">
                Chauffeur confirmé · Zone Nord
              </p>

              <div className="flex justify-center gap-2 mt-2">
                <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Actif
                </span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
                  Permis B+C
                </span>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 text-center mt-6 border-t pt-4">
              <div>
                <p className="text-xl font-bold">2 847</p>
                <p className="text-gray-500 text-sm">Km totaux</p>
              </div>
              <div>
                <p className="text-xl font-bold">134</p>
                <p className="text-gray-500 text-sm">Livraisons</p>
              </div>
              <div>
                <p className="text-xl font-bold">4.9</p>
                <p className="text-gray-500 text-sm">Note</p>
              </div>
            </div>

            {/* INFO CARD */}
            <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Informations</h3>

                {/* DESKTOP BUTTON */}
                <button
                  className="text-blue-500 text-sm hidden md:block"
                  onClick={() => setOpenModal(true)}
                >
                  Modifier
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <p><b>Tél :</b> +237 655 00 12 34</p>
                <p><b>Email :</b> k.diabate@fleet.cm</p>
                <p><b>Véhicule :</b> Toyota Hilux - DLA-2456-A</p>
                <p><b>Ancienneté :</b> 3 ans</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (DESKTOP FORM) */}
          <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4">
              Modifier le profil
            </h3>

            <Form />
          </div>

        </div>

        {/* MODAL MOBILE */}
        <IonModal isOpen={openModal} onDidDismiss={() => setOpenModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Modifier profil</IonTitle>

              <IonButton
                slot="end"
                fill="clear"
                onClick={() => setOpenModal(false)}
              >
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <Form />
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Profile;