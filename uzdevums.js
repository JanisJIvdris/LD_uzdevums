

// 1. jautajums 
//SQL shēma

// Trains (vilciena sastavs) - tiek glabāta informacija par katru a vilcienu, tā nummuru, attiešanas laiku un staciju, kā arī pienākšanas staciju.

CREATE TABLE Trains (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) UNIQUE NOT NULL,
    departure_time DATETIME NOT NULL,
    departure_station VARCHAR(100) NOT NULL,
    arrival_station VARCHAR(100) NOT NULL
);

//Carriages(vagoni) - glabā informāciju par katru vagonu, tā nummuru, tiek sasaistīts ar vilciena id
CREATE TABLE Carriages (
    carriage_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    carriage_number CHAR(8) UNIQUE NOT NULL,
    serial_number INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES Trains(train_id)
);

// Containers(koneteineri) - glaba informaciju par konteineru, sasaista konteineru ar konkrētu cagonu
CREATE TABLE Containers (
    container_id INT AUTO_INCREMENT PRIMARY KEY,
    carriage_id INT NOT NULL,
    container_number CHAR(9) UNIQUE NOT NULL,
    FOREIGN KEY (carriage_id) REFERENCES Carriages(carriage_id)
);

//CargoTypes(kravasveids)- glaba kravas kodu un svaru

CREATE TABLE CargoTypes (
    cargo_type_id INT AUTO_INCREMENT PRIMARY KEY,
    cargo_code CHAR(5) UNIQUE NOT NULL,
    weight DECIMAL(10, 2) NOT NULL
);

//ContainerCargo(konteineru krava) - izveido many-to-many attiecību starp konteineriem un kravas veidiem, jo katrs konteiners var pārvadāt vairākus kravas veidus

CREATE TABLE ContainerCargo (
    container_cargo_id INT AUTO_INCREMENT PRIMARY KEY,
    container_id INT NOT NULL,
    cargo_type_id INT NOT NULL,
    FOREIGN KEY (container_id) REFERENCES Containers(container_id),
    FOREIGN KEY (cargo_type_id) REFERENCES CargoTypes(cargo_type_id)
);




//2.jautājums


SELECT
    V.MODEL,    //atlasa vagona modeli no 'VAGON' tabulas
    VO.KOD_SOB, // atlasa īpašnieka kodu, no 'VAG_OPER' tabulas.
    COUNT(VO.NOM_VAG) AS number_of_wagons,   // tiek saskaitīts kopējais vagonu skaits
    SUM(CASE WHEN VO.PR_SOB = '1' THEN 1 ELSE 0 END) AS number_of_private_wagons, //tiek skaitīti privātie vagoni
    SUM(CASE WHEN VO.PPV_GRUJ = '0' THEN 1 ELSE 0 END) AS number_of_empty_wagons  // tiek skaitīti tukšie vagoni
FROM
    VAG_OPER VO // tiek izmantots alias lai saiīsinātu tabulas nosaukumu no VAG_OPER uz VO un vaicājumu padarītu pārskatāmāku
JOIN
    VAGON V ON VO.NOM_VAG = V.NOM_VAG // aliasētā VAGON tabula, tiek apvienota NOM_VAG kolonnā
WHERE
    VO.ROD_VAG_OSN LIKE '5%' //tiek atlasīti vagoni kur ROD_VAG_OSN sākās ar '5'
    AND VO.DOR_DIS = 9 // tiek atlasīti vagoni kur DOR_DIS ir 9
GROUP BY
    V.MODEL, //rezultāti tiek grupēti pēc  MODEL
    VO.KOD_SOB; //rezultāti tiek grupēti pēc  KOD_SOB



//3.jautajums

// Jautājuma aprēkinasanai izveidoju javascript funkciju

function calculateFillingTime() {

    // Uzpildes ātrumi(stundā)
    const hotTapRate = 1 / 3;
    const coldTapRate = 1 / 6;

    // kopējais uzpildes atrums kad visi krāni ir atgriezti
    // 1 baseins/stundā no karstajiem + 1/2 baseina/stundā  no akstajiem = 1.5 baseins/stundāž
    const totalRate = 3 * hotTapRate + 3 * coldTapRate; 

    // Viena baseina uzpildes laiks
    // 1 baseins / 1.5 baseins/stundā = 2/3 stundas, jeb 40min
    const timeToFillPool = 1 / totalRate; 

    // stundas tiek parvērstas minūtēs
    // 2/3 stundas * 60 minūtes = 40 minutes
    const timeToFillPoolInMinutes = timeToFillPool * 60; 
    //tiek atgriezts rezultāts
    return timeToFillPoolInMinutes; 
}

// tiek izprintēts rezultats
console.log(`Laiks kas nepieciesams lai uzpilditu baseinu, izmantojot visus kranus: ${calculateFillingTime()} minutes`);
