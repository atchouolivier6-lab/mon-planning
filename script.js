import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQFy-zmbqyU4Iqg8w2b1ZBQpAiOx4xcQo",
  authDomain: "mc-planning.firebaseapp.com",
  projectId: "mc-planning",
  storageBucket: "mc-planning.firebasestorage.app",
  messagingSenderId: "639544023561",
  appId: "1:639544023561:web:fce31683ddee0a2a8db6d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const tousLesJours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
let utilisateurActuel = null;
let rappelsActifs = [];

function afficherPage(id) {
  document.querySelectorAll(".page").forEach(function(p) {
    p.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function afficherConnexion() {
  document.getElementById("form-connexion").classList.add("active");
  document.getElementById("form-inscription").classList.remove("active");
}

function afficherInscription() {
  document.getElementById("form-inscription").classList.add("active");
  document.getElementById("form-connexion").classList.remove("active");
}

window.afficherConnexion = afficherConnexion;
window.afficherInscription = afficherInscription;

function sInscrire() {
  let nom = document.getElementById("reg-nom").value.trim();
  let email = document.getElementById("reg-email").value.trim();
  let mdp = document.getElementById("reg-mdp").value;
  let mdp2 = document.getElementById("reg-mdp2").value;

  if (!nom) { alert("Veuillez entrer votre nom."); return; }
  if (!email) { alert("Veuillez entrer votre email."); return; }
  if (mdp.length < 6) { alert("Le mot de passe doit avoir au moins 6 caracteres."); return; }
  if (mdp !== mdp2) { alert("Les mots de passe ne correspondent pas."); return; }

  createUserWithEmailAndPassword(auth, email, mdp)
    .then(function(resultat) {
      return updateProfile(resultat.user, { displayName: nom });
    })
    .then(function() {
      alert("Compte cree avec succes ! Bienvenue !");
    })
    .catch(function(erreur) {
      if (erreur.code === "auth/email-already-in-use") {
        alert("Cet email est deja utilise.");
      } else if (erreur.code === "auth/invalid-email") {
        alert("Adresse email invalide.");
      } else {
        alert("Erreur : " + erreur.message);
      }
    });
}

window.sInscrire = sInscrire;

function seConnecter() {
  let email = document.getElementById("login-email").value.trim();
  let mdp = document.getElementById("login-mdp").value;

  if (!email) { alert("Veuillez entrer votre email."); return; }
  if (!mdp) { alert("Veuillez entrer votre mot de passe."); return; }

  signInWithEmailAndPassword(auth, email, mdp)
    .catch(function(erreur) {
      if (erreur.code === "auth/user-not-found") {
        alert("Aucun compte trouve avec cet email.");
      } else if (erreur.code === "auth/wrong-password") {
        alert("Mot de passe incorrect.");
      } else if (erreur.code === "auth/invalid-credential") {
        alert("Email ou mot de passe incorrect.");
      } else {
        alert("Erreur : " + erreur.message);
      }
    });
}

window.seConnecter = seConnecter;

function reinitialiserMdp() {
  let email = document.getElementById("login-email").value.trim();
  if (!email) {
    alert("Entrez votre email dans le champ email d'abord.");
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(function() {
      alert("Email de reinitialisation envoye a " + email);
    })
    .catch(function(erreur) {
      alert("Erreur : " + erreur.message);
    });
}

window.reinitialiserMdp = reinitialiserMdp;

function seDeconnecter() {
  if (confirm("Voulez-vous vraiment vous deconnecter ?")) {
    rappelsActifs.forEach(function(id) { clearTimeout(id); });
    rappelsActifs = [];
    tousLesJours.forEach(function(jour) {
      let liste = document.getElementById("liste" + jour);
      if (liste) liste.innerHTML = "";
    });
    signOut(auth);
  }
}

window.seDeconnecter = seDeconnecter;

function ouvrirMenu() {
  document.getElementById("menu-lateral").classList.add("active");
  document.getElementById("menu-overlay").classList.add("active");
}

function fermerMenu() {
  document.getElementById("menu-lateral").classList.remove("active");
  document.getElementById("menu-overlay").classList.remove("active");
}

function allerAccueil() {
  document.querySelectorAll(".sous-page").forEach(function(p) {
    p.style.display = "none";
  });
  document.getElementById("contenu-principal").style.display = "block";
  document.querySelector("footer").style.display = "block";
}

function ouvrirApropos() {
  document.getElementById("contenu-principal").style.display = "none";
  document.querySelector("footer").style.display = "none";
  document.getElementById("page-apropos").style.display = "block";
  document.getElementById("page-createur").style.display = "none";
  window.scrollTo(0, 0);
}

function ouvrirCreateur() {
  document.getElementById("contenu-principal").style.display = "none";
  document.querySelector("footer").style.display = "none";
  document.getElementById("page-createur").style.display = "block";
  document.getElementById("page-apropos").style.display = "none";
  window.scrollTo(0, 0);
}

function retourPlanning() {
  allerAccueil();
}

window.ouvrirMenu = ouvrirMenu;
window.fermerMenu = fermerMenu;
window.allerAccueil = allerAccueil;
window.ouvrirApropos = ouvrirApropos;
window.ouvrirCreateur = ouvrirCreateur;
window.retourPlanning = retourPlanning;

onAuthStateChanged(auth, function(user) {
  if (user) {
    utilisateurActuel = user;
    let nom = user.displayName || user.email;
    document.getElementById("user-nom").innerHTML = "Bonjour, " + nom;
    afficherPage("page-planning");
    chargerTaches();
    demarrerHorloge();
  } else {
    utilisateurActuel = null;
    afficherPage("page-auth");
  }
});

function demarrerHorloge() {
  function majHeure() {
    let maintenant = new Date();
    let jours = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    let jour = jours[maintenant.getDay()];
    let date = maintenant.getDate();
    let mois = maintenant.getMonth() + 1;
    let annee = maintenant.getFullYear();
    let heures = maintenant.getHours();
    let minutes = maintenant.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    let el = document.getElementById("dateHeure");
    if (el) el.innerHTML = jour + " " + date + "/" + mois + "/" + annee + " - " + heures + "h" + minutes;
  }
  majHeure();
  setInterval(majHeure, 1000);
}

function mettreAJourCompteur(jour) {
  let liste = document.getElementById("liste" + jour);
  let compteur = document.getElementById("compteur-" + jour);
  let vide = document.getElementById("vide-" + jour);
  if (liste && compteur) {
    let nb = liste.querySelectorAll("li").length;
    compteur.innerHTML = nb;
    if (vide) vide.style.display = nb === 0 ? "block" : "none";
  }
}

function chargerTaches() {
  if (!utilisateurActuel) return;
  let tachesRef = ref(db, "users/" + utilisateurActuel.uid + "/taches");
  onValue(tachesRef, function(snapshot) {
    tousLesJours.forEach(function(jour) {
      let liste = document.getElementById("liste" + jour);
      if (liste) liste.innerHTML = "";
    });
    rappelsActifs.forEach(function(id) { clearTimeout(id); });
    rappelsActifs = [];
    let data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(function(key) {
        let t = data[key];
        afficherTache(t.jour, t.texte, t.heure, t.barre, key);
        if (t.heure && !t.barre) {
          programmerRappel(t.texte, t.heure);
        }
      });
    }
    tousLesJours.forEach(function(jour) {
      mettreAJourCompteur(jour);
    });
  });
}

function afficherTache(jour, texte, heure, barre, key) {
  let liste = document.getElementById("liste" + jour);
  if (!liste) return;
  let li = document.createElement("li");
  let heureAffichee = heure ? heure : "";
  li.innerHTML =
    "<span class='tache-heure'>" + heureAffichee + "</span>" +
    "<span class='tache-texte" + (barre ? " barre" : "") + "' onclick='basculerBarre(\"" + key + "\", this)'>" + texte + "</span>" +
    "<span class='supprimer' onclick='supprimerTache(\"" + key + "\", \"" + jour + "\")'>X</span>";
  liste.appendChild(li);
}

function ajouterTache() {
  if (!utilisateurActuel) return;
  let texte = document.getElementById("tache").value.trim();
  let heure = document.getElementById("heureTache").value;
  let jour = document.getElementById("jourChoisi").value;

  if (!texte) { alert("Ecrivez une tache d'abord !"); return; }

  let tachesRef = ref(db, "users/" + utilisateurActuel.uid + "/taches");
  push(tachesRef, {
    texte: texte,
    heure: heure,
    jour: jour,
    barre: false,
    date: new Date().toLocaleDateString("fr-FR")
  }).then(function() {
    document.getElementById("tache").value = "";
    document.getElementById("heureTache").value = "";
    if (heure) programmerRappel(texte, heure);
  });
}

window.ajouterTache = ajouterTache;

function basculerBarre(key, el) {
  if (!utilisateurActuel) return;
  let estBarre = el.classList.contains("barre");
  let tacheRef = ref(db, "users/" + utilisateurActuel.uid + "/taches/" + key);
  update(tacheRef, {barre: !estBarre});
}

window.basculerBarre = basculerBarre;

function supprimerTache(key, jour) {
  if (!utilisateurActuel) return;
  let tacheRef = ref(db, "users/" + utilisateurActuel.uid + "/taches/" + key);
  remove(tacheRef).then(function() {
    mettreAJourCompteur(jour);
  });
}

window.supprimerTache = supprimerTache;

function afficherJour() {
  let jours = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  let aujourdhui = jours[new Date().getDay()];
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) carte.style.display = (jour === aujourdhui) ? "block" : "none";
  });
}

window.afficherJour = afficherJour;

function afficherSemaine() {
  tousLesJours.forEach(function(jour) {
    let carte = document.getElementById("carte-" + jour);
    if (carte) carte.style.display = "block";
  });
}

window.afficherSemaine = afficherSemaine;

function jouerMelodie(contexte) {
  let notes = [
    {freq: 523, duree: 0.2},
    {freq: 659, duree: 0.2},
    {freq: 784, duree: 0.2},
    {freq: 1047, duree: 0.3},
    {freq: 784, duree: 0.2},
    {freq: 659, duree: 0.2},
    {freq: 523, duree: 0.4}
  ];
  let tempsActuel = contexte.currentTime;
  notes.forEach(function(note) {
    let oscillateur = contexte.createOscillator();
    let gain = contexte.createGain();
    oscillateur.connect(gain);
    gain.connect(contexte.destination);
    oscillateur.frequency.value = note.freq;
    oscillateur.type = "sine";
    gain.gain.setValueAtTime(0.5, tempsActuel);
    gain.gain.exponentialRampToValueAtTime(0.001, tempsActuel + note.duree);
    oscillateur.start(tempsActuel);
    oscillateur.stop(tempsActuel + note.duree);
    tempsActuel += note.duree + 0.05;
  });
}

function programmerRappel(texte, heure) {
  let maintenant = new Date();
  let parties = heure.split(":");
  let h = parseInt(parties[0]);
  let m = parseInt(parties[1]);
  let rappel = new Date();
  rappel.setHours(h, m, 0, 0);
  let diff = rappel - maintenant;
  if (diff > 0) {
    let id = setTimeout(function() {
      afficherAlarme(texte, heure);
    }, diff);
    rappelsActifs.push(id);
  }
}

function afficherAlarme(texte, heure) {
  let overlay = document.getElementById("alarme-overlay");
  overlay.style.display = "flex";
  let compte = 30;

  overlay.innerHTML =
    "<div class='alarme-titre'>RAPPEL !</div>" +
    "<div class='alarme-message'>Il est l'heure d'accomplir votre tache, levez-vous maintenant !</div>" +
    "<div class='alarme-tache'>" + texte + "</div>" +
    "<div class='alarme-heure'>Heure : " + heure + "</div>" +
    "<div class='alarme-compte' id='alarme-compte'>Fermeture dans 30s</div>" +
    "<div class='alarme-btns'>" +
    "<button class='btn-ignorer' onclick='fermerAlarme()'>Ignorer</button>" +
    "<button class='btn-compris' onclick='fermerAlarme()'>Compris !</button>" +
    "</div>";

  let contexte = new (window.AudioContext || window.webkitAudioContext)();
  jouerMelodie(contexte);

  let sonnerie = setInterval(function() {
    jouerMelodie(contexte);
  }, 2500);

  let rebours = setInterval(function() {
    compte--;
    let el = document.getElementById("alarme-compte");
    if (el) el.innerHTML = "Fermeture dans " + compte + "s";
    if (compte <= 0) {
      clearInterval(sonnerie);
      clearInterval(rebours);
      fermerAlarme();
    }
  }, 1000);

  window._sonnerie = sonnerie;
  window._rebours = rebours;
  window._contexteAudio = contexte;
}

function fermerAlarme() {
  clearInterval(window._sonnerie);
  clearInterval(window._rebours);
  if (window._contexteAudio) {
    window._contexteAudio.close();
    window._contexteAudio = null;
  }
  let overlay = document.getElementById("alarme-overlay");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}

window.fermerAlarme = fermerAlarme;
