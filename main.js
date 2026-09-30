
const imgCaseCache = "./images/caseCache.png";
const imgCaseVide = "./images/caseVide.png";
const imgCaseDrapeau = "./images/drapeau.png";
const imgCaseMine = "./images/mine.png";
const imgCaseMineExplose = "./images/mineExplose.png";
const imgCaseNombre = "./images/nombre";
const imgVictoire = "./images/victoire.gif";
const imgDefaite = "./images/defaite.png";

var maGrilleJeu;

function genererNombreEntier(max) {

    let nombreAleatoire = Math.floor(Math.random() * Math.floor(max));
    //console.log("genererNombreEntier - Nombre générer : " + nombreAleatoire);
    return nombreAleatoire;
}

class CaseJeu {

    constructor(coordLigne, coordColonne, laGrilleJeu) {
        this.coordLigne = coordLigne;
        this.coordColonne = coordColonne;
        this.nombreBombesAutour = 0;

        this.estCache = true;
        this.estBombe = false;
        this.estDrapeau = false;
        this.laGrilleJeu = laGrilleJeu;
    }

    montreCase(click) {
        let idCase = this.coordLigne + ';' + this.coordColonne;

        if (this.estCache === true) {
            this.estCache = false;
            if (this.estBombe == true) {
                document.getElementById(idCase).setAttribute('src', imgCaseMine);
            }
            else if (this.nombreBombesAutour == 0) {
                document.getElementById(idCase).setAttribute('src', imgCaseVide);
            }
            else {
                document.getElementById(idCase).setAttribute('src', imgCaseNombre + this.nombreBombesAutour + '.png');
            }

            if ((this.nombreBombesAutour == 0) && (click == true)) {
                for (let ii = this.coordLigne - 1 ; ii <= this.coordLigne + 1 ; ii++) {
                    for (let ij = this.coordColonne - 1 ; ij <= this.coordColonne + 1 ; ij++) {

                        let idCaseAutour = ii + ";" + ij;

                        if ((ii >= 0) && (ij >= 0)
                        && (ii < this.laGrilleJeu.nombreLignes)
                        && (ij < this.laGrilleJeu.nombreColonnes)) {

                            let caseJeu = this.laGrilleJeu.grilleJeu.get(idCaseAutour);

                            if (idCaseAutour != idCase) {
                                caseJeu.montreCase(click);
                            }
                        }
                    }
                }
            }
        }
    }

    compteBombesAutour() {
        let compteur = 0;
        let idCase = this.coordLigne + ';' + this.coordColonne;

        for (let ii = this.coordLigne - 1 ; ii <= this.coordLigne + 1 ; ii++) {
            for (let ij = this.coordColonne - 1 ; ij <= this.coordColonne + 1 ; ij++) {
                let idCaseAutour = ii + ";" + ij;

                let caseJeu = this.laGrilleJeu.grilleJeu.get(idCaseAutour);

                if ((caseJeu != undefined) && (idCase != idCaseAutour)) {
                    if (caseJeu.estBombe == true) {
                        compteur++;
                    }
                }
            }
        }

        this.nombreBombesAutour = compteur;
    }

    aUnCinqAutour() {
        let resultat = false;
        let idCase = this.coordLigne + ';' + this.coordColonne;

        for (let ii = this.coordLigne - 1 ; ii <= this.coordLigne + 1 ; ii++) {
            for (let ij = this.coordColonne - 1 ; ij <= this.coordColonne + 1 ; ij++) {
                let idCaseAutour = ii + ";" + ij;

                let caseJeu = this.laGrilleJeu.grilleJeu.get(idCaseAutour);

                if ((caseJeu != undefined) && (idCase != idCaseAutour)) {
                    if (caseJeu.nombreBombesAutour == 5) {
                        resultat = true;
                    }
                }
            }
        }

        return resultat;
    }
}

function clicBoutonG(event) {
    event.preventDefault();
    let idCase = event.target.id;

    try {
        let caseJeu = maGrilleJeu.grilleJeu.get(idCase);

        console.log(caseJeu);

        if (caseJeu != undefined) {
            if ((caseJeu.estCache == true) && (caseJeu.estDrapeau == false)) {
                if (caseJeu.estBombe == true) {
                    caseJeu.estCache = false;
                    document.getElementById(idCase).setAttribute('src', imgCaseMineExplose);
                    document.getElementById("imageResultat").setAttribute('src', imgDefaite);
                    document.getElementById("resultat").style.display = "block";
                    clearInterval(maGrilleJeu.timer);
                    maGrilleJeu.perdre();
                }
                else {
                    caseJeu.montreCase(true);
                    if (maGrilleJeu.estGagne() == true) {
                        document.getElementById("imageResultat").setAttribute('src', imgVictoire);
                        document.getElementById("resultat").style.display = "block";
                    }
                }

            }
            else {
                addLog("non caché");
            }
        }
        else {
            addLog("bug undifined !");
        }
    }
    catch (error) {
        addLog(error.message)
    }
}


function clicBoutonD(event) {
    event.preventDefault();
    let idCase = event.target.id;

    try {
        let caseJeu = maGrilleJeu.grilleJeu.get(idCase);

        console.log(caseJeu);

        if (caseJeu != undefined) {
            if (caseJeu.estCache === true) {
                if (caseJeu.estDrapeau) {
                    caseJeu.estDrapeau = false;
                    maGrilleJeu.nombreDrapeaux--;
                    document.getElementById(idCase).setAttribute('src', imgCaseCache);
                    document.getElementById("nombreBombesRestantes").textContent = maGrilleJeu.compteBombesRestantes();
                }
                else {
                    caseJeu.estDrapeau = true;
                    maGrilleJeu.nombreDrapeaux++;
                    document.getElementById(idCase).setAttribute('src', imgCaseDrapeau);
                    document.getElementById("nombreBombesRestantes").textContent = maGrilleJeu.compteBombesRestantes();
                }

                if (maGrilleJeu.estGagne() == true) {
                    document.getElementById("imageResultat").setAttribute('src', imgVictoire);
                    document.getElementById("resultat").style.display = "block";
                }
            }
            else {
                addLog("non caché");
            }
        }
        else {
            addLog("bug undifined !");
        }
    } catch (error) {
        addLog(error.message)
    }
}


function addLog(text) {
    let newLog = document.createElement('p');

    newLog.textContent = text;
    let divLog = document.querySelector('.log');
    divLog.prepend(newLog);
}

function rafraichitTemps() {
    maGrilleJeu.temps++;

    let minutes = Math.floor(maGrilleJeu.temps / 60);
    let secondes = '0' + (maGrilleJeu.temps % 60);

    let affichageTemps = document.getElementById("chrono");

    affichageTemps.textContent = minutes + ":" + secondes.slice(secondes.length - 2, secondes.length);
};

class GrilleJeu {

    constructor() {
        this.nombreLignes = 0;
        this.nombreColonnes = 0;
        this.nombreBombes = 0;
        this.nombreDrapeaux = 0;
        this.grilleJeu = new Map();
        this.timer = 0;
        this.temps = 0;
        this.estFini = true;
    }
    
    InitialiserGrille(nombreLignes, nombreColonnes, nombreBombes) {
        this.nombreLignes = nombreLignes;
        this.nombreColonnes = nombreColonnes;
        this.nombreBombes = nombreBombes;
        this.nombreDrapeaux = 0;
        this.temps = 0;

        if (this.timer != 0) {
            clearInterval(this.timer);
            this.timer = 0;
        };

        let grilleJeu = document.getElementById('grilleJeu');
        grilleJeu.innerHTML = "";
        document.getElementById("resultat").style.display = "none";

        this.grilleJeu.clear();

        for (let ii = 0 ; ii < nombreLignes ; ii++) {
            let ligneJeu = document.createElement('div');
            let jeu = document.getElementById('jeu');
            
            ligneJeu.setAttribute('class', 'ligneJeu');
            jeu.setAttribute('width', nombreColonnes * 32 + "px");

            grilleJeu.append(ligneJeu);

            for (let ij = 0 ; ij < nombreColonnes ; ij++) {
                let caseJeu = new CaseJeu(ii, ij, this);
                let idCase = ii + ";" + ij;

                let imageCase = document.createElement("img");
                imageCase.id = idCase;
                imageCase.setAttribute('src', "./images/caseCache.png");

                imageCase.addEventListener('click', event => clicBoutonG(event));
                imageCase.addEventListener('contextmenu', event => clicBoutonD(event));

                ligneJeu.append(imageCase);

                this.grilleJeu.set(idCase, caseJeu);
            }
        }

        if (this.nombreBombes > (this.nombreLignes * this.nombreColonnes)/ 4) {
            addLog("Trop de bombes sur la grille : " + this.nombreBombes)
        }
        else {
            while (nombreBombes > 0) {
                let bombeLigne = genererNombreEntier(this.nombreLignes);
                let bombeColonne = genererNombreEntier(this.nombreColonnes);

                let caseBombe = this.grilleJeu.get(bombeLigne + ";" + bombeColonne);

                if ((caseBombe.estBombe == false) && (caseBombe.aUnCinqAutour() == false)) {
                    caseBombe.estBombe = true;
                    nombreBombes--;
                    this.compteNombreBombesGrille();
                }
            }

        }
        this.compteNombreBombesGrille();

        this.timer = setInterval(rafraichitTemps, 1000);
        this.estFini = false;
    }

    compteNombreBombesGrille() {
        this.grilleJeu.forEach((caseJeu, key) => {
            caseJeu.compteBombesAutour();
        })
    }
    
    montreTout() {
        this.grilleJeu.forEach((caseJeu, key) => {
            if (caseJeu.estCache == true) {
                caseJeu.montreCase(false);
            }
        })
    }

    compteBombesRestantes() {
        return this.nombreBombes - this.nombreDrapeaux;
    }

    compteNombreCasesRestantesGrille() {
        let nombreCasesRestantes = 0;
        this.grilleJeu.forEach((caseJeu, key) => {
            if ((caseJeu.estCache == true) && (caseJeu.estDrapeau == false)) {
                nombreCasesRestantes++;
            };
        })

        return nombreCasesRestantes;
    }

    estGagne() {
        let nombreBombesRestantes = this.nombreBombes - this.nombreDrapeaux;
        
        if (this.compteNombreCasesRestantesGrille() == nombreBombesRestantes) {
            clearInterval(this.timer);
            this.timer = 0;
            this.estFini = true;
            return true;
        }
        else {
            return false;
        }
    }

    perdre() {
        this.montreTout();
        this.estFini = true;
        clearInterval(this.timer);
        this.timer = 0;
    }
}

function choixNiveau(event) {
    let niveau = document.getElementById(event.target.id);
    let personnalise = document.getElementById("personnalise");

    //addLog(niveau.selectedIndex);
    if (niveau.selectedIndex == 3) {
        personnalise.style.display = "block";
    }
    else {
        personnalise.style.display = "none";
    }
}

function lanceJeu() {
    let niveau = document.getElementById("niveau");
    let idNiveau = niveau.selectedIndex;

    switch (idNiveau) {
        case 0:
            maGrilleJeu.InitialiserGrille(5, 10, 5);
            break;
        case 1:
            maGrilleJeu.InitialiserGrille(10, 20, 20);
            break;
        case 2:
            maGrilleJeu.InitialiserGrille(20, 40, 80);
            break;
        case 3:
            const nbLignes = document.getElementById("tailleLigne").value;
            const nbColonnes = document.getElementById("tailleColonne").value;
            const nbBombes = document.getElementById("nombreBombes").value;

            maGrilleJeu.InitialiserGrille(nbLignes, nbColonnes, nbBombes);
            break;
        default:
            addLog("choix inexistant : " + idNiveau)
            break;
    }
}

maGrilleJeu = new GrilleJeu();
let niveau = document.getElementById("niveau");
let btnJouer = document.getElementById("btnJouer");

niveau.addEventListener('change', event => choixNiveau(event));
btnJouer.addEventListener('click', lanceJeu);

//console.log(maGrilleJeu);

