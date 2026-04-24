import React from "react";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";

const ProfileForm: React.FC = () => {
  return (
    <div className="space-y-5">

      {/* NOM */}
      <div>
        <IonLabel className="text-sm text-gray-500">
          Nom complet
        </IonLabel>
        <IonItem
          lines="none"
          className="mt-1 rounded-lg border border-gray-200 focus-within:border-blue-500"
        >
          <IonInput
            value="Kofi Diabaté"
            className="px-2"
          />
        </IonItem>
      </div>

      {/* TELEPHONE */}
      <div>
        <IonLabel className="text-sm text-gray-500">
          Téléphone
        </IonLabel>
        <IonItem
          lines="none"
          className="mt-1 rounded-lg border border-gray-200 focus-within:border-blue-500"
        >
          <IonInput
            value="+237 655 00 12 34"
            className="px-2"
          />
        </IonItem>
      </div>

      {/* EMAIL */}
      <div>
        <IonLabel className="text-sm text-gray-500">
          Email
        </IonLabel>
        <IonItem
          lines="none"
          className="mt-1 rounded-lg border border-gray-200 focus-within:border-blue-500"
        >
          <IonInput
            value="k.diabate@fleet.cm"
            className="px-2"
          />
        </IonItem>
      </div>

      {/* VEHICULE */}
      <div>
        <IonLabel className="text-sm text-gray-500">
          Véhicule
        </IonLabel>
        <IonItem
          lines="none"
          className="mt-1 rounded-lg border border-gray-200 focus-within:border-blue-500"
        >
          <IonInput
            value="Toyota Hilux - DLA-2456-A"
            className="px-2"
          />
        </IonItem>
      </div>

      {/* ANCIENNETE */}
      <div>
        <IonLabel className="text-sm text-gray-500">
          Ancienneté
        </IonLabel>
        <IonItem
          lines="none"
          className="mt-1 rounded-lg border border-gray-200 focus-within:border-blue-500"
        >
          <IonInput
            value="3 ans"
            className="px-2"
          />
        </IonItem>
      </div>

      {/* BOUTONS */}
      <div className="flex gap-3 pt-2">

        <IonButton
          expand="block"
          className="flex-1"
        >
          Enregistrer
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          className="flex-1"
        >
          Annuler
        </IonButton>

      </div>

    </div>
  );
};

export default ProfileForm;