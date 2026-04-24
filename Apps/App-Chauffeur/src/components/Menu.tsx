import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonPage,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router';

import {
  map,
  notifications,
  documentText,
  list,
  checkmarkDone,
  person,
  settings,
  statsChart
} from 'ionicons/icons';

/* PAGES */
import HomePage from '../pages/acceuil/Acceuil';
import ItinerairePage from '../pages/itineraire/Itineraire';
import NotificationPage from '../pages/notification/Notification';
import ProfilPage from '../pages/profil/Profil';
import RapportPage from '../pages/rapport/Requete';
import RequetePage from '../pages/requete/Rapport';
import SettingPage from '../pages/parametre/SettingPage';
import Login from '../pages/connexion/Login';

const MainLayout: React.FC = () => {
  return (
    <IonReactRouter>

      {/* 🔥 MENU */}
      <IonMenu contentId="main-content" side="start">
        <IonHeader>
          <IonToolbar className="bg-gradient-to-b from-[#0f172a] to-[#1e3a5f]">
            <div className="flex items-center p-4 space-x-2">
              <div className="w-8 h-8 bg-[#3A5FFF] rounded flex items-center justify-center text-white font-bold">
                ▲
              </div>
              <IonTitle className="text-white font-bold">
                FleetDriver
              </IonTitle>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="bg-gradient-to-b from-[#0f172a] to-[#1e3a5f] text-white p-4">

          {/* RAPPORTS */}
          <p className="text-gray-400 uppercase text-xs mb-2 m-1">Rapports</p>

          <IonItem routerLink="/rapport" button className="menu-item">
            <IonIcon slot="start" icon={documentText} className='text-white m-2' />
            <IonLabel>Rapport journalier</IonLabel>
          </IonItem>

          <IonItem button className="menu-item" routerLink="/requete">
            <IonIcon slot="start" icon={list} className='text-white m-2'  />
            <IonLabel>Requêtes</IonLabel>
          </IonItem>

          <IonItem button className="menu-item" routerLink="/valider-tournee">
            <IonIcon slot="start" icon={checkmarkDone} className='text-white m-2' />
            <IonLabel>Valider tournée</IonLabel>
          </IonItem>

          {/* COMPTE */}
          <p className="text-gray-400 uppercase text-xs mt-4 mb-2 m-1">Compte</p>

          <IonItem button className="menu-item" routerLink="/profil" >
            <IonIcon slot="start" icon={person} className='text-white m-2'  />
            <IonLabel>Profil</IonLabel>
          </IonItem>

          <IonItem button className="menu-item" routerLink="/settings">
            <IonIcon slot="start" icon={settings} className='text-white m-2' />
            <IonLabel>Paramètres</IonLabel>
          </IonItem>

        </IonContent>
      </IonMenu>

      {/* 🔥 CONTENU PRINCIPAL */}
      <IonPage id="main-content">

        <IonTabs>

          <IonRouterOutlet>
            <Redirect exact path="/" to="/home" />

            <Route path="/home" component={HomePage} exact />
            <Route path="/itineraire" component={ItinerairePage} exact />
            <Route path="/notification" component={NotificationPage} exact />
            <Route path="/profil" component={ProfilPage} exact />
            <Route path="/rapport" component={RapportPage} exact />
            <Route path="/requete" component={RequetePage} exact />
            <Route path="/settings" component={SettingPage} exact />
            <Route path="/login" component={Login} exact />
          </IonRouterOutlet>

          {/* 🔥 BOTTOM BAR */}
          <IonTabBar
            slot="bottom"
            className="border-t border-blue-800 shadow-lg"
            style={{
              '--background': '#0f172a',
              '--color': '#94a3b8',
              '--color-selected': '#3b82f6',
            }}
          >
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={statsChart} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="itineraire" href="/itineraire">
              <IonIcon icon={map} />
              <IonLabel>Itinéraire</IonLabel>
            </IonTabButton>

            <IonTabButton tab="notification" href="/notification">
              <IonIcon icon={notifications} />
              <IonLabel>Notif</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profil" href="/profil">
              <IonIcon icon={person} />
              <IonLabel>Profil</IonLabel>
            </IonTabButton>
          </IonTabBar>

        </IonTabs>
      </IonPage>

      {/* STYLE MENU */}
      <style>{`
        .menu-item {
          --background: transparent;
          --color: white;
          margin-bottom: 6px;
          border-radius: 10px;
        }

        .menu-item:hover {
          background: #3A5FFF;
        }
      `}</style>

    </IonReactRouter>
  );
};

export default MainLayout;