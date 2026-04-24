import React from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "./index.css";

import { useStore } from "./store";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import DashboardShell from "./pages/admin/DashboardShell"; // ← layout unique

setupIonicReact({ mode: "md" });

const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const { user, token } = useStore();
  return (
    <Route
      {...rest}
      render={() =>
        token && user ? <Component /> : <Redirect to="/login" />
      }
    />
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          <Route exact path="/login"    component={Login} />
          <Route exact path="/register" component={Register} />
          {/* Tout le dashboard est géré par DashboardShell */}
          <PrivateRoute path="/app" component={DashboardShell} />
          <Route exact path="/">
            <Redirect to="/app/dashboard" />
          </Route>
          <Route>
            <Redirect to="/app/dashboard" />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
