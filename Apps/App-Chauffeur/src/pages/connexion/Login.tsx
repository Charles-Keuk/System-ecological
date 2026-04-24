// src/pages/connexion/Login.tsx

import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
} from "@ionic/react";

import { useIonRouter } from "@ionic/react";

const API_URL = "http://localhost:3000/api";

const Login: React.FC = () => {
  const router = useIonRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("USERNAME:", username);
      console.log("PASSWORD:", password);

      if (!username || !password) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      // 🔥 Lire d'abord en texte (évite crash JSON)
      const text = await response.text();
      console.log("📡 Réponse brute serveur :", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Réponse non JSON (probable 404 HTML)");
        alert("Erreur serveur : mauvaise route ou serveur indisponible");
        return;
      }

      console.log("📡 Réponse JSON :", data);

      if (!response.ok) {
        alert(data.message || "Erreur de connexion");
        return;
      }

      console.log("🚀 LOGIN SUCCESS");

      // 💾 sauvegarde user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // 🎯 REDIRECTION SELON ROLE
      const role = data.user?.role;

      switch (role) {
        case "admin":
          router.push("/admin/dashboard", "root");
          break;

        case "chauffeur":
          router.push("/acceuil/Acceuil", "root"); // ⚠️ corriger chemin si besoin
          break;

        case "citoyen":
          router.push("/heropage", "root");
          break;

        default:
          router.push("/heropage", "root");
          break;
      }

    } catch (error) {
      console.error("🔥 Erreur serveur :", error);
      alert("Impossible de contacter le serveur");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e3a5f]">

          <div className="w-full px-6 max-w-sm text-center">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-white text-2xl font-semibold mb-2">
              FleetDriver
            </h1>

            <p className="text-gray-300 text-sm mb-8">
              Connectez-vous à votre compte
            </p>

            {/* Inputs */}
            <div className="gap-8 flex flex-col">

              <IonInput
                label="Nom d'utilisateur"
                type="text"
                fill="outline"
                labelPlacement="floating"
                className="bg-white/10 text-white"
                value={username}
                onIonInput={(e) => setUsername(e.detail.value || "")}
              />

              <IonInput
                label="Mot de passe"
                type="password"
                fill="outline"
                labelPlacement="floating"
                className="bg-white/10 text-white"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || "")}
              />

            </div>

            {/* Button */}
            <IonButton
              expand="full"
              fill="clear"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-6 shadow-lg transition duration-300"
              onClick={handleLogin}
            >
              Se connecter
            </IonButton>

            {/* Forgot password */}
            <p className="mt-4 text-blue-400 text-sm">
              Mot de passe oublié ?
            </p>

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;