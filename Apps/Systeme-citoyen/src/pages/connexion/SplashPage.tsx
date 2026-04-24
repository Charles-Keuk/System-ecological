import React, { useEffect, useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useHistory } from "react-router-dom";

const HeroSplash: React.FC = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // animation entry
    setShow(true);

    // redirect after 3 seconds
    const timer = setTimeout(() => {
      history.replace("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#2563eb]">

          <div
            className={`text-center transition-all duration-700 ${
              show ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >

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

          </div>

        </div>

      </IonContent>
    </IonPage>
  );
};

export default HeroSplash;