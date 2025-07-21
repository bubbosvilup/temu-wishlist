export function parseTemuLink(link) {
  try {
    const urlObj = new URL(link);
    const rawImage = urlObj.searchParams.get("top_gallery_url");
    if (!rawImage) {
      alert(
        "Il link non contiene top_gallery_url, impossibile estrarre l'immagine."
      );
      return null;
    }

    function cleanTemuTitle(title) {
      // Dividi in parole
      const words = title.toLowerCase().split(/\s+/);

      // Rimuovi duplicati mantenendo l'ordine
      const uniqueWords = [];
      const seen = new Set();

      for (const word of words) {
        if (!seen.has(word) && word.length > 1) {
          // ignora parole di 1 lettera
          uniqueWords.push(word);
          seen.add(word);
        }
      }

      // Parole comuni da rimuovere o spostare alla fine
      const stopWords = new Set([
        "per",
        "con",
        "di",
        "da",
        "in",
        "su",
        "e",
        "o",
        "a",
        "il",
        "la",
        "lo",
        "le",
        "gli",
        "un",
        "una",
        "del",
        "della",
        "dei",
        "delle",
        "che",
        "sono",
        "è",
        "questa",
        "questo",
        "molto",
        "più",
        "anche",
        "tutti",
        "tutte",
      ]);

      const materialWords = new Set([
        // Materiali
        "materiale",
        "resina",
        "acrilico",
        "plastica",
        "cotone",
        "metallo",
        "acciaio",
        "alluminio",
        "ferro",
        "ottone",
        "rame",
        "legno",
        "bambù",
        "ceramica",
        "vetro",
        "cristallo",
        "gomma",
        "silicone",
        "pvc",
        "abs",
        "resina",
        "tessuto",
        "cotone",
        "poliestere",
        "nylon",
        "canvas",
        "tela",
        "velluto",
        "jeans",
        "denim",
        "peluche",
        "pelle",
        "cuoio",
        "ecopelle",
        "finta",
        "similpelle",
        "camoscio",
        "lattice",
        "carta",
        "cartone",
        "mdf",
        "compensato",
        "laminato",
        "melamina",
        "schiuma",
        "spugna",
        "gommapiuma",
        "carbonio",
        "fibra",
        "titanio",
        "zinco",
        "ceramico",
        "acciaio-inox",
        // Qualità/caratteristiche
        "resistente",
        "durevole",
        "impermeabile",
        "antiscivolo",
        "antibatterico",
        "lavabile",
        "pieghevole",
        "ripiegabile",
        "riutilizzabile",
        "ecologico",
        "biodegradabile",
        "riciclabile",
        "sostenibile",
        "naturale",
        "organico",
        "vegano",
        "rigido",
        "flessibile",
        "morbido",
        "duro",
        "leggero",
        "pesante",
        "trasparente",
        "opaco",
        "satinato",
        "lucido",
        "brillante",
        "matt",
        "gloss",
        "opalescente",
        "soffice",
        "comodo",
        "ergonomico",
        "traspirante",
        "assorbente",
        "idrorepellente",
        "isolante",
        "silenzioso",
        "antirumore",
        "antiurto",
        "autosigillante",
        "antigraffio",
        "magnetico",
        // Stili/design
        "vintage",
        "moderno",
        "classico",
        "contemporaneo",
        "minimalista",
        "rustico",
        "industriale",
        "retrò",
        "shabby",
        "chic",
        "boho",
        "bohémien",
        "elegante",
        "casual",
        "formale",
        "sportivo",
        "anime",
        "kawaii",
        "gotico",
        "steampunk",
        "luxury",
        "deluxe",
        "premium",
        "fantasia",
        "carino",
        "cute",
        "fashion",
        // Parole generiche
        "design",
        "stile",
        "qualità",
        "accessori",
        "accessorio",
        "prodotto",
        "articolo",
        "oggetto",
        "item",
        "gadget",
        "nuovo",
        "novità",
        "originale",
        "offerta",
        "sconto",
        "confezione",
        "set",
        "kit",
        "pacchetto",
        "bundle",
        "collezionabile",
        "collezione",
        "edizione",
        "limitata",
        // Dimensioni/misure generiche
        "taglia",
        "piccolo",
        "media",
        "medio",
        "grande",
        "xl",
        "xxl",
        "xs",
        "xxs",
        "mini",
        "maxi",
        "standard",
        "universale",
        "portatile",
        "tascabile",
        "compatto",
        "formato",
        "misura",
        "dimensione",
        "taglia",
        "lunghezza",
        "larghezza",
        "altezza",
        // Colori base (spesso ridondanti)
        "colorato",
        "colorata",
        "multicolore",
        "variopinto",
        "monocromo",
        "neutro",
        "pastello",
        "traslucido",
        "lucente",
        "cromato",
        "perlato",
        "metallico",
        "smerigliato",
        // Lingua misto inglese che compare spesso
        "style",
        "design",
        "fashion",
        "luxury",
        "premium",
        "top",
        "new",
        "hot",
        "sale",
        "best",
        "cool",
      ]);

      // Separa parole principali da quelle secondarie
      const mainWords = [];
      const secondaryWords = [];

      for (const word of uniqueWords) {
        if (stopWords.has(word)) {
          continue; // salta le stop words
        }
        if (materialWords.has(word)) {
          secondaryWords.push(word);
        } else {
          mainWords.push(word);
        }
      }

      // Ricomponi: prima le parole principali, poi quelle secondarie (max 2-3)
      const finalWords = [
        ...mainWords.slice(0, 6),
        ...secondaryWords.slice(0, 2),
      ];

      return finalWords.join(" ").trim();
    }
    const image = decodeURIComponent(rawImage);

    // Estrai lo slug tra il dominio e ".html"
    const pathname = urlObj.pathname;
    const slugMatch = pathname.match(/\/([^/]+)\.html/);
    let rawTitle = slugMatch ? slugMatch[1] : "Prodotto Temu";

    // Prima decodifica URL per gestire caratteri come %C3%B2
    rawTitle = decodeURIComponent(rawTitle);

    // Pulisci: sostituisci -- con spazi, togli id prodotto finale tipo -g-XXXXXXXX
    rawTitle = rawTitle
      .replace(/--/g, " ") // sostituisci doppi trattini con spazi
      .replace(/-g-\d+$/, "") // rimuove l'ID finale tipo "-g-601101358467740"
      .replace(/-/g, " ") // sostituisci trattini singoli con spazi
      .replace(/\s+/g, " ") // normalizza spazi multipli in uno solo
      .trim();

    // Pulizia intelligente del titolo
    const cleanTitle = cleanTemuTitle(rawTitle);

    // Capitalizza la prima lettera
    const title = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

    return {
      image,
      title,
      url: link,
    };
  } catch (err) {
    console.error("Errore nel parsing del link:", err);
    alert("Errore durante il parsing del link.");
    return null;
  }
}
