import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const HomePage = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Itinéraire</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        ici Itinéraire content
      </div>
    </IonContent>
  </IonPage>
);

export default HomePage;