import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import {
  leafOutline,
  personOutline,
  mailOutline,
  callOutline,
  lockClosedOutline,
  shieldOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import './register.css';

const API_URL = "http://localhost:3000/api";

/* ═══════════════════════════════════════════════════
   STYLES — dark navy bleu foncé, pleine page, animé
═══════════════════════════════════════════════════ */
const STYLES = `

`;

/* ══ Canvas particules réseau ══ */
const Particles: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * c.width,
      y:  Math.random() * c.height,
      r:  0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  0.15 + Math.random() * 0.55,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,90,220,${0.20 * (1 - d / 115)})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(70,150,255,${p.a})`;
        ctx.shadowColor = "rgba(0,120,255,0.6)";
        ctx.shadowBlur  = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width)  p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="rg-canvas" />;
};

/* ══════════════════════════════════════════
   COMPOSANT REGISTER
══════════════════════════════════════════ */
const Register: React.FC = () => {
  const router = useIonRouter();

  /* ── état formulaire (logique INCHANGÉE) ── */
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", role: "citoyen",
  });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  /* nb champs remplis → barre de progression */
  const filled = [form.name, form.email, form.phone, form.password, form.role]
    .filter(Boolean).length;

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /* ── handleRegister INCHANGÉ ── */
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Erreur inscription"); return; }
      alert("Compte créé avec succès");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <style>{STYLES}</style>

      <IonContent fullscreen scrollY={false}>
        <div className="rg-root">

          {/* ── arrière-plans ── */}
          <div className="rg-bg"   />
          <div className="rg-grid" />
          <Particles />
          <div className="rg-orb rg-orb-1" />
          <div className="rg-orb rg-orb-2" />
          <div className="rg-orb rg-orb-3" />

          {/* ══ CARTE ══ */}
          <div className="rg-card">

            {/* ═══ GAUCHE ═══ */}
            <div className="rg-left">
              <div className="rg-c1" /><div className="rg-c2" /><div className="rg-c3" />
              <div className="rg-scan" />

              {/* Logo */}
              <div className="rg-logo">
                <div className="rg-logo-ring">
                  <IonIcon icon={leafOutline} style={{ color:"#fff", fontSize:"20px" }} />
                </div>
                <span className="rg-logo-name">
                  Eco<span className="rg-logo-accent">Alert</span>
                </span>
              </div>

              {/* Texte central */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <p className="rg-tag">Bienvenue</p>
                <h2 className="rg-heading">
                  Rejoignez la<br/>
                  <em>communauté</em><br/>
                  EcoAlert
                </h2>
                <p className="rg-desc">
                  Signalez, suivez et contribuez à un
                  environnement plus propre — ensemble,
                  en temps réel.
                </p>
                <div className="rg-features">
                  {[
                    "Signalement en temps réel",
                    "Suivi de collecte intelligent",
                    "Impact mesuré et visible",
                    "Communauté engagée",
                  ].map(f => (
                    <div key={f} className="rg-feat">
                      <div className="rg-feat-dot" />{f}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ═══ DROITE — FORMULAIRE ═══ */}
            <div className="rg-right">

              <div className="rg-scroll">

                <p className="rg-ftitle">Créer un compte</p>
                <p className="rg-fsub">Remplissez les champs pour vous inscrire</p>

                {/* Barre de progression */}
                <div className="rg-progress">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className={`rg-seg ${i < filled ? "on" : ""}`} />
                  ))}
                </div>

                {/* Nom complet */}
                <div className="rg-field d1">
                  <div className="rg-lbl">
                    <IonIcon icon={personOutline} className="rg-lbl-ico" />
                    Nom complet <span className="rg-req">*</span>
                  </div>
                  <div className="rg-inp">
                    <IonInput
                      placeholder="Jean Dupont"
                      value={form.name}
                      onIonInput={e => handleChange("name", e.detail.value || "")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="rg-field d2">
                  <div className="rg-lbl">
                    <IonIcon icon={mailOutline} className="rg-lbl-ico" />
                    Email <span className="rg-req">*</span>
                  </div>
                  <div className="rg-inp">
                    <IonInput
                      type="email"
                      placeholder="jean@exemple.com"
                      value={form.email}
                      onIonInput={e => handleChange("email", e.detail.value || "")}
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="rg-field d3">
                  <div className="rg-lbl">
                    <IonIcon icon={callOutline} className="rg-lbl-ico" />
                    Téléphone
                  </div>
                  <div className="rg-inp">
                    <IonInput
                      placeholder="+237 6 00 00 00 00"
                      value={form.phone}
                      onIonInput={e => handleChange("phone", e.detail.value || "")}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="rg-field d4">
                  <div className="rg-lbl">
                    <IonIcon icon={lockClosedOutline} className="rg-lbl-ico" />
                    Mot de passe <span className="rg-req">*</span>
                  </div>
                  <div className="rg-inp">
                    <IonInput
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onIonInput={e => handleChange("password", e.detail.value || "")}
                    />
                    <button className="rg-eye" onClick={() => setShowPass(p => !p)}>
                      <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} />
                    </button>
                  </div>
                </div>

                {/* Rôle */}
                <div className="rg-field d5">
                  <div className="rg-lbl">
                    <IonIcon icon={shieldOutline} className="rg-lbl-ico" />
                    Rôle
                  </div>
                  <div className="rg-sel">
                    <IonSelect
                      placeholder="Choisir un rôle"
                      value={form.role}
                      onIonChange={e => handleChange("role", e.detail.value)}
                    >
                      <IonSelectOption value="citoyen">Citoyen</IonSelectOption>
                      <IonSelectOption value="chauffeur">Chauffeur</IonSelectOption>
                      <IonSelectOption value="admin">Admin</IonSelectOption>
                    </IonSelect>
                  </div>
                </div>

                {/* Bouton */}
                <div className="rg-btn-wrap rounded-lg">
                  <IonButton
                    expand="full"
                    onClick={handleRegister}
                    disabled={loading}
                    className="rg-btn"
                  >
                    {loading ? (
                      <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span className="rg-spinner" />
                        Inscription…
                      </span>
                    ) : (
                      <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                        S'inscrire
                        <IonIcon icon={arrowForwardOutline} style={{ fontSize:16 }} />
                      </span>
                    )}
                  </IonButton>
                </div>

                {/* Divider */}
                <div className="rg-div">
                  <div className="rg-div-line" />
                  <span className="rg-div-txt">ou</span>
                  <div className="rg-div-line" />
                </div>

                {/* Lien connexion */}
                <div className="rg-link">
                  Déjà un compte ?&nbsp;
                  <a onClick={() => router.push("/")}>
                    Se connecter
                    <IonIcon icon={arrowForwardOutline} style={{ fontSize:12 }} />
                  </a>
                </div>

              </div>
            </div>
          </div>{/* fin rg-card */}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
