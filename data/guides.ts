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
      "Află cum se transformă numele complet în numărul destinului și ce diferență există față de calea vieții.",
    updatedAt: "2026-06-11",
    category: "Numerologie",
    readMinutes: 5,
    icon: Hash,
    intro:
      "Numărul destinului, numit uneori numărul expresiei, se calculează din numele complet și descrie felul în care îți exprimi potențialul.",
    sections: [
      {
        heading: "Ce informație folosește calculul",
        body: [
          "Calculul pornește de la numele complet, de obicei numele primit la naștere. Fiecare literă este asociată cu o valoare numerică, apoi valorile sunt adunate și reduse.",
          "Pentru numele cu diacritice, cea mai practică abordare este normalizarea literelor la forma de bază, astfel încât calculul să rămână consecvent.",
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
        heading: "Cum îl folosești practic",
        body: [
          "Nu te opri la eticheta numărului. Întreabă-te unde se vede acea energie în viața ta: în muncă, relații, decizii, felul în care conduci sau susții pe alții.",
          "O interpretare bună nu îți spune ce trebuie să faci, ci îți oferă limbaj pentru alegeri mai conștiente.",
        ],
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
      "Ghid pentru interpretarea unui scor de compatibilitate numerologică fără promisiuni exagerate sau concluzii rigide.",
    updatedAt: "2026-06-11",
    category: "Numerologie",
    readMinutes: 6,
    icon: Heart,
    intro:
      "Compatibilitatea numerologică este utilă când o privești ca pe o hartă de conversație, nu ca pe o sentință despre relație.",
    sections: [
      {
        heading: "Ce măsoară scorul",
        body: [
          "Un scor de compatibilitate compară mai multe repere numerologice, precum calea vieții, numărul destinului și vibrațiile numelor. Rezultatul indică zone de armonie și zone unde pot apărea diferențe de ritm.",
          "Scorul nu poate măsura maturitatea, comunicarea, contextul sau alegerile zilnice ale celor doi oameni. De aceea, interpretarea trebuie citită cu discernământ.",
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
    ],
    faqs: [
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
    updatedAt: "2026-06-11",
    category: "Bioritm",
    readMinutes: 5,
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
        heading: "Cum se citește graficul",
        body: [
          "Când o curbă este deasupra liniei centrale, interpretarea sugerează un plus de energie în acel domeniu. Când este sub linie, poate fi o perioadă mai bună pentru prudență, odihnă sau activități mai blânde.",
          "Trecerea prin linia centrală este numită adesea zi critică, pentru că energia se schimbă de la o fază la alta.",
        ],
      },
      {
        heading: "Ce poate și ce nu poate face",
        body: [
          "Bioritmul poate fi un jurnal simbolic bun: te ajută să observi cum îți simți energia și să planifici cu mai multă atenție. Nu este un instrument medical și nu trebuie folosit pentru decizii de sănătate.",
          "Cea mai sănătoasă utilizare este compararea graficului cu propria stare reală, fără panică și fără concluzii absolute.",
        ],
      },
    ],
    faqs: [
      {
        question: "Bioritmul este științific dovedit?",
        answer:
          "Bioritmul este folosit mai ales ca instrument de reflecție și planificare personală. Nu ar trebui tratat ca diagnostic medical sau ca predicție sigură.",
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
      "Ce sunt zilele critice în bioritm, cum apar pe grafic și cum le poți folosi ca semnal de atenție.",
    updatedAt: "2026-06-11",
    category: "Bioritm",
    readMinutes: 5,
    icon: TrendingUp,
    intro:
      "O zi critică apare când unul dintre ciclurile bioritmului trece prin linia de echilibru, adică schimbă faza energetică.",
    sections: [
      {
        heading: "De ce sunt numite critice",
        body: [
          "Termenul poate suna dramatic, dar în practică înseamnă tranziție. Energia nu este neapărat rea, ci mai instabilă sau mai greu de citit.",
          "O zi critică fizică poate sugera prudență la efort. O zi critică emoțională poate cere mai multă răbdare. O zi critică intelectuală poate indica nevoia de verificări suplimentare.",
        ],
      },
      {
        heading: "Cum le folosești fără anxietate",
        body: [
          "Cel mai bun mod este preventiv și calm: lasă-ți mai mult timp, verifică detaliile, evită suprasolicitarea și observă cum reacționezi.",
          "Nu anula viața pentru că apare o zi critică. Folosește informația ca pe o atenționare blândă, nu ca pe o regulă rigidă.",
        ],
      },
      {
        heading: "Când mai multe cicluri se intersectează",
        body: [
          "Când două sau trei cicluri sunt critice în aceeași zi, interpretarea sugerează o perioadă cu mai multe schimbări simultane. Poate fi o zi bună pentru ritm lent, decizii revizuite și mai puține riscuri inutile.",
          "Dacă ai evenimente importante, pregătirea contează mai mult decât frica: verifică agenda, dormi suficient și lasă spațiu pentru ajustări.",
        ],
      },
    ],
    faqs: [
      {
        question: "Trebuie să evit orice decizie într-o zi critică?",
        answer:
          "Nu. Poți lua decizii, dar merită să verifici informațiile, să eviți impulsivitatea și să lași loc pentru clarificări.",
      },
      {
        question: "Toate zilele critice se simt la fel?",
        answer:
          "Nu. Unele pot trece aproape neobservate, iar altele pot coincide cu oboseală sau instabilitate. Contează și contextul real al zilei.",
      },
      {
        question: "Câte zile critice pot apărea într-o lună?",
        answer:
          "Numărul variază în funcție de cele trei cicluri. Calculatorul poate lista zilele relevante pentru perioada aleasă.",
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
      "Cum citești energia zilei în numerologie și bioritm și cum o transformi într-un ritual simplu de orientare.",
    updatedAt: "2026-06-11",
    category: "Numerologie",
    readMinutes: 4,
    icon: CalendarDays,
    intro:
      "Energia zilei funcționează ca o pauză scurtă de orientare: verifici tema simbolică a zilei și alegi un ritm mai potrivit.",
    sections: [
      {
        heading: "Ce înseamnă energia zilei",
        body: [
          "În numerologie, energia zilei este legată de vibrația datei curente și poate sugera teme precum început, cooperare, organizare, schimbare sau introspecție.",
          "În bioritm, energia zilei privește starea ciclurilor tale personale. Împreună, cele două oferă o imagine mai bogată: tema colectivă a zilei și ritmul tău individual.",
        ],
      },
      {
        heading: "Un ritual de două minute",
        body: [
          "Dimineața, citește energia zilei și alege o intenție realistă. Nu trebuie să fie complicat: claritate, răbdare, curaj, ordine sau odihnă.",
          "Seara, verifică dacă tema a apărut în ziua ta. Această buclă simplă poate transforma conținutul spiritual într-un obicei de autocunoaștere.",
        ],
      },
      {
        heading: "Cum eviți interpretările forțate",
        body: [
          "Nu încerca să potrivești orice eveniment cu textul zilei. Caută mai degrabă întrebarea utilă: ce pot ajusta azi ca să fiu mai prezent?",
          "Cele mai bune interpretări sunt cele care te ajută să acționezi mai calm, nu cele care îți iau libertatea de decizie.",
        ],
      },
    ],
    faqs: [
      {
        question: "Energia zilei este aceeași pentru toată lumea?",
        answer:
          "Tema numerologică a datei poate fi comună, dar bioritmul este personal și depinde de data nașterii.",
      },
      {
        question: "Când ar trebui să verific energia zilei?",
        answer:
          "Dimineața este cel mai util, pentru că poți alege o intenție. Poți reveni și seara pentru reflecție.",
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
