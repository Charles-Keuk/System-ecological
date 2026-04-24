import React, { useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

const RapportPage: React.FC = () => {

  /* ========= SIGNATURE ========= */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signing, setSigning] = useState(false);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* ========= FILE ========= */
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <IonPage>

      {/* HEADER */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-4 py-2 bg-white">
          <IonTitle className="font-bold text-2xl text-gray-800">
            Rapport journalier
          </IonTitle>

          <IonButtons slot="end">
            <IonButton className="bg-blue-600 text-white rounded-lg px-4 h-10">
              Soumettre
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50">
        <IonGrid className="max-w-6xl mx-auto">
          <IonRow className="gap-6">

            {/* LEFT */}
            <IonCol size="12" sizeLg="5.8">
              <h2 className="section-title">Rapport de travail</h2>

              <IonCard className="card">
                <IonCardHeader>
                  <IonCardTitle>Informations de la journée</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="space-y-4">

                  <IonLabel className="label">Date</IonLabel>
                  <IonInput value="08 avril 2026" readonly className="input" />

                  <IonRow>
                    <IonCol>
                      <IonLabel className="label">Km départ</IonLabel>
                      <IonInput className="input" />
                    </IonCol>
                    <IonCol>
                      <IonLabel className="label">Km arrivée</IonLabel>
                      <IonInput className="input" />
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol>
                      <IonLabel className="label">Livraisons</IonLabel>
                      <IonInput className="input" />
                    </IonCol>
                    <IonCol>
                      <IonLabel className="label">Carburant</IonLabel>
                      <IonInput className="input" />
                    </IonCol>
                  </IonRow>

                  <IonLabel className="label">Observations</IonLabel>
                  <IonTextarea rows={4} className="input" />

                </IonCardContent>
              </IonCard>

              {/* SIGNATURE */}
              <IonCard className="card mt-6">
                <IonCardHeader>
                  <IonCardTitle>Signature électronique</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer"
                    onClick={() => setSigning(true)}
                  >

                    {!signing && (
                      <p className="text-gray-400">✍️ Signer ici</p>
                    )}

                    {signing && (
                      <>
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="w-full bg-white rounded-lg"
                          onMouseDown={startDraw}
                          onMouseMove={draw}
                          onMouseUp={stopDraw}
                          onMouseLeave={stopDraw}
                        />

                        <div className="flex gap-2 mt-3">
                          <IonButton size="small" fill="outline" onClick={clearSignature}>
                            Effacer
                          </IonButton>
                        </div>
                      </>
                    )}

                  </div>

                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* RIGHT */}
            <IonCol size="12" sizeLg="5.8" className="hinden lg:block">
              <h2 className="section-title">Envoyer une requête</h2>

              <IonCard className="card">
                <IonCardHeader>
                  <IonCardTitle>Nouvelle requête</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="space-y-4">

                  <IonSelect placeholder="Type de requête" className="input">
                    <IonSelectOption>Congé</IonSelectOption>
                    <IonSelectOption>Matériel</IonSelectOption>
                    <IonSelectOption>Accident</IonSelectOption>
                    <IonSelectOption>Santé</IonSelectOption>
                  </IonSelect>

                  <IonInput placeholder="Objet" className="input" />
                  <IonTextarea rows={4} placeholder="Description..." className="input" />

                  {/* FILE */}
                  <div>
                    <label className="label">Pièce jointe</label>

                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <label
                      htmlFor="fileUpload"
                      className="block border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition"
                    >
                      {fileName ? (
                        <span className="text-blue-600 font-semibold">
                          {fileName}
                        </span>
                      ) : (
                        "📎 Ajouter un fichier"
                      )}
                    </label>
                  </div>

                  <IonButton expand="block" className="bg-blue-600 text-white rounded-lg h-11">
                    Envoyer la requête
                  </IonButton>

                </IonCardContent>
              </IonCard>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>

      {/* STYLE */}
      <style>{`
        .card {
          @apply rounded-xl shadow-sm border border-gray-100;
        }



        .label {
          @apply text-gray-500 text-xs font-bold uppercase;
        }

        .section-title {
          @apply text-gray-500 font-bold text-xs uppercase mb-3 ml-1;
        }
      `}</style>

    </IonPage>
  );
};

export default RapportPage;