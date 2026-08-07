if (Notification.permission !== "granted") {
  Notification.requestPermission();
}let tousLesJours = ["Lundi","Mardi","Mercredi",
"Jeudi","Vendredi","Samedi","Dimanche"];

function afficherDateHeure() {
  let maintenant = new Date();
  let jours = ["Dimanche","Lundi","Mardi",
  "Mercredi","Jeudi","Vendredi","Samedi"];
  let jour = jours[maintenant.getDay()];
  let date = maintenant.getDate();
  let mois = maintenant.getMonth() + 1;
  let annee = maintenant.getFullYear();
  let heures = maintenant.getHours();
  let minutes = maintenant.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  document.getElementById("dateHeure").innerHTML = 
    "📅 " + jour + " " + date + "/" + mois + 
    "/" + annee + " — ⏰ " + heures + "h" + minutes;
}

setInterval(afficherDateHeure, 1000);
afficherDateHeure();

function sauvegarder() {
  tousLesJours.forEach(function(jour) {
    let liste = document.getElementById("liste" + jour);
    let taches = [];
    liste.querySelectorAll("li").forEach(function(li) {
      let texte = li.querySelector("span").innerText;
      let barre = li.querySelector("span").style.textDecoration;
      taches.push({texte: texte, barre: barre});
    });
    localStorage.setItem(jour, JSON.stringify(taches));
  });
}

function charger() {
  tousLesJours.forEach(function(jour) {
    let donnees = localStorage.getItem(jour);
    if (donnees) {
      let taches = JSON.parse(donnees);
      taches.forEach(function(t) {
        ajouterElement(jour, t.texte, t.barre);
      });
    }
  });
}

function ajouterElement(jour, texte, heure, barre) {
  let liste = document.getElementById("liste" + jour);
  let element = document.createElement("li");
  let heureAffichee = heure ? "⏰ " + heure + " — " : "";
  
  element.innerHTML = 
    "<span onclick='basculerBarre(this)' style='flex:1; cursor:pointer; text-decoration:" + barre + ";'>" + heureAffichee + "✅ " + texte + "</span>" +
    "<span onclick='this.parentElement.remove(); sauvegarder();' style='cursor:pointer; font-size:18px;'>🗑️</span>";
  
  liste.appendChild(element);

  if (heure) {
    programmerRappel(texte, heure);
  }
}

function ajouterTache() {
  let tache = document.getElementById("tache").value;
  let heure = document.getElementById("heureTache").value;
  let jour = document.getElementById("jourChoisi").value;
  if (tache === "") {
    alert("Écrivez une tâche d'abord !");
    return;
  }
  ajouterElement(jour, tache, heure, "none");
  sauvegarder();
  document.getElementById("tache").value = "";
  document.getElementById("heureTache").value = "";
                        }

function afficherJour() {
  let jours = ["Dimanche","Lundi","Mardi",
  "Mercredi","Jeudi","Vendredi","Samedi"];
  let aujourdhui = jours[new Date().getDay()];
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) {
      carte.style.display = 
        (jour === aujourdhui) ? "block" : "none";
    }
  });
}

function afficherSemaine() {
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) carte.style.display = "block";
  });
}

charger();
function programmerRappel(texte, heure) {
function jouerSon(contexte) {
  let oscillateur = contexte.createOscillator();
  let gain = contexte.createGain();
  oscillateur.connect(gain);
  gain.connect(contexte.destination);
  oscillateur.frequency.value = 880;
  oscillateur.type = "sine";
  gain.gain.setValueAtTime(0.8, contexte.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, 
  contexte.currentTime + 0.5);
  oscillateur.start(contexte.currentTime);
  oscillateur.stop(contexte.currentTime + 0.5);
}

function programmerRappel(texte, heure) {
  let maintenant = new Date();
  let [h, m] = heure.split(":").map(Number);
  let rappel = new Date();
  rappel.setHours(h, m, 0, 0);
  let diff = rappel - maintenant;

  if (diff > 0) {
    setTimeout(function() {
      afficherAlarme(texte, heure);
    }, diff);
  }
}

function afficherAlarme(texte, heure) {
  let overlay = document.createElement("div");
  overlay.id = "alarme-overlay";
  overlay.style.cssText = 
    "position:fixed; top:0; left:0; width:100%; height:100%;" +
    "background:rgba(0,0,0,0.92); z-index:9999;" +
    "display:flex; flex-direction:column;" +
    "align-items:center; justify-content:center; text-align:center;";
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let tousLesJours = ["Lundi","Mardi","Mercredi",
"Jeudi","Vendredi","Samedi","Dimanche"];

function afficherDateHeure() {
  let maintenant = new Date();
  let jours = ["Dimanche","Lundi","Mardi",
  "Mercredi","Jeudi","Vendredi","Samedi"];
  let jour = jours[maintenant.getDay()];
  let date = maintenant.getDate();
  let mois = maintenant.getMonth() + 1;
  let annee = maintenant.getFullYear();
  let heures = maintenant.getHours();
  let minutes = maintenant.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  document.getElementById("dateHeure").innerHTML = 
    "📅 " + jour + " " + date + "/" + mois + 
    "/" + annee + " — ⏰ " + heures + "h" + minutes;
}

setInterval(afficherDateHeure, 1000);
afficherDateHeure();

function sauvegarder() {
  tousLesJours.forEach(function(jour) {
    let liste = document.getElementById("liste" + jour);
    let taches = [];
    liste.querySelectorAll("li").forEach(function(li) {
      let span = li.querySelector("span");
      let texte = span.innerText;
      let barre = span.style.textDecoration;
      taches.push({texte: texte, barre: barre});
    });
    localStorage.setItem(jour, JSON.stringify(taches));
  });
}

function charger() {
  tousLesJours.forEach(function(jour) {
    let donnees = localStorage.getItem(jour);
    if (donnees) {
      let taches = JSON.parse(donnees);
      taches.forEach(function(t) {
        ajouterElement(jour, t.texte, "", t.barre);
      });
    }
  });
}

function basculerBarre(element) {
  if (element.style.textDecoration === "line-through") {
    element.style.textDecoration = "none";
  } else {
    element.style.textDecoration = "line-through";
  }
  sauvegarder();
}

function ajouterElement(jour, texte, heure, barre) {
  let liste = document.getElementById("liste" + jour);
  let element = document.createElement("li");
  let heureAffichee = heure ? "⏰ " + heure + " — " : "";
  
  element.innerHTML = 
    "<span onclick='basculerBarre(this)' style='flex:1; cursor:pointer; text-decoration:" + barre + ";'>" + 
    heureAffichee + "✅ " + texte + "</span>" +
    "<span onclick='this.parentElement.remove(); sauvegarder();' " +
    "style='cursor:pointer; font-size:18px;'>🗑️</span>";
  
  liste.appendChild(element);

  if (heure) {
    programmerRappel(texte, heure);
  }
}

function ajouterTache() {
  let tache = document.getElementById("tache").value;
  let heure = document.getElementById("heureTache").value;
  let jour = document.getElementById("jourChoisi").value;
  
  if (tache === "") {
    alert("Écrivez une tâche d'abord !");
    return;
  }
  
  ajouterElement(jour, tache, heure, "none");
  sauvegarder();
  document.getElementById("tache").value = "";
  document.getElementById("heureTache").value = "";
}

function afficherJour() {
  let jours = ["Dimanche","Lundi","Mardi",
  "Mercredi","Jeudi","Vendredi","Samedi"];
  let aujourdhui = jours[new Date().getDay()];
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) {
      carte.style.display = 
        (jour === aujourdhui) ? "block" : "none";
    }
  });
}

function afficherSemaine() {
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) carte.style.display = "block";
  });
}

function jouerSon(contexte) {
  let oscillateur = contexte.createOscillator();
  let gain = contexte.createGain();
  oscillateur.connect(gain);
  gain.connect(contexte.destination);
  oscillateur.frequency.value = 880;
  oscillateur.type = "sine";
  gain.gain.setValueAtTime(0.8, contexte.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, 
  contexte.currentTime + 0.5);
  oscillateur.start(contexte.currentTime);
  oscillateur.stop(contexte.currentTime + 0.5);
}

function programmerRappel(texte, heure) {
  let maintenant = new Date();
  let [h, m] = heure.split(":").map(Number);
  let rappel = new Date();
  rappel.setHours(h, m, 0, 0);
  let diff = rappel - maintenant;

  if (diff > 0) {
    setTimeout(function() {
      afficherAlarme(texte, heure);
    }, diff);
  }
}

function afficherAlarme(texte, heure) {
  let overlay = document.createElement("div");
  overlay.id = "alarme-overlay";
  overlay.style.cssText = 
    "position:fixed; top:0; left:0; width:100%; height:100%;" +
    "background:rgba(0,0,0,0.95); z-index:9999;" +
    "display:flex; flex-direction:column;" +
    "align-items:center; justify-content:center; text-align:center;" +
    "padding:20px;";

  let compte = 30;
  
  overlay.innerHTML = 
    "<div style='font-size:70px; animation: pulse 1s infinite;'>⏰</div>" +
    "<h2 style='color:#ff4444; font-size:28px; margin:10px;'>⚠️ RAPPEL !</h2>" +
    "<div style='color:white; font-size:20px; margin:15px; padding:20px;" +
    "background:#1a1a1a; border:2px solid purple; border-radius:12px; width:90%;'>" +
    "🔔 " + texte + "</div>" +
    "<p style='color:orange; font-size:18px;'>🕐 Heure : " + heure + "</p>" +
    "<p id='compte-rebours' style='color:#aaa; font-size:15px;'>" +
    "Fermeture automatique dans 30s</p>" +
    "<div style='display:flex; gap:15px; margin-top:20px;'>" +
    "<button onclick='fermerAlarme()' " +
    "style='background:#333; color:white; border:2px solid red;" +
    "padding:15px 25px; border-radius:12px; font-size:16px; cursor:pointer;'>" +
    "📵 Ignorer</button>" +
    "<button onclick='fermerAlarme()' " +
    "style='background:purple; color:white; border:none;" +
    "padding:15px 25px; border-radius:12px; font-size:16px; cursor:pointer;'>" +
    "✅ Compris !</button>" +
    "</div>";

  document.body.appendChild(overlay);

  let contexte = new (window.AudioContext || 
  window.webkitAudioContext)();
  
  let sonnerie = setInterval(function() {
    jouerSon(contexte);
  }, 800);

  let rebours = setInterval(function() {
    compte--;
    let el = document.getElementById("compte-rebours");
    if (el) el.innerHTML = 
      "Fermeture automatique dans " + compte + "s";
    if (compte <= 0) {
      clearInterval(sonnerie);
      clearInterval(rebours);
      fermerAlarme();
    }
  }, 1000);

  window._sonnerie = sonnerie;
  window._rebours = rebours;
}

function fermerAlarme() {
  clearInterval(window._sonnerie);
  clearInterval(window._rebours);
  let overlay = document.getElementById("alarme-overlay");
  if (overlay) overlay.remove();
}

charger();
