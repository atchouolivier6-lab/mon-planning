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
  let maintenant = new Date();
  let [h, m] = heure.split(":").map(Number);
  let rappel = new Date();
  rappel.setHours(h, m, 0, 0);

  let diff = rappel - maintenant;

  if (diff > 0) {
    setTimeout(function() {
      jouerSon();
      alert("⏰ Il est l'heure ! \n\n" + texte);
    }, diff);
  }
}

function jouerSon() {
  let contexte = new (window.AudioContext || window.webkitAudioContext)();
  let oscillateur = contexte.createOscillator();
  let gain = contexte.createGain();
  
  oscillateur.connect(gain);
  gain.connect(contexte.destination);
  
  oscillateur.frequency.value = 880;
  oscillateur.type = "sine";
  gain.gain.setValueAtTime(1, contexte.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, contexte.currentTime + 1.5);
  
  oscillateur.start(contexte.currentTime);
  oscillateur.stop(contexte.currentTime + 1.5);
}
function basculerBarre(element) {
  if (element.style.textDecoration === "line-through") {
    element.style.textDecoration = "none";
  } else {
    element.style.textDecoration = "line-through";
  }
  sauvegarder();
}
