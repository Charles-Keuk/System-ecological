import React from 'react';
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet 
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';

import { map, statsChart, person, notifications } from 'ionicons/icons';

import HomePage from '../pages/acceuil/Acceuil';
import ItinerairePage from '../pages/itineraire/Itineraire';
import NotificationPage from '../pages/notification/Notification';
import ProfilPage from '../pages/profil/Profil';

function Example() {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />

          <Route path="/home" render={() => <HomePage />} exact />
          <Route path="/radio" render={() => <ItinerairePage />} exact />
          <Route path="/library" render={() => <NotificationPage />} exact />
          <Route path="/search" render={() => <ProfilPage />} exact />
        </IonRouterOutlet>

        {/* 🔵 Bottom bar stylée */}
        <IonTabBar
          slot="bottom"
          className="border-t border-blue-800 shadow-lg"
          style={{
            '--background': '#0f172a', // bleu sombre
            '--color': '#94a3b8',      // gris clair
            '--color-selected': '#3b82f6', // bleu vif (actif)
          }}
        >
          <IonTabButton tab="home" href="/home" className="hover:bg-blue-900/40">
            <IonIcon icon={statsChart} />
            <IonLabel className="text-xs">Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="radio" href="/radio" className="hover:bg-blue-900/40">
            <IonIcon icon={map} />
            <IonLabel className="text-xs">Itineraire</IonLabel>
          </IonTabButton>

          <IonTabButton tab="library" href="/library" className="hover:bg-blue-900/40">
            <IonIcon icon={notifications} />
            <IonLabel className="text-xs">Notifications</IonLabel>
          </IonTabButton>

          <IonTabButton tab="search" href="/search" className="hover:bg-blue-900/40">
            <IonIcon icon={person} />
            <IonLabel className="text-xs">Profil</IonLabel>
          </IonTabButton>
        </IonTabBar>

      </IonTabs>
    </IonReactRouter>
  );
}

export default Example;