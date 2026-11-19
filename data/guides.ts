import {
  Activity,
  CalendarDays,
  Calculator,
  Heart,
  Hash,
  LucideIcon,
  TrendingUp,
} from "lucide-react";
import type { FAQItem } from "@/lib/faq-schema";

export interface GuideSection {
  heading: string;
  body: string[];
}

export interface GuideRelatedLink {
  title: string;
  description: string;
  href: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  category: "Numerologie" | "Bioritm";
  readMinutes: number;
  icon: LucideIcon;
  intro: string;
  sections: GuideSection[];
  relatedLinks?: GuideRelatedLink[];
  faqs: FAQItem[];
  cta: {
    label: string;
    href: string;
    text: string;
  };
}

export const guides: Guide[] = [
  {
    slug: "ce-este-calea-vietii-in-numerologie",
    title: "Ce este calea vieții în numerologie?",
    description:
      "Ghid clar despre numărul căii vieții: ce reprezintă, cum se calculează și cum îl folosești pentru reflecție personală.",
    updatedAt: "2026-06-11",
    category: "Numerologie",
    readMinutes: 5,
    icon: Calculator,
    intro:
      "Calea vieții este unul dintre cele mai căutate concepte din numerologie pentru că pornește de la data nașterii și oferă o imagine simplă asupra direcției personale.",
    sections: [
      {
        heading: "Ce reprezintă calea vieții",
        body: [
          "În numerologie, calea vieții descrie tema principală a traseului tău personal: felul în care înveți, ce tip de provocări apar des și ce calități merită cultivate conștient.",
          "Nu este o predicție fixă și nu înlocuiește deciziile tale. Este mai utilă ca instrument de reflecție: un mod de a pune întrebări mai bune despre ritmul, relațiile și alegerile tale.",
        ],
      },
      {
        heading: "Cum se calculează",
        body: [
          "Se adună cifrele din ziua, luna și anul nașterii până când rezultatul devine o singură cifră. În multe școli numerologice, 11, 22 și 33 sunt păstrate ca numere maestre.",
          "De exemplu, pentru 25.12.1990: 2+5+1+2+1+9+9+0 = 29, apoi 2+9 = 11. Rezultatul poate fi interpretat ca număr maestru 11.",
        ],
      },
      {
        heading: "Cum interpretezi rezultatul",
        body: [
          "Începe cu sensul de bază al numărului, apoi caută exemple concrete în viața ta. Un număr 1 poate vorbi despre inițiativă, iar un număr 6 despre responsabilitate și armonie.",
          "Interpretarea devine mai valoroasă când o legi de comportamente reale: ce alegi ușor, ce eviți, unde repeți același tipar și ce te ajută să te echilibrezi.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Compatibilitate numerologică",
        description:
          "Vezi cum se combină două căi ale vieții cu numerele destinului într-un scor explicat.",
        href: "/ghiduri/compatibilitate-numerologica-interpretare-scor",
      },
      {
        title: "Calculator de compatibilitate",
        description: "Compară gratuit numele și datele de naștere pentru două persoane.",
        href: "/numerologie/compatibilitate",
      },
    ],
    faqs: [
      {
        question: "Calea vieții se schimbă în timp?",
        answer:
          "Nu. Calea vieții se calculează din data nașterii, deci rămâne aceeași. Felul în care o înțelegi se poate maturiza pe măsură ce treci prin experiențe noi.",
      },
      {
        question: "Este calea vieții același lucru cu destinul?",
        answer:
          "Nu exact. Calea vieții pornește din data nașterii și descrie direcția generală, în timp ce numărul destinului este calculat din numele complet și vorbește despre talente și expresie personală.",
      },
      {
        question: "Ce fac dacă obțin 11, 22 sau 33?",
        answer:
          "Acestea sunt considerate numere maestre în multe interpretări. Le poți citi atât ca vibrație proprie, cât și prin reducere: 11 are și nuanțe de 2, 22 de 4, iar 33 de 6.",
      },
    ],
    cta: {
      label: "Calculează calea vieții",
      href: "/numerologie/calea-vietii",
      text: "Introdu data nașterii și primești instant numărul tău, cu interpretare în limba română.",
    },
  },
  {
    slug: "cum-se-calculeaza-numarul-destinului",
    title: "Cum se calculează numărul destinului?",
    description:
      "Vezi tabelul pitagoreic, un calcul complet din nume și cum interpretezi numărul destinului fără concluzii rigide.",
    updatedAt: "2026-07-20",
    category: "Numerologie",
    readMinutes: 8,
    icon: Hash,
    intro:
      "Numărul destinului, numit și numărul expresiei, se calculează din literele numelui complet. Ghidul de mai jos arată exact tabelul și reducerea folosite de calculatorul SpiritHub.",
    sections: [
      {
        heading: "Ce nume folosești în calcul",
        body: [
          "Pentru interpretarea de bază se folosește numele complet de la naștere, cu toate prenumele și numele de familie. Dacă folosești astăzi alt nume, îl poți calcula separat pentru a compara expresia actuală cu reperul de la naștere.",
          "Calculatorul adună numai literele. Spațiile, cratimele, apostrofurile și cifrele nu primesc valoare și nu schimbă suma.",
        ],
      },
      {
        heading: "Tabelul pitagoreic folosit de calculator",
        body: [
          "Literele se repetă în grupe de la 1 la 9: 1 = A, J și S; 2 = B, K și T; 3 = C, L și U; 4 = D, M și V; 5 = E, N și W; 6 = F, O și X; 7 = G, P și Y; 8 = H, Q și Z; 9 = I și R.",
          "Diacriticele românești păstrează valoarea literei de bază: Ă și Â au valoarea lui A, Î pe cea a lui I, Ș pe cea a lui S, iar Ț pe cea a lui T. Literele mari și mici sunt tratate la fel.",
        ],
      },
      {
        heading: "Exemplu complet: Ion Popescu",
        body: [
          "Pentru Ion Popescu, valorile sunt I=9, O=6, N=5, P=7, O=6, P=7, E=5, S=1, C=3 și U=3. Suma este 52.",
          "Apoi reducem 52 la 5 + 2 = 7. Rezultatul calculatorului este Numărul Destinului 7; interpretarea descrie simbolic o expresie orientată spre analiză, profunzime și înțelegere.",
        ],
      },
      {
        heading: "Cum se reduce suma și ce se întâmplă cu numerele maestre",
        body: [
          "Dacă suma are mai multe cifre, cifrele se adună din nou până rămâne un număr de la 1 la 9. Calculatorul păstrează numerele maestre 11, 22 și 33 atunci când apar în procesul de reducere.",
          "De exemplu, 52 devine 7, iar 29 devine 11 și se oprește acolo. Numerele maestre pot fi citite și prin cifra lor redusă: 11 are nuanțe de 2, 22 de 4, iar 33 de 6.",
        ],
      },
      {
        heading: "Diferența față de calea vieții",
        body: [
          "Calea vieții arată tema de fond calculată din data nașterii. Numărul destinului arată expresia personală: cum comunici, construiești, alegi roluri și îți folosești talentele.",
          "Cele două se citesc cel mai bine împreună. Dacă direcția și expresia se susțin, apar mai multă claritate și energie. Dacă par în tensiune, pot indica zone bune pentru dezvoltare.",
        ],
      },
      {
        heading: "Cum îl folosești practic și unde se oprește interpretarea",
        body: [
          "Nu te opri la eticheta numărului. Întreabă-te unde se vede acea energie în viața ta: în muncă, relații, decizii, felul în care conduci sau susții pe alții.",
          "Numerologia este un sistem simbolic și nu este o metodă științifică, un diagnostic sau o predicție. O interpretare utilă nu îți spune ce trebuie să faci, ci îți oferă întrebări și limbaj pentru reflecție personală.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Ce este calea vieții?",
        description:
          "Compară numărul calculat din data nașterii cu expresia obținută din numele complet.",
        href: "/ghiduri/ce-este-calea-vietii-in-numerologie",
      },
      {
        title: "Compatibilitate numerologică",
        description:
          "Înțelege rolul numărului destinului în scorul de compatibilitate dintre două persoane.",
        href: "/ghiduri/compatibilitate-numerologica-interpretare-scor",
      },
      {
        title: "Calculator de compatibilitate",
        description: "Compară gratuit numele și datele de naștere pentru două persoane.",
        href: "/numerologie/compatibilitate",
      },
    ],
    faqs: [
      {
        question: "Folosesc numele actual sau numele de la naștere?",
        answer:
          "Pentru interpretarea de bază se folosește de obicei numele complet de la naștere. Poți calcula separat și numele actual pentru a observa nuanțe de expresie prezentă.",
      },
      {
        question: "Contează diacriticele în calcul?",
        answer:
          "Pentru consecvență, diacriticele sunt tratate ca literele lor de bază. De exemplu, ă se citește ca a, ș ca s, ț ca t.",
      },
      {
        question: "Spațiile și cratimele schimbă rezultatul?",
        answer:
          "Nu. Calculatorul atribuie valori numai literelor. Spațiile, cratimele, apostrofurile și cifrele sunt ignorate la adunare.",
      },
      {
        question: "Numărul destinului este o predicție?",
        answer:
          "Nu. Este o interpretare simbolică a numelui și funcționează cel mai bine ca instrument de autocunoaștere, nu ca verdict despre viitor.",
      },
    ],
    cta: {
      label: "Calculează numărul destinului",
      href: "/numerologie/nume-destin",
      text: "Scrie numele complet și vezi interpretarea numerologică a expresiei tale personale.",
    },
  },
  {
    slug: "compatibilitate-numerologica-interpretare-scor",
    title: "Compatibilitate numerologică: cum se interpretează scorul?",
    description:
      "Află cum se calculează compatibilitatea numerologică din nume și date de naștere și cum interpretezi scorul fără concluzii rigide.",
    updatedAt: "2026-06-29",
    category: "Numerologie",
    readMinutes: 8,
    icon: Heart,
    intro:
      "Compatibilitatea numerologică pune alături calea vieții și numărul destinului pentru două persoane. Rezultatul este mai util ca hartă de conversație decât ca sentință despre relație.",
    sections: [
      {
        heading: "Ce date intră în calcul",
        body: [
          "Calculatorul folosește numele complet și data nașterii pentru fiecare persoană. Din data nașterii rezultă calea vieții, iar din literele numelui complet rezultă numărul destinului.",
          "Folosirea ambelor repere evită o comparație bazată pe o singură cifră. Calea vieții descrie direcția și ritmul personal, iar numărul destinului adaugă felul în care fiecare persoană își exprimă energia și talentele.",
        ],
      },
      {
        heading: "Cum se calculează scorul de compatibilitate",
        body: [
          "SpiritHub compară mai întâi cele două căi ale vieții și obține un scor pentru această pereche. Apoi compară cele două numere ale destinului și obține al doilea scor.",
          "Scorul general afișat este media rotunjită a celor două rezultate. Procentul descrie apropierea simbolică dintre reperele numerologice; nu este probabilitatea ca relația să reușească și nu poate măsura comunicarea, maturitatea sau contextul real.",
        ],
      },
      {
        heading: "Cum citești un scor mare",
        body: [
          "Un scor mare sugerează că anumite teme personale se susțin natural. Poate exista ușurință în comunicare, obiective asemănătoare sau moduri compatibile de a reacționa la schimbare.",
          "Chiar și așa, compatibilitatea simbolică nu înlocuiește grija practică: limite clare, conversații sincere și respect pentru diferențe.",
        ],
      },
      {
        heading: "Cum citești un scor mic",
        body: [
          "Un scor mai mic nu înseamnă automat că relația nu poate funcționa. Poate indica diferențe de nevoi, ritm sau priorități, adică exact subiectele pe care merită să le discutați.",
          "Folosește interpretarea ca punct de pornire: ce ne vine ușor, ce ne activează, unde avem nevoie de mai multă răbdare?",
        ],
      },
      {
        heading: "Cum folosești rezultatul în relație",
        body: [
          "Citește separat potrivirea căilor vieții și potrivirea numerelor destinului. Dacă una este mai ridicată decât cealaltă, diferența poate arăta unde există naturalețe și unde sunt necesare explicații mai clare între voi.",
          "Transformă rezultatul în întrebări concrete: cum luăm decizii, cum cerem spațiu, cum gestionăm conflictele și ce așteptări avem de la relație? Un scor devine util doar când conduce la observații și conversații reale.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Ce este calea vieții?",
        description: "Înțelege numărul calculat din data nașterii și rolul lui în compatibilitate.",
        href: "/ghiduri/ce-este-calea-vietii-in-numerologie",
      },
      {
        title: "Cum se calculează numărul destinului?",
        description: "Vezi cum este transformat numele complet în al doilea reper al scorului.",
        href: "/ghiduri/cum-se-calculeaza-numarul-destinului",
      },
    ],
    faqs: [
      {
        question: "Cum se calculează procentul de compatibilitate?",
        answer:
          "Calculatorul compară mai întâi căile vieții, apoi numerele destinului. Procentul general este media rotunjită a celor două scoruri de compatibilitate.",
      },
      {
        question: "Un scor mic înseamnă incompatibilitate totală?",
        answer:
          "Nu. Înseamnă doar că interpretarea numerologică vede mai multe diferențe sau tensiuni. Relațiile reale depind de comunicare, valori, context și alegeri.",
      },
      {
        question: "Pot calcula compatibilitatea pentru prieteni sau familie?",
        answer:
          "Da. Interpretarea poate fi folosită pentru orice relație, nu doar romantică, atâta timp cât o citești ca reflecție simbolică.",
      },
      {
        question: "Ce date sunt necesare?",
        answer:
          "De obicei se folosesc numele și datele de naștere ale ambelor persoane, pentru a compara atât vibrația numelui, cât și calea vieții.",
      },
    ],
    cta: {
      label: "Testează compatibilitatea",
      href: "/numerologie/compatibilitate",
      text: "Completează datele pentru două persoane și primești un scor cu explicații clare.",
    },
  },
  {
    slug: "ce-este-bioritmul",
    title: "Ce este bioritmul?",
    description:
      "Explicație pe înțelesul tuturor despre bioritm, cele trei cicluri principale și felul în care poate fi folosit pentru planificare personală.",
    updatedAt: "2026-11-19",
    category: "Bioritm",
    readMinutes: 7,
    icon: Activity,
    intro:
      "Bioritmul descrie fluctuații ciclice ale energiei fizice, emoționale și intelectuale, calculate pornind de la data nașterii.",
    sections: [
      {
        heading: "Cele trei cicluri principale",
        body: [
          "Modelul clasic folosește ciclul fizic de 23 de zile, ciclul emoțional de 28 de zile și ciclul intelectual de 33 de zile. Fiecare ciclu urcă și coboară între perioade de energie mai ridicată și perioade de refacere.",
          "Ciclul fizic este asociat cu vitalitatea, efortul și rezistența. Cel emoțional cu dispoziția și sensibilitatea. Cel intelectual cu atenția, analiza și claritatea mentală.",
        ],
      },
      {
        heading: "Cum se calculează bioritmul",
        body: [
          "Calculatorul numără zilele dintre data nașterii și data analizată. Pentru fiecare ciclu aplică formula sinusoidală sin(2 × π × zile trăite / durata ciclului), folosind pe rând 23, 28 și 33 de zile.",
          "Rezultatul fiecărui ciclu este cuprins între -1 și +1 și este afișat ca procent între -100% și +100%. Valoarea arată poziția pe curbă pentru ziua aleasă; nu este o măsurătoare medicală și nici o predicție sigură.",
        ],
      },
      {
        heading: "Cum se citește graficul",
        body: [
          "Când o curbă este deasupra liniei centrale, interpretarea sugerează un plus de energie în acel domeniu. Când este sub linie, poate fi o perioadă mai bună pentru prudență, odihnă sau activități mai blânde.",
          "Trecerea prin linia centrală este numită adesea zi critică, pentru că energia se schimbă de la o fază la alta.",
        ],
      },
      {
        heading: "Cum folosești calculatorul pas cu pas",
        body: [
          "Introdu data nașterii, alege ziua pe care vrei să o verifici și pornește calculul. Vei primi valorile fizică, emoțională și intelectuală, direcția fiecărui ciclu și o privire asupra următoarelor șapte zile.",
          "Începe cu ciclul aflat cel mai aproape de zero, apoi compară graficul cu programul și starea ta reală. Pentru tranzițiile următoare poți deschide calculatorul de zile critice, fără să transformi rezultatele în reguli rigide.",
        ],
      },
      {
        heading: "Ce poate și ce nu poate face",
        body: [
          "Bioritmul poate fi un jurnal simbolic bun: te ajută să observi cum îți simți energia și să planifici cu mai multă atenție. Nu este un instrument medical, nu reprezintă o metodă științifică validată și nu trebuie folosit pentru decizii de sănătate.",
          "Cea mai sănătoasă utilizare este compararea graficului cu propria stare reală, fără panică și fără concluzii absolute.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Zile critice în bioritm",
        description: "Înțelege ce înseamnă trecerea unui ciclu prin zero și cum o citești calm.",
        href: "/ghiduri/zile-critice-in-bioritm",
      },
      {
        title: "Energia zilei",
        description: "Combină ritmul personal cu o scurtă practică zilnică de reflecție.",
        href: "/ghiduri/energia-zilei-cum-sa-o-folosesti",
      },
      {
        title: "Compatibilitate bioritm",
        description:
          "Compară sincronizarea ciclurilor fizic, emoțional și intelectual între două date de naștere.",
        href: "/bioritm/compatibilitate",
      },
    ],
    faqs: [
      {
        question: "Bioritmul este științific dovedit?",
        answer:
          "Bioritmul este folosit mai ales ca instrument simbolic de reflecție și planificare personală. Nu este o metodă științifică și nu ar trebui tratat ca diagnostic medical sau ca predicție sigură.",
      },
      {
        question: "De ce se calculează din data nașterii?",
        answer:
          "Teoria bioritmurilor presupune că ciclurile pornesc la naștere și continuă matematic pe parcursul vieții.",
      },
      {
        question: "Pot folosi bioritmul zilnic?",
        answer:
          "Da, mai ales pentru reflecție. Verifică energia zilei și compară interpretarea cu felul în care te simți de fapt.",
      },
    ],
    cta: {
      label: "Calculează bioritmul",
      href: "/bioritm",
      text: "Alege data nașterii și vezi graficul pentru ciclurile fizic, emoțional și intelectual.",
    },
  },
  {
    slug: "zile-critice-in-bioritm",
    title: "Zile critice în bioritm: ce înseamnă?",
    description:
      "Ce sunt zilele critice în bioritm, cum se calculează pragul de ±0,15 (±15%) și cum le poți folosi calm ca semnal de atenție.",
    updatedAt: "2026-11-19",
    category: "Bioritm",
    readMinutes: 7,
    icon: TrendingUp,
    intro:
      "O zi critică apare când unul dintre ciclurile bioritmului trece prin linia de echilibru zero, adică schimbă faza dintre polul pozitiv și cel negativ.",
    sections: [
      {
        heading: "Cum detectează calculatorul o zi critică (pragul ±0,15)",
        body: [
          "Pentru fiecare zi din intervalul verificat, calculatorul SpiritHub aplică formula sinusoidală sin(2 × π × zile trăite / durata ciclului) pe cele trei durate clasice: 23, 28 și 33 de zile. Valoarea obținută variază între -1,00 și +1,00.",
          "O zi este marcată drept critică atunci când modulul valorii se află în intervalul de trecere prin zero de ±0,15 (adică între -15% și +15%). Acest prag prinde exact momentele în care curba traversează linia centrală de la plus spre minus sau de la minus spre plus.",
        ],
      },
      {
        heading: "Exemplu concret pe ciclul fizic de 23 de zile",
        body: [
          "Pentru ciclul fizic de 23 de zile, jumătatea ciclului cade între ziua 11 și ziua 12 de la debut, iar închiderea ciclului cade în ziua 23. Aplicând formula sin(2 × π × zile / 23), în ziua 11 valoarea este aproximativ +0,14 (+14%), iar în ziua 12 coboară la aproximativ -0,14 (-14%).",
          "Ambele zile intră în intervalul ±0,15, așa că sunt semnalate ca zile de tranziție fizică. La fel se întâmplă și în ziua 23, când valoarea devine exact 0,00 (0%), moment în care ciclul revine în faza ascendentă.",
        ],
      },
      {
        heading: "De ce sunt numite critice și cum le citești",
        body: [
          "Termenul poate suna dramatic, dar în practică înseamnă tranziție. Ritmul nu este neapărat negativ, ci mai puțin stabil sau mai greu de anticipat.",
          "O zi critică fizică poate sugera prudență la efort intens. O zi critică emoțională poate cere mai multă răbdare în conversații. O zi critică intelectuală poate indica nevoia de verificări suplimentare înainte de decizii complexe.",
        ],
      },
      {
        heading: "Cum le folosești fără anxietate când mai multe cicluri coincid",
        body: [
          "Când două sau trei cicluri intră simultan în pragul ±0,15, interpretarea indică o zi cu mai multe schimbări de fază. Cel mai util răspuns este preventiv și calm: lasă-ți timp în agendă, verifică detaliile, dormi suficient și evită graba.",
          "Nu amâna viața pentru că apare o zi critică. Zilele critice fac parte dintr-un model simbolic de reflecție personală; nu reprezintă o metodă științifică, un diagnostic medical sau o predicție sigură despre riscuri reale.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Ce este bioritmul?",
        description: "Vezi formula celor trei cicluri și cum sunt transformate în procente.",
        href: "/ghiduri/ce-este-bioritmul",
      },
      {
        title: "Calculator bioritm personal",
        description: "Calculează gratuit graficul și următoarele tranziții pentru data ta.",
        href: "/bioritm",
      },
      {
        title: "Compatibilitate bioritm",
        description: "Vezi cum se aliniază ciclurile a două persoane pe 23, 28 și 33 de zile.",
        href: "/bioritm/compatibilitate",
      },
    ],
    faqs: [
      {
        question: "Ce prag folosește SpiritHub pentru o zi critică?",
        answer:
          "Calculatorul marchează un ciclu ca fiind critic atunci când valoarea sinusoidală se află între -0,15 și +0,15 (±15% în jurul liniei zero).",
      },
      {
        question: "Trebuie să evit orice decizie într-o zi critică?",
        answer:
          "Nu. Poți lua decizii, dar merită să verifici informațiile, să eviți impulsivitatea și să lași loc pentru clarificări.",
      },
      {
        question: "Toate zilele critice se simt la fel?",
        answer:
          "Nu. Unele pot trece aproape neobservate, iar altele pot coincide cu oboseală sau atenție scăzută. Contează în primul rând somnul, contextul și starea ta reală.",
      },
      {
        question: "Zilele critice prezic accidente sau probleme medicale?",
        answer:
          "Nu. Bioritmul este un sistem simbolic de autoobservare, nu o metodă științifică și nu un instrument medical sau de predicție.",
      },
    ],
    cta: {
      label: "Vezi zilele critice",
      href: "/bioritm/critice",
      text: "Calculează următoarele zile critice și pregătește-ți ritmul cu mai multă claritate.",
    },
  },
  {
    slug: "energia-zilei-cum-sa-o-folosesti",
    title: "Energia zilei: cum să o folosești?",
    description:
      "Cum combină SpiritHub tema planetară a zilei, vibrația numerologică zilnică și bioritmul personal într-un ritual simplu de orientare.",
    updatedAt: "2026-11-19",
    category: "Numerologie",
    readMinutes: 6,
    icon: CalendarDays,
    intro:
      "Energia zilei funcționează ca o pauză scurtă de orientare: pui alături tema simbolică a datei curente și ritmul tău personal, ca să îți dozezi efortul mai realist.",
    sections: [
      {
        heading: "Cum combină SpiritHub cele trei repere ale zilei",
        body: [
          "Pe SpiritHub, citirea zilnică unește trei straturi complementare. Primul este tema planetară a zilei din săptămână, care oferă un cadru general pentru atenție, acțiune sau odihnă. Al doilea este numărul zilnic din numerologie, obținut prin reducerea sumei dintre zi, lună și anul universal.",
          "Al treilea strat este bioritmul tău personal, calculat din data nașterii pe ciclurile de 23, 28 și 33 de zile. Împreună, tema universală a datei și curbele tale individuale oferă o hartă mai nuanțată decât un mesaj generic.",
        ],
      },
      {
        heading: "Exemplu concret pentru dimineață și seară",
        body: [
          "Dimineața, poți verifica energia zilei în două minute. De exemplu, dacă tema zilei vorbește despre organizare și claritate, iar numărul zilnic este 4 (structură), dar în bioritmul personal ciclul fizic coboară sub zero, îți poți programa sarcini de birou sau ordine în acte în locul unui antrenament intens.",
          "Seara, revii cu o întrebare scurtă: ce a mers ușor astăzi și unde am forțat ritmul? Dacă observi că deciziile grăbite au apărut exact într-o zi de tranziție, obiceiurile tale devin mai clare de la o săptămână la alta.",
        ],
      },
      {
        heading: "Cum eviți interpretările forțate și limitele metodei",
        body: [
          "Nu încerca să potrivești fiecare întâmplare cu textul zilei. Caută mai degrabă întrebarea practică: ce pot ajusta azi ca să lucrez mai calm și mai atent cu energia pe care o am?",
          "Această abordare are rol simbolic și de reflecție personală. Nu este o metodă științifică și nu oferă predicții despre evenimentele zilei; deciziile și contextul tău concret rămân întotdeauna pe primul loc.",
        ],
      },
    ],
    relatedLinks: [
      {
        title: "Ce este bioritmul?",
        description: "Înțelege ciclurile fizic, emoțional și intelectual înainte de interpretare.",
        href: "/ghiduri/ce-este-bioritmul",
      },
      {
        title: "Calculator bioritm personal",
        description: "Vezi ritmul tău pentru azi și perspectiva următoarelor șapte zile.",
        href: "/bioritm",
      },
      {
        title: "Compatibilitate bioritm",
        description: "Compară ritmurile a două persoane pentru a coordona mai ușor activitățile.",
        href: "/bioritm/compatibilitate",
      },
    ],
    faqs: [
      {
        question: "Energia zilei este aceeași pentru toată lumea?",
        answer:
          "Tema planetară a zilei și numărul zilnic sunt comune pentru întreaga dată calendaristică, însă bioritmul este personal și depinde de data nașterii fiecăruia.",
      },
      {
        question: "Când ar trebui să verific energia zilei?",
        answer:
          "Dimineața este cel mai util, pentru că poți alege o intenție realistă și o ordine a priorităților. Seara o poți folosi ca reper scurt de reflecție.",
      },
      {
        question: "Energia zilei poate prezice ce mi se va întâmpla?",
        answer:
          "Nu. Este o interpretare simbolică destinată autoobservării și orientării zilnice, nu o metodă științifică sau o predicție.",
      },
      {
        question: "Pot distribui mesajul zilei?",
        answer:
          "Da. Paginile SpiritHub includ rezultate și mesaje ușor de trimis mai departe, atunci când vrei să le păstrezi sau să le împărtășești.",
      },
    ],
    cta: {
      label: "Vezi energia zilei",
      href: "/bioritm/energia-zilei",
      text: "Primește o citire rapidă pentru ritmul zilei și folosește-o ca punct de orientare.",
    },
  },
];

export const guideSlugs = guides.map((guide) => guide.slug);

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
