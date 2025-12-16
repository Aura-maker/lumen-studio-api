// Contenuti completi di ⚛️ Fisica per ImparaFacile
module.exports = {
  materia: {
    nome: "⚛️ Fisica",
    descrizione: "Fisica classica e moderna per il quinto anno",
    colore: "#9013FE",
    annoScolastico: [
      "4",
      "5"
    ]
  },
  argomenti: [
    {
      titolo: "Magnetismo ed Elettromagnetismo",
      annoRiferimento: "5",
      descrizione: "Campi magnetici, forze e induzione elettromagnetica",
      sottoargomenti: [
        {
          titolo: "Campo magnetico e forza di Lorentz",
          riassunto: "Il campo magnetico rappresenta una delle forze fondamentali della natura e si manifesta intorno a magneti permanenti o a conduttori percorsi da corrente elettrica.. A differenza del campo elettrico che agisce su cariche ferme, il campo magnetico B esercita forza solo su cariche in movimento.. L'unità di misura del campo magnetico è il Tesla (T) nel Sistema Internazionale.. La forza di Lorentz descrive matematicamente l'azione del campo magnetico su una carica in movimento: F = qvB sin θ, dove q è la carica elettrica, v la velocità della particella, B l'intensità del campo magnetico e θ l'angolo tra velocità e campo.. Questa forza è sempre perpendicolare sia alla velocità che al campo magnetico, come indicato dalla regola della mano destra: se il pollice indica la velocità, l'indice il campo, il medio indica la forza (per cariche positive).. Una conseguenza fondamentale è che il campo magnetico non compie lavoro sulla particella poiché la forza è sempre perpendicolare allo spostamento.. Quando una particella carica entra in un campo magnetico uniforme con velocità perpendicolare alle linee di campo, essa descrive una traiettoria circolare.. Il raggio di questa circonferenza si calcola uguagliando la forza di Lorentz alla forza centripeta: qvB = mv²/r, da cui r = mv/(qB).. Questo principio è utilizzato negli spettrometri di massa per separare isotopi e nei ciclotoni per accelerare particelle.. Il campo magnetico generato da un filo rettilineo percorso da corrente I è dato dalla legge di Biot-Savart: B = μ₀I/(2πr), dove μ₀ = 4π×10⁻⁷ T·m/A è la permeabilità magnetica del vuoto e r la distanza dal filo.. Le linee di campo sono circonferenze concentriche al filo.. Per una spira circolare di raggio R, il campo al centro vale B = μ₀I/(2R).. In un solenoide (bobina cilindrica di N spire su lunghezza L), il campo all'interno è uniforme e vale B = μ₀nI dove n = N/L è il numero di spire per unità di lunghezza.. Questo risultato è fondamentale per elettromagneti e trasformatori",
          livelloDifficolta: "intermedio",
          tempoLettura: 5,
          tags: [
            "magnetismo",
            "lorentz",
            "campo-magnetico",
            "formule"
          ],
          collegamenti: [
            "elettromagnetismo",
            "induzione",
            "onde-em"
          ]
        },
        {
          titolo: "Induzione elettromagnetica di Faraday-Neumann",
          riassunto: "La scoperta dell'induzione elettromagnetica da parte di Michael Faraday nel 1831 ha rivoluzionato la comprensione dell'elettricità e del magnetismo, aprendo la strada alla generazione di corrente elettrica e alle moderne tecnologie.. Il fenomeno consiste nella produzione di una forza elettromotrice (fem) e quindi di una corrente elettrica in un circuito quando il flusso del campo magnetico concatenato con il circuito varia nel tempo.. Il flusso magnetico Φ attraverso una superficie S si calcola come Φ = B·S cos θ = BS cos θ, dove θ è l'angolo tra il campo B e la normale alla superficie.. Si misura in Weber (Wb).. La legge di Faraday-Neumann quantifica il fenomeno: la fem indotta ε è uguale alla variazione del flusso magnetico nel tempo cambiata di segno: ε = -dΦ/dt.. Il segno negativo, introdotto da Lenz, indica che la corrente indotta si oppone alla variazione di flusso che l'ha generata (legge di Lenz).. Questo è un principio di conservazione dell'energia: se la corrente indotta favorisse la variazione di flusso, si creerebbe energia dal nulla.. Applicazioni pratiche: 1) Alternatore - una spira ruota in un campo magnetico uniforme generando fem sinusoidale ε(t) = ε₀ sin(ωt) dove ε₀ = NBAω (N spire, B campo, A area, ω velocità angolare).. 2) Dinamo - converte energia meccanica in corrente continua.. 3) Trasformatore - due bobine avvolte su un nucleo di ferro; la corrente alternata nel primario crea un campo magnetico variabile che induce fem nel secondario.. Il rapporto tra tensioni è uguale al rapporto tra spire: V₂/V₁ = N₂/N₁.. I trasformatori permettono di trasmettere energia elettrica a grandi distanze alzando la tensione (riducendo perdite per effetto Joule P = I²R) e poi abbassandola per l'utilizzo domestico.. L'autoinduzione si verifica quando una corrente variabile in un circuito induce fem nello stesso circuito.. Il coefficiente di autoinduzione L (induttanza) si misura in Henry (H): ε = -L dI/dt.. Un solenoide ha induttanza L = μ₀n²V dove V è il volume",
          livelloDifficolta: "avanzato",
          tempoLettura: 6,
          tags: [
            "induzione",
            "faraday",
            "trasformatori",
            "corrente-alternata"
          ],
          collegamenti: [
            "magnetismo",
            "onde-elettromagnetiche",
            "maxwell"
          ]
        }
      ]
    },
    {
      titolo: "Fisica moderna",
      annoRiferimento: "5",
      descrizione: "Relatività e meccanica quantistica",
      sottoargomenti: [
        {
          titolo: "Relatività ristretta di Einstein",
          riassunto: "La teoria della relatività ristretta, formulata da Albert Einstein nel 1905, rivoluziona i concetti di spazio, tempo, massa ed energia che sembravano assoluti nella fisica classica.. Einstein parte da due postulati: 1) Le leggi della fisica sono le stesse in tutti i sistemi di riferimento inerziali (principio di relatività); 2) La velocità della luce nel vuoto c = 3×10⁸ m/s è costante per tutti gli osservatori inerziali, indipendentemente dal moto della sorgente o dell'osservatore.. Da questi postulati derivano conseguenze rivoluzionarie.. La dilatazione dei tempi: un orologio in movimento rallenta rispetto a uno fermo.. Se Δt₀ è l'intervallo di tempo proprio (misurato nel sistema solidale con l'orologio), un osservatore in moto relativo misura Δt = γΔt₀ dove γ = 1/√(1-v²/c²) è il fattore di Lorentz.. Per v << c, γ ≈ 1 e gli effetti relativistici sono trascurabili; per v → c, γ → ∞.. Esempio: il paradosso dei gemelli - un gemello viaggia nello spazio a velocità relativistica mentre l'altro resta sulla Terra; al ritorno il viaggiatore è più giovane.. La contrazione delle lunghezze: un oggetto in movimento si contrae nella direzione del moto.. Se L₀ è la lunghezza propria, la lunghezza misurata da un osservatore in moto relativo è L = L₀/γ.. Composizione delle velocità: se un razzo si muove a velocità v rispetto alla Terra e lancia un proiettile a velocità u' rispetto al razzo, la velocità del proiettile rispetto alla Terra non è semplicemente v+u' (galileiana) ma u = (v+u')/(1+vu'/c²).. Questo assicura che nessun oggetto materiale possa superare c.. Equivalenza massa-energia: E = mc² è la formula più famosa della fisica.. Mostra che massa ed energia sono manifestazioni della stessa grandezza fisica.. Una massa a riposo m₀ possiede un'energia a riposo E₀ = m₀c².. L'energia totale di una particella in movimento è E = γm₀c² = m₀c² + energia cinetica.. Questa relazione spiega l'enorme energia liberata nelle reazioni nucleari dove una piccola massa si converte in energia",
          livelloDifficolta: "avanzato",
          tempoLettura: 6,
          tags: [
            "relatività",
            "einstein",
            "tempo-spazio",
            "e=mc2"
          ],
          collegamenti: [
            "fisica-moderna",
            "quantistica",
            "energia-nucleare"
          ]
        }
      ]
    }
  ]
};
