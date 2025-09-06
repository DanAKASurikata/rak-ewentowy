let liczbaLinii = 2;


let trate;
let kierunek;
let seznamLinii = document.getElementById("trasy");
let moznost = document.createElement("option");
let szlakyWj = [];
let hashe = [];
let szlakyWyj = [];
let selectedTrat;
let poczatkowaList = document.getElementById("poczatkowa");
let koncowaList = document.getElementById("koncowa");

function startAlert() {
    alert("Witam na sesji!\nJeśli trasa nie wyświetla się, proszę załaduj stronę ponownie, jest to znany błąd systemu\n\nVítej na sesji!\nJestli se nezobrazuje žádná trasa, načti znovu stranu, je to známá chyba")
}

function updateTrati() {
    for (let i = 0; i < liczbaLinii; i++) {
        fetch(`./trat${i + 1}.json`)
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem(`trat${i + 1}`, JSON.stringify(data));
            })
    }
}

function readTrati() {
    let vysledek = [];
    for (let i = 0; i < liczbaLinii; i++) {
        vysledek[i] = JSON.parse(sessionStorage.getItem(`trat${i + 1}`));
    }
    trate = vysledek;
    selectedTrat = document.getElementById("trasy").selectedIndex - 1;
    return vysledek;
}

function reloadJSON() {
    updateTrati();
    readTrati();

    while (koncowaList.options.length > 1) {
        koncowaList.remove(1);
    }

    for (let i = 0; i < liczbaLinii; i++) {
        moznost = document.createElement("option");
        moznost.text = trate[i].name;
        seznamLinii.add(moznost);
    }
}

reloadJSON();

function darkmodeToggle() {
    if (document.getElementById("darkmode").checked == true) {
        document.body.style.backgroundColor = "rgb(15, 15, 15)";
        document.body.style.color = "white";
    } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
    }
}

function reloadStacje() {
    readTrati();

    const tratVybrana = trate[selectedTrat];

    while (poczatkowaList.options.length > 0) {
        poczatkowaList.remove(0);
    }
    while (koncowaList.options.length > 0) {
        koncowaList.remove(0);
    }

    for (let i = 0; i < trate[selectedTrat].pocetStanic; i++) {
        let moznost = document.createElement("option");
        moznost.text = tratVybrana.trasa[i].Nazwa;
        poczatkowaList.add(moznost);

        moznost = document.createElement("option");
        moznost.text = tratVybrana.trasa[i].Nazwa;
        koncowaList.add(moznost);
    }
}

function generuj() {
    readTrati();

    let trzesc = "";
    let smer;

    let stanice = trate[selectedTrat].trasa;

    const cislo = document.getElementById("cislo").value;
    if (selectedTrat == -1) {
        alert("Wybierz linię!\nVyber trať!");
        return
    }
    if (cislo == '') {
        alert("Ustaw numer!\nZadej číslo!");
        return
    }

    let poczatekStacja = document.getElementById("poczatkowa").selectedIndex;
    let konecStacja = document.getElementById("koncowa").selectedIndex;

    if (poczatekStacja == konecStacja) {
        alert("Jesteś gumoń!\nJsi blbec!")
        return
    } else if (poczatekStacja < konecStacja) {
        smer = 0;
    } else if (poczatekStacja > konecStacja) {
        smer = 1;
    }

    if (smer == 0) {
        for (i = poczatekStacja; i < konecStacja + 1; i++) {
            trzesc = trzesc + `${stanice[i].SzlakWj},${stanice[i].Nazwa} ${stanice[i].hash}.sc,${stanice[i].SzlakWyj};`;
        }
    } else if (smer = 1) {
        for (i = poczatekStacja; i > konecStacja - 1; i--) {
            trzesc = trzesc + `${stanice[i].SzlakWyj},${stanice[i].Nazwa} ${stanice[i].hash}.sc,${stanice[i].SzlakWj};`;
        }
    }

    document.getElementById("vysledek").value = `/tt ${cislo} ${trzesc}`;
    szlakyWj = null;
    szlakyWyj = null;
    stacje = null;
    hashe = null;
}