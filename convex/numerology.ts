/**
 * Numerology Convex Backend Functions
 *
 * Provides queries and mutations for numerology interpretations:
 * - Life Path interpretations (1-9)
 * - Destiny interpretations (1-9)
 * - Compatibility interpretations (score ranges)
 * - Daily number interpretations (1-9)
 * - Seeding mutation for initial data population
 *
 * SETUP INSTRUCTIONS:
 * 1. Deploy this file to Convex: `npx convex dev` or `npx convex deploy`
 * 2. Open Convex Dashboard: https://dashboard.convex.dev
 * 3. Navigate to your project
 * 4. Go to "Functions" tab
 * 5. Find and run the `numerology:seedInterpretations` mutation
 * 6. Verify success message and check the "Data" tab to see interpretations
 *
 * The seeding mutation will insert:
 * - 9 Life Path interpretations (numbers 1-9)
 * - 3 Life Path Master Numbers (11, 22, 33)
 * - 9 Destiny interpretations (numbers 1-9)
 * - 3 Destiny Master Numbers (11, 22, 33)
 * - 4 Compatibility interpretations (score ranges: 25, 50, 75, 100)
 * - 9 Daily interpretations (numbers 1-9)
 * Total: 37 interpretation records
 */

import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: getLifePathInterpretation
 * Fetches Life Path interpretation for a given number (1-9)
 */
export const getLifePathInterpretation = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    const interpretation = await ctx.db
      .query("interpretations")
      .withIndex("by_type_and_number", (q) => q.eq("type", "lifePath").eq("number", args.number))
      .first();

    if (!interpretation) {
      throw new Error(`Nu s-a găsit interpretarea pentru Calea Vieții ${args.number}`);
    }

    return interpretation;
  },
});

/**
 * Query: getDestinyInterpretation
 * Fetches Destiny number interpretation for a given number (1-9)
 */
export const getDestinyInterpretation = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    const interpretation = await ctx.db
      .query("interpretations")
      .withIndex("by_type_and_number", (q) => q.eq("type", "destiny").eq("number", args.number))
      .first();

    if (!interpretation) {
      throw new Error(`Nu s-a găsit interpretarea pentru Numărul Destinului ${args.number}`);
    }

    return interpretation;
  },
});

/**
 * Query: getCompatibilityInterpretation
 * Fetches compatibility interpretation based on score range
 */
export const getCompatibilityInterpretation = query({
  args: { score: v.number() },
  handler: async (ctx, args) => {
    // Determine compatibility level based on score
    let level: string;
    if (args.score >= 76) level = "excellent";
    else if (args.score >= 51) level = "good";
    else if (args.score >= 26) level = "medium";
    else level = "low";

    const interpretation = await ctx.db
      .query("interpretations")
      .withIndex("by_type_and_number", (q) =>
        q.eq("type", "compatibility").eq("number", args.score),
      )
      .first();

    // If exact score not found, find by level (stored with special numbers: 100, 75, 50, 25)
    if (!interpretation) {
      let levelNumber: number;
      if (level === "excellent") levelNumber = 100;
      else if (level === "good") levelNumber = 75;
      else if (level === "medium") levelNumber = 50;
      else levelNumber = 25;

      const levelInterpretation = await ctx.db
        .query("interpretations")
        .withIndex("by_type_and_number", (q) =>
          q.eq("type", "compatibility").eq("number", levelNumber),
        )
        .first();

      if (!levelInterpretation) {
        throw new Error(`Nu s-a găsit interpretarea pentru compatibilitatea ${level}`);
      }

      return levelInterpretation;
    }

    return interpretation;
  },
});

/**
 * Query: getDailyNumber
 * Calculates and returns daily number with interpretation
 */
export const getDailyNumber = query({
  args: { date: v.string() }, // ISO format: "YYYY-MM-DD"
  handler: async (ctx, args) => {
    // Calculate daily number from date
    const date = new Date(args.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Sum and reduce to single digit
    const sum = day + month + year;
    let dailyNumber = sum;
    while (dailyNumber > 9) {
      dailyNumber = Math.floor(dailyNumber / 10) + (dailyNumber % 10);
    }

    // Fetch interpretation
    const interpretation = await ctx.db
      .query("interpretations")
      .withIndex("by_type_and_number", (q) => q.eq("type", "daily").eq("number", dailyNumber))
      .first();

    if (!interpretation) {
      throw new Error(`Nu s-a găsit interpretarea zilnică pentru numărul ${dailyNumber}`);
    }

    return {
      ...interpretation,
      date: args.date,
    };
  },
});

/**
 * Mutation: seedInterpretations
 * Seeds the database with Romanian numerology interpretations
 * Should be run once during initial setup from Convex dashboard
 */
export const seedInterpretations = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("interpretations").first();
    if (existing) {
      return {
        success: false,
        message: "Interpretările au fost deja adăugate în baza de date",
      };
    }

    // ========================================================================
    // Life Path Interpretations (1-9)
    // ========================================================================

    const lifePathData = [
      {
        type: "lifePath",
        number: 1,
        title: "Lider Natural",
        description: "Ești un pionier independent, cu spirit inovator și dorință de a conduce.",
        fullText: `Calea ta în viață este marcată de independență, curaj și dorința de a fi primul. Ești un lider natural, cu o energie puternică care te împinge să inițiezi proiecte noi și să deschizi drumuri neexplorate. Ai o minte creativă și inovatoare, fiind mereu în căutarea de soluții originale.

Personalitatea ta este caracterizată de determinare și ambiție. Nu îți place să urmezi mulțimea - preferi să creezi propriul tău drum. Ești independent și ai nevoie de libertate pentru a-ți exprima individualitatea. Curajul tău te face să înfrunți provocările cu încredere, chiar dacă alții ar ezita.

În relațiile tale, poți fi uneori prea autoritar sau impulsiv. Învață să asculți și să colaborezi cu ceilalți, fără a-ți pierde din vedere viziunea ta. Scopul tău în viață este să conduci prin exemplu, să inspiri pe alții și să aduci schimbări pozitive în lume prin inițiativele tale curajoase.

Punctele tale forte includ: leadership natural, creativitate, curaj, determinare și capacitatea de a începe lucruri noi. Provocările tale sunt: tendința de a fi prea autoritar, impaciența, dificultatea de a lucra în echipă și riscul de a deveni egocentric.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 2,
        title: "Diplomat și Cooperant",
        description:
          "Ești sensibil, intuitiv și ai un talent natural pentru mediere și colaborare.",
        fullText: `Calea ta în viață este marcată de sensibilitate, diplomație și dorința de armonie. Ești un mediator natural, cu o capacitate remarcabilă de a înțelege emoțiile și nevoile celorlalți. Intuiția ta puternică te ghidează în relațiile tale și te ajută să creezi punți între oameni.

Personalitatea ta este caracterizată de blândețe, răbdare și empatie. Ai un talent special pentru a lucra în echipă și pentru a crea atmosfere armonioase. Ești un ascultător excelent și știi cum să oferi sprijin emoțional celor din jur. Pacea și echilibrul sunt esențiale pentru bunăstarea ta.

În relațiile tale, poți fi uneori prea sensibil sau dependent de aprobarea altora. Învață să îți stabilești limite sănătoase și să îți exprimi nevoile fără teamă. Scopul tău în viață este să aduci oamenii împreună, să rezolvi conflicte și să creezi armonie în toate aspectele vieții tale.

Punctele tale forte includ: empatie profundă, diplomație, capacitate de colaborare, intuiție puternică și talent pentru mediere. Provocările tale sunt: sensibilitate excesivă, dificultatea de a lua decizii, tendința de a evita conflictele și riscul de a-ți neglija propriile nevoi.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 3,
        title: "Creator Expresiv",
        description:
          "Ești artistic, optimist și ai un talent natural pentru comunicare și exprimare.",
        fullText: `Calea ta în viață este marcată de creativitate, exprimare și bucurie. Ești un artist în suflet, cu o imaginație bogată și o capacitate remarcabilă de a te exprima prin cuvinte, artă sau alte forme creative. Optimismul tău este contagios și aduci lumină în viețile celor din jur.

Personalitatea ta este caracterizată de entuziasm, sociabilitate și spontaneitate. Ai un talent natural pentru comunicare și știi cum să captivezi un public. Creativitatea ta se manifestă în tot ce faci - de la modul în care te îmbraci până la felul în care rezolvi problemele. Îți place să te distrezi și să aduci bucurie în lume.

În relațiile tale, poți fi uneori prea superficial sau dispersat. Învață să te concentrezi pe ceea ce este cu adevărat important și să dezvolți relații mai profunde. Scopul tău în viață este să inspiri pe alții prin creativitatea ta, să aduci bucurie și să te exprimi autentic în tot ce faci.

Punctele tale forte includ: creativitate abundentă, talent pentru comunicare, optimism natural, sociabilitate și capacitatea de a inspira pe alții. Provocările tale sunt: tendința de dispersare, dificultatea de concentrare, superficialitate și riscul de a nu finaliza proiectele începute.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 4,
        title: "Constructor Practic",
        description:
          "Ești disciplinat, organizat și ai un talent pentru a construi fundații solide.",
        fullText: `Calea ta în viață este marcată de stabilitate, disciplină și muncă asiduă. Ești un constructor natural, cu o capacitate remarcabilă de a crea structuri solide și durabile. Ai o minte practică și organizată, fiind mereu concentrat pe detalii și pe realizarea obiectivelor tale pas cu pas.

Personalitatea ta este caracterizată de responsabilitate, loialitate și perseverență. Ai o etică de muncă impresionantă și nu te dai bătut în fața obstacolelor. Îți place ordinea și predictibilitatea, iar ceilalți se pot baza pe tine în orice situație. Ești pragmatic și preferi soluțiile testate în timp.

În relațiile tale, poți fi uneori prea rigid sau rezistent la schimbare. Învață să fii mai flexibil și să accepți că nu totul poate fi controlat sau planificat. Scopul tău în viață este să construiești fundații solide pentru tine și pentru ceilalți, să creezi stabilitate și să lași o moștenire durabilă.

Punctele tale forte includ: disciplină puternică, organizare excelentă, loialitate, perseverență și capacitatea de a construi lucruri durabile. Provocările tale sunt: rigiditate, rezistență la schimbare, tendința de a fi prea serios și dificultatea de a te relaxa.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 5,
        title: "Aventurier Liber",
        description:
          "Ești adaptabil, curios și ai o dorință puternică de libertate și experiențe noi.",
        fullText: `Calea ta în viață este marcată de libertate, aventură și schimbare constantă. Ești un spirit liber, cu o curiozitate insațiabilă și o dorință puternică de a explora tot ce viața are de oferit. Adaptabilitatea ta remarcabilă te ajută să prosperi în orice situație nouă.

Personalitatea ta este caracterizată de versatilitate, energie și deschidere către nou. Îți place să călătorești, să cunoști oameni noi și să încerci lucruri diferite. Rutina te sufocă - ai nevoie de varietate și stimulare constantă. Ești un comunicator excelent și te adaptezi cu ușurință la orice mediu.

În relațiile tale, poți fi uneori prea neangajat sau instabil. Învață să găsești un echilibru între dorința ta de libertate și nevoia de conexiuni profunde. Scopul tău în viață este să experimentezi tot ce viața are de oferit, să îți folosești libertatea cu înțelepciune și să inspiri pe alții să își depășească limitele.

Punctele tale forte includ: adaptabilitate remarcabilă, curiozitate naturală, versatilitate, spirit aventuros și capacitatea de a te reinventa. Provocările tale sunt: instabilitate, dificultatea de angajament, tendința de dispersare și riscul de a fugi de responsabilități.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 6,
        title: "Protector Responsabil",
        description:
          "Ești armonios, responsabil și ai un talent natural pentru îngrijire și protecție.",
        fullText: `Calea ta în viață este marcată de responsabilitate, îngrijire și dorința de a crea armonie. Ești un protector natural, cu o capacitate remarcabilă de a îngriji și de a sprijini pe cei din jur. Familia și comunitatea sunt esențiale pentru tine, iar tu ești mereu prezent când cineva are nevoie.

Personalitatea ta este caracterizată de compasiune, generozitate și devotament. Ai un simț puternic al datoriei și îți asumi responsabilități cu seriozitate. Îți place să creezi un mediu frumos și armonios în jurul tău. Ești un consilier natural și oamenii vin la tine pentru sfaturi și sprijin.

În relațiile tale, poți fi uneori prea protector sau sacrificial. Învață să îți păstrezi propria identitate și să nu te pierzi în nevoile altora. Scopul tău în viață este să îngrijești și să protejezi pe cei dragi, să creezi armonie în familie și comunitate, și să oferi dragoste necondiționată.

Punctele tale forte includ: compasiune profundă, responsabilitate, talent pentru îngrijire, capacitate de a crea armonie și devotament față de cei dragi. Provocările tale sunt: tendința de a te sacrifica excesiv, dificultatea de a spune nu, perfecționism și riscul de a deveni controlant.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 7,
        title: "Căutător Spiritual",
        description:
          "Ești analitic, înțelept și ai o dorință profundă de cunoaștere și înțelegere.",
        fullText: `Calea ta în viață este marcată de căutare spirituală, analiză profundă și dorința de înțelegere. Ești un filosof natural, cu o minte analitică și o curiozitate profundă despre misterele vieții. Ai nevoie de timp pentru introspecție și contemplare pentru a-ți găsi pacea interioară.

Personalitatea ta este caracterizată de înțelepciune, intuiție și profunzime. Îți place să studiezi, să cercetezi și să înțelegi lucrurile la un nivel profund. Nu te mulțumești cu răspunsuri superficiale - vrei să ajungi la adevărul esențial. Ai o conexiune puternică cu spiritualitatea și lumea interioară.

În relațiile tale, poți fi uneori prea retras sau distant. Învață să îți deschizi inima și să împărtășești înțelepciunea ta cu ceilalți. Scopul tău în viață este să cauți adevărul, să dezvolți înțelepciune spirituală și să ajuți pe alții să găsească sens și înțelegere în viața lor.

Punctele tale forte includ: minte analitică puternică, intuiție profundă, înțelepciune spirituală, capacitate de introspecție și talent pentru cercetare. Provocările tale sunt: tendința de izolare, dificultatea de a te conecta emoțional, perfecționism intelectual și riscul de a te pierde în gânduri.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 8,
        title: "Realizator Ambițios",
        description:
          "Ești puternic, ambițios și ai un talent natural pentru afaceri și realizări materiale.",
        fullText: `Calea ta în viață este marcată de putere, succes material și realizări impresionante. Ești un lider în lumea afacerilor, cu o capacitate remarcabilă de a transforma viziunile în realitate. Ai o înțelegere naturală a banilor și a puterii, și știi cum să le folosești pentru a crea abundență.

Personalitatea ta este caracterizată de ambiție, determinare și autoritate naturală. Ai o energie puternică și o capacitate impresionantă de muncă. Îți place să construiești imperii și să lași o moștenire materială. Ești pragmatic și orientat spre rezultate, având mereu ochii pe obiectivele tale mari.

În relațiile tale, poți fi uneori prea concentrat pe muncă sau materialist. Învață să găsești echilibru între succes material și relații semnificative. Scopul tău în viață este să realizezi lucruri mari, să creezi abundență și să folosești puterea ta pentru a face bine în lume.

Punctele tale forte includ: capacitate de leadership în afaceri, determinare puternică, înțelegere a banilor și puterii, ambiție și talent pentru realizări materiale. Provocările tale sunt: tendința de workaholism, materialism excesiv, dificultatea de a delega și riscul de a neglija viața personală.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 9,
        title: "Umanitar Generos",
        description: "Ești generos, vizionar și ai o dorință puternică de a servi umanitatea.",
        fullText: `Calea ta în viață este marcată de compasiune universală, generozitate și dorința de a face lumea un loc mai bun. Ești un umanitar natural, cu o capacitate remarcabilă de a înțelege și de a empatiza cu suferința umană. Ai o viziune largă și te preocupă binele întregii umanități.

Personalitatea ta este caracterizată de altruism, înțelepciune și idealism. Ai o inimă mare și ești mereu gata să ajuți pe cei în nevoie. Ești un vizionar care vede dincolo de limitările prezentului și lucrezi pentru un viitor mai bun. Ai talent artistic și o sensibilitate profundă față de frumusețe și suferință.

În relațiile tale, poți fi uneori prea idealist sau dezamăgit de imperfecțiunile lumii. Învață să accepți limitările umane și să găsești bucurie în micile victorii. Scopul tău în viață este să servești umanitatea, să inspiri prin exemplul tău și să lași lumea mai bună decât ai găsit-o.

Punctele tale forte includ: compasiune universală, generozitate, viziune largă, talent artistic și capacitatea de a inspira schimbări pozitive. Provocările tale sunt: idealism excesiv, tendința de a te sacrifica prea mult, dificultatea de a pune limite și riscul de dezamăgire.`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Life Path Master Numbers (11, 22, 33)
    // ========================================================================

    const lifePathMasterData = [
      {
        type: "lifePath",
        number: 11,
        title: "Iluminat Spiritual",
        description:
          "Ești un maestru spiritual cu intuiție puternică și misiune de a inspira și ilumina.",
        fullText: `Calea ta în viață este marcată de o sensibilitate spirituală extraordinară și o intuiție profundă. Numărul 11 este primul Număr Maestru, purtând o vibrație spirituală intensă care te conectează cu planuri superioare de conștiință. Ești un canal pentru înțelepciune spirituală și ai misiunea de a ilumina calea altora.

Personalitatea ta este caracterizată de o sensibilitate extremă, viziuni profunde și o capacitate remarcabilă de a percepe adevăruri ascunse. Ai o intuiție puternică care te ghidează și te ajută să înțelegi lucruri pe care alții nu le văd. Ești un inspirator natural, iar prezența ta aduce claritate și lumină celor din jur. Ai potențialul de a fi un lider spiritual, un învățător sau un ghid pentru alții.

Provocările tale sunt semnificative - energia intensă a numărului 11 poate fi copleșitoare. Poți experimenta anxietate, nervozitate sau dificultăți în a te înrădăcina în realitatea practică. Sensibilitatea ta extremă te face vulnerabil la energiile negative din jur. Există riscul de a te simți incompris sau izolat din cauza naturii tale spirituale profunde.

În relațiile tale, ai nevoie de parteneri care să înțeleagă și să respecte natura ta spirituală. Poți fi uneori prea idealist sau detașat de realitatea practică. Învață să îți echilibrezi natura spirituală cu nevoile practice ale vieții cotidiene. Scopul tău în viață este să fii un far de lumină spirituală, să inspiri pe alții prin exemplul tău și să aduci înțelepciune superioară în lume.

Punctele tale forte includ: intuiție extraordinară, sensibilitate spirituală profundă, capacitate de a inspira și ilumina, viziune clară și conexiune cu planuri superioare. Provocările tale sunt: sensibilitate extremă, tendința de anxietate, dificultatea de a te înrădăcina în realitate, riscul de izolare și presiunea misiunii spirituale.

Notă: Deși numărul 11 se reduce la 2 (1+1=2), energia sa este mult mai intensă și poartă o responsabilitate spirituală mai mare. Dacă simți că energia numărului 11 este prea intensă, poți lucra și cu calitățile numărului 2 pentru echilibru.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 22,
        title: "Constructor Maestru",
        description:
          "Ești un vizionar practic cu capacitatea de a transforma vise în realitate la scară mare.",
        fullText: `Calea ta în viață este marcată de o combinație unică între viziune spirituală și abilitate practică extraordinară. Numărul 22 este cel mai puternic Număr Maestru, cunoscut ca "Constructorul Maestru". Ai capacitatea rară de a transforma vise și viziuni spirituale în realități concrete și durabile care pot schimba lumea.

Personalitatea ta este caracterizată de o combinație remarcabilă între idealismul spiritual și pragmatismul solid. Ai viziuni mari și îndrăznețe, dar spre deosebire de alți vizionari, tu ai și capacitatea practică de a le realiza. Ești un lider natural în proiecte mari, cu o capacitate impresionantă de organizare, planificare și execuție. Poți construi "imperii" - fie ele afaceri, organizații sau sisteme care servesc umanitatea.

Provocările tale sunt proporționale cu potențialul tău imens. Presiunea de a realiza lucruri mari poate fi copleșitoare. Riști să devii workaholic sau să te epuizezi în încercarea de a-ți manifesta viziunea. Există și pericolul de a te pierde în detaliile practice și de a uita de viziunea spirituală care te-a inspirat inițial. Așteptările înalte pe care le ai față de tine și de alții pot crea tensiune și dezamăgire.

În relațiile tale, ai nevoie de parteneri care să înțeleagă și să susțină misiunea ta de viață. Poți fi uneori prea concentrat pe obiective și să neglijezi nevoile emoționale ale celor dragi. Învață să găsești echilibru între realizările tale materiale și viața personală. Scopul tău în viață este să construiești ceva durabil și semnificativ care să servească binele comun și să lase o moștenire pozitivă pentru generațiile viitoare.

Punctele tale forte includ: viziune spirituală combinată cu abilitate practică, capacitate extraordinară de realizare, leadership în proiecte mari, organizare impecabilă și potențial de a schimba lumea. Provocările tale sunt: presiune enormă, risc de epuizare, tendința de workaholism, așteptări foarte înalte și dificultatea de a echilibra viața personală cu misiunea.

Notă: Deși numărul 22 se reduce la 4 (2+2=4), energia sa este mult mai amplificată. Dacă simți că responsabilitatea este prea mare, poți lucra temporar cu calitățile numărului 4 pentru a-ți construi fundații solide înainte de a îmbrățișa pe deplin energia numărului 22.`,
        createdAt: Date.now(),
      },
      {
        type: "lifePath",
        number: 33,
        title: "Învățător Maestru",
        description:
          "Ești un maestru al compasiunii cu misiunea de a vindeca și transforma prin dragoste universală.",
        fullText: `Calea ta în viață este marcată de compasiune universală, dragoste necondiționată și o misiune profundă de vindecare și transformare. Numărul 33 este cel mai rar și mai evoluat Număr Maestru, cunoscut ca "Învățătorul Maestru" sau "Maestrul Compasiunii". Ai venit în această viață cu o misiune spirituală profundă de a ridica conștiința umanității prin dragoste și serviciu.

Personalitatea ta este caracterizată de o capacitate extraordinară de compasiune, empatie și înțelegere. Ai o inimă imensă și o dorință profundă de a ajuta, vindeca și transforma viețile altora. Ești un învățător natural, nu prin cuvinte, ci prin exemplul tău de viață. Prezența ta aduce vindecare și transformare celor din jur. Ai potențialul de a fi un lider spiritual, un vindecător, un artist inspirațional sau un activist pentru cauze umanitare.

Provocările tale sunt intense și profunde. Energia numărului 33 este atât de puternică încât mulți oameni cu acest număr aleg să trăiască la nivelul numărului 6 (3+3=6) până când sunt pregătiți să își asume pe deplin misiunea. Riști să te sacrifici excesiv pentru alții și să îți neglijezi propriile nevoi. Sensibilitatea ta extremă la suferința din lume poate duce la epuizare emoțională sau depresie. Există pericolul de a deveni martir sau de a te pierde complet în serviciul față de alții.

În relațiile tale, ai nevoie de parteneri care să înțeleagă profunzimea misiunii tale spirituale și să te susțină fără a profita de natura ta generoasă. Poți fi uneori prea idealist sau dezamăgit de imperfecțiunile umane. Învață să îți stabilești limite sănătoase și să practici auto-îngrijirea. Scopul tău în viață este să fii un exemplu viu de dragoste necondiționată, să vindeci și să transformi prin compasiune, și să ridici conștiința colectivă a umanității.

Punctele tale forte includ: compasiune universală extraordinară, capacitate profundă de vindecare, dragoste necondiționată, talent pentru predare și inspirare, și potențial de transformare spirituală. Provocările tale sunt: risc major de sacrificiu excesiv, epuizare emoțională, tendința de a deveni martir, sensibilitate extremă la suferință și dificultatea de a pune limite.

Notă: Numărul 33 este extrem de rar și puțini oameni trăiesc la acest nivel vibrator. Dacă simți că energia este prea intensă, este perfect normal să lucrezi cu calitățile numărului 6 (3+3=6) până când ești pregătit să îmbrățișezi pe deplin misiunea numărului 33. Aceasta nu este o slăbiciune, ci o înțelepciune.`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Destiny Number Interpretations (1-9)
    // ========================================================================

    const destinyData = [
      {
        type: "destiny",
        number: 1,
        title: "Pionier și Inovator",
        description: "Ești destinat să conduci, să inovezi și să deschizi drumuri noi.",
        fullText: `Destinul tău este să fii un pionier, un inițiator de schimbări și un lider care deschide drumuri noi. Numele tău poartă energia independenței și a curajului de a fi primul. Ești chemat să îți urmezi propria viziune și să inspiri pe alții prin exemplul tău.

Misiunea ta în viață este să dezvolți încredere în sine și să îți asumi rolul de lider natural. Vei fi pus în situații care îți cer să iei inițiativa, să iei decizii importante și să îți asumi responsabilitatea pentru direcția ta în viață. Nu ești destinat să urmezi - ești destinat să conduci.

Provocările tale includ învățarea să echilibrezi independența cu colaborarea, să îți temperezi impulsivitatea și să dezvolți răbdare cu cei care nu se mișcă la fel de repede ca tine. Succesul tău vine când îți folosești energia de lider pentru a crea oportunități nu doar pentru tine, ci și pentru alții.

Realizarea destinului tău necesită curaj de a fi diferit, încredere în viziunea ta și determinare de a persevera chiar când alții îndoiesc. Ești aici să arăți că este posibil să îți creezi propriul drum și să reușești prin originalitate și inovație.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 2,
        title: "Mediator și Pacificator",
        description: "Ești destinat să aduci pace, echilibru și armonie în lume.",
        fullText: `Destinul tău este să fii un mediator, un pacificator și un creator de armonie. Numele tău poartă energia diplomației și a cooperării. Ești chemat să aduci oamenii împreună, să rezolvi conflicte și să creezi punți de înțelegere între persoane și grupuri.

Misiunea ta în viață este să dezvolți sensibilitate emoțională și să îți folosești intuiția pentru a înțelege nevoile altora. Vei fi pus în situații care îți cer să mediezi, să asculți cu empatie și să găsești soluții care să mulțumească pe toată lumea. Ești destinat să lucrezi în parteneriat și colaborare.

Provocările tale includ învățarea să îți stabilești limite sănătoase, să îți exprimi propriile nevoi fără teamă și să nu te pierzi în dorința de a face pe toată lumea fericită. Succesul tău vine când reușești să creezi armonie fără a-ți sacrifica propria identitate.

Realizarea destinului tău necesită dezvoltarea încrederii în intuiția ta, curajul de a fi vulnerabil și răbdarea de a lucra cu ritmul altora. Ești aici să arăți că pacea și cooperarea sunt mai puternice decât conflictul și competiția.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 3,
        title: "Artist și Comunicator",
        description: "Ești destinat să creezi, să te exprimi și să aduci bucurie în lume.",
        fullText: `Destinul tău este să fii un artist, un comunicator și un purtător de bucurie. Numele tău poartă energia creativității și a expresiei de sine. Ești chemat să îți folosești talentele creative pentru a inspira, a distra și a aduce lumină în viețile altora.

Misiunea ta în viață este să îți dezvolți și să îți exprimi creativitatea în toate formele ei - fie prin artă, cuvinte, muzică sau orice altă formă de exprimare. Vei fi pus în situații care îți cer să comunici, să creezi și să aduci optimism în lume. Ești destinat să fii o sursă de inspirație și bucurie.

Provocările tale includ învățarea să te concentrezi pe un singur proiect, să dezvolți disciplină în procesul creativ și să nu te dispersezi în prea multe direcții. Succesul tău vine când reușești să îți canalizezi energia creativă într-un mod productiv și semnificativ.

Realizarea destinului tău necesită curajul de a te exprima autentic, disciplina de a-ți perfecționa talentele și generozitatea de a împărtăși darurile tale cu lumea. Ești aici să arăți că creativitatea și bucuria sunt esențiale pentru o viață împlinită.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 4,
        title: "Constructor și Organizator",
        description: "Ești destinat să construiești fundații solide și să creezi stabilitate.",
        fullText: `Destinul tău este să fii un constructor, un organizator și un creator de structuri durabile. Numele tău poartă energia stabilității și a muncii asidue. Ești chemat să construiești fundații solide pentru tine și pentru alții, să creezi ordine din haos și să lași o moștenire durabilă.

Misiunea ta în viață este să dezvolți disciplină, organizare și o etică de muncă puternică. Vei fi pus în situații care îți cer să planifici, să organizezi și să construiești pas cu pas. Ești destinat să fii o piatră de temelie pe care alții se pot baza.

Provocările tale includ învățarea să fii mai flexibil, să accepți schimbarea și să nu devii prea rigid în abordările tale. Succesul tău vine când reușești să echilibrezi nevoia de structură cu capacitatea de a te adapta la circumstanțe noi.

Realizarea destinului tău necesită perseverență, răbdare și dedicare față de obiectivele tale pe termen lung. Ești aici să arăți că succesul durabil vine prin muncă asiduă, planificare atentă și construire solidă, pas cu pas.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 5,
        title: "Explorator și Agent al Schimbării",
        description: "Ești destinat să explorezi, să experimentezi și să aduci schimbare.",
        fullText: `Destinul tău este să fii un explorator, un agent al schimbării și un promotor al libertății. Numele tău poartă energia aventurii și a transformării. Ești chemat să experimentezi tot ce viața are de oferit, să aduci schimbare pozitivă și să inspiri pe alții să își depășească limitele.

Misiunea ta în viață este să îmbrățișezi schimbarea, să explorezi noi teritorii și să îți folosești versatilitatea pentru a te adapta la orice situație. Vei fi pus în situații care îți cer să fii flexibil, să comunici eficient și să promovezi progresul. Ești destinat să fii un catalizator al schimbării.

Provocările tale includ învățarea să găsești stabilitate în mijlocul schimbării, să te angajezi profund în relații și proiecte, și să nu fugi de responsabilități. Succesul tău vine când reușești să îți folosești libertatea cu înțelepciune și să aduci schimbări constructive.

Realizarea destinului tău necesită curajul de a ieși din zona de confort, deschiderea către experiențe noi și înțelepciunea de a învăța din fiecare aventură. Ești aici să arăți că viața este o călătorie de descoperire și că schimbarea este esențială pentru creștere.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 6,
        title: "Îngrijitor și Armonizator",
        description: "Ești destinat să îngrijești, să protejezi și să creezi armonie.",
        fullText: `Destinul tău este să fii un îngrijitor, un protector și un creator de armonie în familie și comunitate. Numele tău poartă energia responsabilității și a compasiunii. Ești chemat să oferi dragoste, sprijin și îngrijire celor din jur, și să creezi un mediu armonios pentru toți.

Misiunea ta în viață este să dezvolți capacitatea de a îngriji fără a te sacrifica excesiv, să creezi frumusețe și armonie în jurul tău, și să fii un consilier înțelept pentru cei care au nevoie. Vei fi pus în situații care îți cer să îți asumi responsabilități față de familie și comunitate.

Provocările tale includ învățarea să îți păstrezi propria identitate în timp ce îngrijești pe alții, să spui nu când este necesar și să nu devii controlant în dorința ta de a proteja. Succesul tău vine când reușești să oferi dragoste necondiționată fără a te pierde pe tine însuți.

Realizarea destinului tău necesită echilibru între a da și a primi, înțelepciunea de a ști când să ajuți și când să lași pe alții să învețe din propriile experiențe. Ești aici să arăți că dragostea, responsabilitatea și armonia sunt fundamentele unei vieți împlinite.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 7,
        title: "Înțelept și Căutător al Adevărului",
        description: "Ești destinat să cauți înțelepciune, adevăr și înțelegere profundă.",
        fullText: `Destinul tău este să fii un căutător al adevărului, un filosof și un ghid spiritual. Numele tău poartă energia înțelepciunii și a cunoașterii profunde. Ești chemat să explorezi misterele vieții, să dezvolți înțelegere spirituală și să împărtășești înțelepciunea ta cu cei pregătiți să o primească.

Misiunea ta în viață este să dezvolți o conexiune profundă cu lumea interioară, să studiezi și să înțelegi legile universale, și să ajuți pe alții să găsească sens și înțelegere. Vei fi pus în situații care îți cer să analizezi profund, să meditezi și să cauți adevărul dincolo de aparențe.

Provocările tale includ învățarea să îți deschizi inima și să te conectezi emoțional cu alții, să nu te izolezi în turnul tău de fildeș și să împărtășești înțelepciunea ta într-un mod accesibil. Succesul tău vine când reușești să echilibrezi viața interioară cu cea exterioară.

Realizarea destinului tău necesită dedicare față de căutarea adevărului, curajul de a pune întrebări profunde și răbdarea de a aștepta răspunsurile. Ești aici să arăți că înțelepciunea și înțelegerea spirituală sunt esențiale pentru evoluția umană.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 8,
        title: "Magnat și Realizator",
        description: "Ești destinat să realizezi lucruri mari și să creezi abundență.",
        fullText: `Destinul tău este să fii un magnat, un realizator de lucruri mari și un creator de abundență materială. Numele tău poartă energia puterii și a succesului. Ești chemat să construiești imperii, să transformi viziuni în realitate și să folosești puterea ta pentru a face bine în lume.

Misiunea ta în viață este să dezvolți abilități de leadership în afaceri, să înțelegi și să gestionezi resurse materiale și să creezi prosperitate nu doar pentru tine, ci și pentru alții. Vei fi pus în situații care îți cer să iei decizii importante, să gestionezi putere și să realizezi obiective ambițioase.

Provocările tale includ învățarea să echilibrezi succesul material cu viața personală, să folosești puterea cu înțelepciune și compasiune, și să nu devii obsedat de bani și statut. Succesul tău vine când reușești să creezi abundență în mod etic și să o folosești pentru binele comun.

Realizarea destinului tău necesită ambiție temperată cu integritate, determinare combinată cu compasiune și putere folosită cu responsabilitate. Ești aici să arăți că succesul material și spiritual pot merge mână în mână și că abundența poate fi o forță pentru bine.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 9,
        title: "Filantrop și Transformator",
        description: "Ești destinat să servești umanitatea și să transformi lumea.",
        fullText: `Destinul tău este să fii un filantrop, un umanitar și un transformator al lumii. Numele tău poartă energia compasiunii universale și a serviciului. Ești chemat să servești umanitatea, să lupți pentru cauze nobile și să lași lumea mai bună decât ai găsit-o.

Misiunea ta în viață este să dezvolți compasiune pentru toată omenirea, să îți folosești talentele pentru a ajuta pe cei în nevoie și să inspiri schimbări pozitive la scară largă. Vei fi pus în situații care îți cer să te ridici deasupra intereselor personale și să lucrezi pentru binele comun.

Provocările tale includ învățarea să accepți imperfecțiunile umane, să nu te dezamăgești când lumea nu se schimbă atât de repede pe cât ai dori și să îți păstrezi echilibrul emoțional în fața suferinței. Succesul tău vine când reușești să faci diferența fără a te epuiza complet.

Realizarea destinului tău necesită o inimă deschisă, o viziune largă și curajul de a acționa pentru convingerile tale. Ești aici să arăți că fiecare dintre noi poate face o diferență și că serviciul față de umanitate este cea mai înaltă formă de realizare.`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Destiny Master Numbers (11, 22, 33)
    // ========================================================================

    const destinyMasterData = [
      {
        type: "destiny",
        number: 11,
        title: "Mesager Spiritual",
        description: "Ești destinat să transmiți înțelepciune spirituală și să inspiri iluminare.",
        fullText: `Destinul tău este să fii un mesager spiritual, un canal pentru înțelepciune superioară și un inspirator al conștiinței elevate. Numele tău poartă vibrația numărului 11, cel mai intuitiv și spiritual dintre toate numerele. Ești chemat să aduci lumină spirituală în lume și să ajuți pe alții să se trezească la adevărul lor interior.

Misiunea ta în viață este să dezvolți și să îți folosești intuiția extraordinară pentru a ghida și inspira pe alții. Vei fi pus în situații care îți cer să fii un exemplu de viață spirituală, să transmiți mesaje de înțelepciune și să ajuți pe alții să își găsească calea spirituală. Ești destinat să fii un far de lumină într-o lume care are nevoie de iluminare.

Provocările tale includ gestionarea sensibilității extreme și a presiunii de a trăi la un standard spiritual înalt. Riști să te simți copleșit de intensitatea percepțiilor tale sau izolat din cauza naturii tale spirituale profunde. Învață să îți înrădăcinezi energia spirituală în realitatea practică și să găsești modalități de a împărtăși darurile tale fără a te epuiza.

Realizarea destinului tău necesită curajul de a îmbrățișa natura ta spirituală unică, disciplina de a-ți dezvolta darurile intuitive și înțelepciunea de a ști când și cum să împărtășești mesajele tale. Ești aici să arăți că spiritualitatea și intuiția sunt puteri reale care pot transforma viețile și lumea. Misiunea ta este să inspiri trezirea spirituală și să ajuți umanitatea să evolueze către o conștiință mai înaltă.

Notă: Energia numărului 11 este intensă. Dacă simți că este prea mult, poți lucra și cu calitățile numărului 2 (1+1=2) pentru echilibru, concentrându-te pe diplomație și cooperare până când ești pregătit să îmbrățișezi pe deplin misiunea spirituală a numărului 11.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 22,
        title: "Arhitect al Schimbării Globale",
        description: "Ești destinat să construiești sisteme și structuri care transformă lumea.",
        fullText: `Destinul tău este să fii un arhitect al schimbării globale, un constructor de sisteme și structuri care pot transforma societatea și servi umanitatea la scară largă. Numele tău poartă vibrația numărului 22, cel mai puternic număr pentru manifestare materială a viziunilor spirituale. Ești chemat să construiești ceva durabil și semnificativ care va avea impact asupra generațiilor viitoare.

Misiunea ta în viață este să combini viziunea spirituală cu abilitatea practică pentru a crea schimbare reală și tangibilă în lume. Vei fi pus în situații care îți cer să conduci proiecte mari, să organizezi sisteme complexe și să transformi idei îndrăznețe în realități concrete. Ești destinat să fii un lider vizionar care nu doar visează, ci și realizează.

Provocările tale includ gestionarea presiunii enorme de a realiza lucruri mari și riscul de a te epuiza în procesul de manifestare a viziunii tale. Poți deveni obsedat de obiective și să neglijezi echilibrul în viață. Învață să îți păstrezi viziunea spirituală în timp ce lucrezi cu realitățile practice și să îți îngrijești sănătatea fizică și emoțională în procesul de realizare.

Realizarea destinului tău necesită o combinație rară de viziune înaltă și pragmatism solid, de idealism spiritual și abilitate practică, de ambiție și umilință. Ești aici să arăți că este posibil să construiești "raiul pe pământ" - să creezi sisteme, organizații sau structuri care servesc binele comun și îmbunătățesc viața multor oameni. Misiunea ta este să lași o moștenire durabilă care va continua să servească umanitatea mult timp după ce vei pleca.

Notă: Energia numărului 22 este extraordinar de puternică și vine cu responsabilități mari. Dacă simți că presiunea este prea mare, poți lucra temporar cu calitățile numărului 4 (2+2=4) pentru a construi fundații solide înainte de a îmbrățișa pe deplin misiunea numărului 22.`,
        createdAt: Date.now(),
      },
      {
        type: "destiny",
        number: 33,
        title: "Avatar al Dragostei Universale",
        description:
          "Ești destinat să încarni și să răspândești dragoste necondiționată și compasiune universală.",
        fullText: `Destinul tău este să fii un avatar al dragostei universale, un vindecător al sufletelor și un transformator al conștiinței umane prin compasiune pură. Numele tău poartă vibrația numărului 33, cel mai evoluat și mai rar Număr Maestru. Ești chemat să încarni dragostea necondiționată și să servești ca un exemplu viu de compasiune, sacrificiu și transformare spirituală.

Misiunea ta în viață este să ridici conștiința umanității prin dragoste, să vindeci suferința prin compasiune și să transformi lumea prin serviciu dezinteresat. Vei fi pus în situații care îți cer să oferi dragoste necondiționată, să vindeci răni profunde și să inspiri transformare spirituală în cei din jur. Ești destinat să fii un învățător maestru, nu prin cuvinte, ci prin însăși viața ta.

Provocările tale sunt profunde și intense. Riști să te sacrifici complet pentru alții și să îți pierzi propria identitate în procesul de servire. Sensibilitatea ta extremă la suferința din lume poate duce la epuizare spirituală și emoțională. Există pericolul de a deveni martir sau de a fi exploatat de cei care nu înțeleg sau nu respectă natura ta sacră. Învață să îți stabilești limite sănătoase și să practici auto-compasiunea în timp ce servești pe alții.

Realizarea destinului tău necesită o maturitate spirituală extraordinară, o capacitate profundă de iertare și o înțelegere că adevărata servire începe cu iubirea de sine. Ești aici să arăți că dragostea necondiționată este cea mai puternică forță din univers și că prin compasiune autentică putem transforma nu doar indivizi, ci întreaga umanitate. Misiunea ta este să fii un far de lumină divină într-o lume care are nevoie disperată de dragoste și vindecare.

Notă: Numărul 33 este extrem de rar și puțini oameni sunt pregătiți să trăiască la acest nivel vibrator. Este perfect normal și înțelept să lucrezi cu calitățile numărului 6 (3+3=6) până când ești pregătit spiritual, emoțional și fizic să îmbrățișezi pe deplin misiunea sacră a numărului 33. Aceasta nu este o eșec, ci o cale graduală de pregătire pentru o responsabilitate spirituală imensă.`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Compatibility Interpretations (by score range)
    // ========================================================================

    const compatibilityData = [
      {
        type: "compatibility",
        number: 100, // Represents 76-100 range (excellent)
        title: "Compatibilitate Excelentă",
        description: "Aveți o conexiune puternică și armonioasă, cu potențial extraordinar.",
        fullText: `Compatibilitatea voastră numerologică este excepțională! Numerele voastre vibrează în armonie perfectă, creând o bază solidă pentru o relație profundă și împlinitoare. Această conexiune specială indică o înțelegere naturală și o rezonanță puternică între voi.

Punctele forte ale relației voastre includ comunicare excelentă, valori comune și o capacitate naturală de a vă susține reciproc în visurile și aspirațiile voastre. Vă completați unul pe celălalt într-un mod care aduce echilibru și armonie în viața voastră împreună. Energia voastră combinată creează ceva mai mare decât suma părților.

Pentru a menține și a aprofunda această conexiune specială, continuați să vă ascultați unul pe celălalt cu atenție, să vă respectați diferențele și să celebrați asemănările. Investiți timp în a vă cunoaște la un nivel și mai profund și în a construi amintiri împreună. Această relație are potențialul de a fi o sursă de bucurie și creștere pentru amândoi.

Provocările pe care le-ați putea întâmpina sunt minore și pot fi ușor depășite prin comunicare deschisă și respect reciproc. Cheia succesului vostru este să nu luați această conexiune specială de-a gata - continuați să o hrăniți și să o prețuiți. Cu efort conștient și dragoste, această relație poate deveni un model de parteneriat armonios.`,
        createdAt: Date.now(),
      },
      {
        type: "compatibility",
        number: 75, // Represents 51-75 range (good)
        title: "Compatibilitate Bună",
        description: "Aveți potențial pentru o relație echilibrată și împlinitoare.",
        fullText: `Compatibilitatea voastră numerologică este bună și promițătoare! Numerele voastre se completează într-un mod pozitiv, oferind o bază solidă pentru o relație sănătoasă și echilibrată. Deși nu este o potrivire perfectă, aveți toate ingredientele necesare pentru o parteneriat de succes.

Punctele forte ale relației voastre includ respect reciproc, capacitatea de a învăța unul de la celălalt și o chimie pozitivă care vă face să vă simțiți bine împreună. Diferențele voastre, în loc să vă despartă, vă pot îmbogăți viața dacă le abordați cu deschidere și curiozitate. Aveți potențialul de a vă ajuta reciproc să creșteți și să evoluați.

Pentru a construi o relație puternică, concentrați-vă pe comunicare deschisă și onestă. Învățați să apreciați perspectivele diferite ale celuilalt și să găsiți compromisuri când este necesar. Investiți timp în a vă înțelege nevoile și dorințele reciproce, și fiți dispuși să vă adaptați și să creșteți împreună.

Provocările pe care le-ați putea întâmpina includ diferențe în stilul de comunicare sau în prioritățile de viață. Cheia este să abordați aceste diferențe ca oportunități de creștere, nu ca obstacole. Cu efort conștient, răbdare și angajament reciproc, puteți construi o relație profundă și satisfăcătoare care să reziste testului timpului.`,
        createdAt: Date.now(),
      },
      {
        type: "compatibility",
        number: 50, // Represents 26-50 range (medium)
        title: "Compatibilitate Medie",
        description: "Relația necesită efort și înțelegere reciprocă pentru a prospera.",
        fullText: `Compatibilitatea voastră numerologică este moderată, indicând că relația voastră va necesita efort conștient și înțelegere reciprocă pentru a prospera. Numerele voastre au atât puncte de conexiune, cât și zone de potențial conflict, ceea ce înseamnă că succesul relației depinde în mare măsură de angajamentul vostru de a lucra împreună.

Punctele forte ale relației voastre pot include atracție inițială puternică și potențialul de a învăța lecții importante unul de la celălalt. Diferențele voastre, deși provocatoare, vă pot ajuta să vă extindeți perspectivele și să creșteți ca indivizi. Cheia este să vedeți aceste diferențe ca oportunități de dezvoltare personală.

Pentru ca relația să funcționeze, va fi esențial să dezvoltați abilități puternice de comunicare și să fiți dispuși să faceți compromisuri. Trebuie să vă respectați diferențele și să găsiți modalități de a vă susține reciproc, chiar când nu înțelegeți complet perspectiva celuilalt. Răbdarea, empatia și dorința de a înțelege sunt cruciale.

Provocările pe care le veți întâmpina pot include conflicte frecvente, dificultăți în înțelegerea nevoilor celuilalt și tendința de a vă frustra reciproc. Este important să decideți împreună dacă sunteți dispuși să investiți energia necesară pentru a depăși aceste obstacole. Cu muncă dedicată, consiliere dacă este necesar și un angajament ferm, puteți construi o relație funcțională, dar va necesita efort constant din partea ambilor.`,
        createdAt: Date.now(),
      },
      {
        type: "compatibility",
        number: 25, // Represents 0-25 range (low)
        title: "Compatibilitate Scăzută",
        description: "Relația este provocatoare și necesită multă muncă și compromis.",
        fullText: `Compatibilitatea voastră numerologică este scăzută, indicând diferențe fundamentale în modul în care vibrați și abordați viața. Numerele voastre sugerează că veți întâmpina provocări semnificative în relație și că va fi nevoie de multă muncă, compromis și înțelegere pentru a face relația să funcționeze.

Este important să înțelegeți că o compatibilitate numerologică scăzută nu înseamnă că relația este imposibilă, ci că va fi mai dificilă decât alte relații. Veți avea nevoie de un angajament excepțional, comunicare excelentă și dorința de a vă adapta constant pentru a depăși diferențele voastre fundamentale.

Provocările pe care le veți întâmpina pot include conflicte frecvente, dificultăți majore în înțelegerea perspectivelor celuilalt, valori și priorități foarte diferite, și o tendință de a vă frustra sau dezamăgi reciproc. Este posibil să simțiți că "vorbiți limbi diferite" sau că trebuie să vă schimbați fundamental pentru a face relația să funcționeze.

Înainte de a continua, este crucial să vă întrebați dacă amândoi sunteți dispuși să investiți energia enormă necesară pentru a face această relație să funcționeze. Dacă decideți să continuați, luați în considerare consiliere de cuplu profesională și fiți pregătiți pentru o muncă constantă. Uneori, cea mai înțeleaptă decizie este să recunoașteți incompatibilitatea și să căutați parteneri mai potriviți cu care conexiunea vine mai natural.`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Daily Number Interpretations (1-9)
    // ========================================================================

    const dailyData = [
      {
        type: "daily",
        number: 1,
        title: "Zi de Inițiativă și Leadership",
        description: "Astăzi este ziua perfectă pentru a începe proiecte noi și a lua inițiativa.",
        fullText: `Astăzi, energia numărului 1 îți oferă curaj, determinare și dorința de a conduce. Este o zi excelentă pentru a începe proiecte noi, a lua inițiativa în situații importante și a-ți afirma independența. Universul te susține să fii curajos și să îți urmezi propriul drum.

Ce este favorabil astăzi: Începerea de proiecte noi, luarea de decizii importante, afirmarea ta ca lider, acțiuni independente, inovație și creativitate. Este momentul perfect să îți asumi riscuri calculate și să îți urmezi intuiția în direcții noi.

Pe ce să te concentrezi: Fii curajos și ia inițiativa în situațiile care îți cer atenția. Ascultă-ți vocea interioară și nu te teme să fii diferit. Concentrează-te pe obiectivele tale personale și nu lăsa pe alții să îți dicteze direcția. Este ziua ta să strălucești ca individ unic.

Ce să eviți: Evită să fii prea autoritar sau impulsiv. Nu lua decizii importante în grabă sau din ego. Fii atent să nu ignori complet părerile altora sau să devii prea egocentric. Balansează-ți independența cu respectul pentru cei din jur.

Sfat pentru ziua de astăzi: Începe ziua cu o intenție clară despre ce vrei să realizezi. Fii proactiv, nu reactiv. Acest este momentul tău să conduci și să creezi - folosește-l cu înțelepciune!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 2,
        title: "Zi de Cooperare și Armonie",
        description:
          "Astăzi este ziua perfectă pentru colaborare, diplomație și construirea de relații.",
        fullText: `Astăzi, energia numărului 2 îți aduce sensibilitate, intuiție și dorința de armonie. Este o zi excelentă pentru a lucra în echipă, a rezolva conflicte și a construi relații mai profunde. Universul te încurajează să fii diplomat și să cauți echilibru în toate aspectele vieții tale.

Ce este favorabil astăzi: Colaborarea cu alții, medierea conflictelor, ascultarea activă, construirea de parteneriate, activități în echipă și exprimarea emoțiilor. Este momentul perfect să îți folosești empatia și să creezi conexiuni autentice.

Pe ce să te concentrezi: Fii un ascultător atent și încearcă să înțelegi perspectivele altora. Caută modalități de a crea armonie în relațiile tale și de a rezolva tensiunile existente. Concentrează-te pe cooperare în loc de competiție și pe compromis în loc de conflict.

Ce să eviți: Evită să fii prea sensibil la criticile altora sau să îți pierzi identitatea în dorința de a face pe toată lumea fericită. Nu lua decizii importante doar pentru a evita conflictele. Fii atent să nu devii dependent de aprobarea altora.

Sfat pentru ziua de astăzi: Ascultă-ți intuiția și fii deschis la colaborare. Această zi îți oferă oportunitatea de a întări relațiile importante și de a crea armonie în jurul tău. Fii blând cu tine și cu ceilalți.`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 3,
        title: "Zi de Creativitate și Exprimare",
        description: "Astăzi este ziua perfectă pentru exprimare creativă, comunicare și bucurie.",
        fullText: `Astăzi, energia numărului 3 îți aduce creativitate, optimism și dorința de a te exprima. Este o zi excelentă pentru activități artistice, comunicare deschisă și pentru a aduce bucurie în viața ta și a altora. Universul te încurajează să îți exprimi autenticitatea și să te distrezi.

Ce este favorabil astăzi: Activități creative (artă, scriere, muzică), comunicare deschisă, socializare, exprimarea emoțiilor, activități distractive și împărtășirea ideilor tale. Este momentul perfect să îți lași imaginația să zboare.

Pe ce să te concentrezi: Exprimă-te autentic și nu te teme să îți arăți creativitatea. Comunică deschis cu cei din jur și împărtășește-ți ideile și sentimentele. Concentrează-te pe a aduce bucurie și optimism în tot ce faci astăzi.

Ce să eviți: Evită să te dispersezi în prea multe direcții sau să începi proiecte pe care nu le vei finaliza. Nu fi superficial în relațiile tale - caută profunzime în mijlocul distracției. Fii atent să nu exagerezi sau să devii prea dramatic.

Sfat pentru ziua de astăzi: Lasă-ți creativitatea să curgă liber și nu te judeca. Această zi îți oferă oportunitatea de a te exprima într-un mod unic și de a aduce lumină în lume. Bucură-te de proces, nu doar de rezultat!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 4,
        title: "Zi de Organizare și Muncă",
        description:
          "Astăzi este ziua perfectă pentru planificare, organizare și muncă productivă.",
        fullText: `Astăzi, energia numărului 4 îți aduce disciplină, concentrare și dorința de a construi ceva solid. Este o zi excelentă pentru organizare, planificare și muncă asiduă. Universul te susține să pui bazele pentru succesul viitor prin efort constant și atenție la detalii.

Ce este favorabil astăzi: Organizarea spațiului și timpului, planificarea pe termen lung, munca la proiecte importante, stabilirea de rutine sănătoase, rezolvarea de probleme practice și construirea de fundații solide. Este momentul perfect pentru productivitate.

Pe ce să te concentrezi: Fii disciplinat și metodic în abordarea sarcinilor tale. Concentrează-te pe detalii și pe calitatea muncii tale. Stabilește obiective clare și lucrează constant spre realizarea lor. Construiește pas cu pas, fără să te grăbești.

Ce să eviți: Evită să fii prea rigid sau rezistent la schimbare. Nu te pierde în detalii până la punctul în care pierzi imaginea de ansamblu. Fii atent să nu devii workaholic sau să ignori nevoile tale de relaxare și distracție.

Sfat pentru ziua de astăzi: Fă o listă cu prioritățile tale și lucrează sistematic la fiecare. Această zi îți oferă energia necesară pentru a face progrese semnificative în proiectele tale importante. Fii răbdător și persistent!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 5,
        title: "Zi de Aventură și Schimbare",
        description: "Astăzi este ziua perfectă pentru experiențe noi, aventură și adaptare.",
        fullText: `Astăzi, energia numărului 5 îți aduce libertate, aventură și dorința de schimbare. Este o zi excelentă pentru a încerca lucruri noi, a ieși din zona de confort și a te adapta la circumstanțe noi. Universul te încurajează să îmbrățișezi schimbarea și să explorezi posibilități noi.

Ce este favorabil astăzi: Încercarea de experiențe noi, călătorii (chiar și scurte), întâlniri cu oameni noi, învățarea de lucruri noi, adaptarea la schimbări și explorarea de oportunități neașteptate. Este momentul perfect pentru spontaneitate.

Pe ce să te concentrezi: Fii deschis la oportunități neașteptate și flexibil în planurile tale. Îmbrățișează schimbarea în loc să o reziști. Concentrează-te pe a învăța ceva nou sau pe a experimenta ceva diferit. Lasă-te purtat de curiozitatea ta naturală.

Ce să eviți: Evită să fii prea impulsiv sau iresponsabil în deciziile tale. Nu neglija responsabilitățile importante în căutarea aventurii. Fii atent să nu te dispersezi în prea multe direcții fără să finalizezi nimic.

Sfat pentru ziua de astăzi: Spune da la o oportunitate neașteptată sau încearcă ceva ce nu ai mai făcut înainte. Această zi îți oferă energia necesară pentru a ieși din rutină și a descoperi noi posibilități. Fii curajos și aventuros!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 6,
        title: "Zi de Familie și Responsabilitate",
        description: "Astăzi este ziua perfectă pentru familie, îngrijire și crearea de armonie.",
        fullText: `Astăzi, energia numărului 6 îți aduce compasiune, responsabilitate și dorința de a îngriji pe cei dragi. Este o zi excelentă pentru familie, pentru a crea armonie în casa ta și pentru a oferi sprijin celor care au nevoie. Universul te încurajează să îți asumi responsabilitățile cu dragoste.

Ce este favorabil astăzi: Petrecerea timpului cu familia, îngrijirea casei, oferirea de sprijin celor dragi, crearea de armonie în relații, activități de voluntariat și exprimarea dragostei față de cei apropiați. Este momentul perfect pentru a hrăni relațiile importante.

Pe ce să te concentrezi: Fii prezent pentru cei dragi și oferă-le atenția și sprijinul de care au nevoie. Concentrează-te pe crearea unui mediu armonios și frumos în jurul tău. Exprimă-ți dragostea și aprecierea față de cei importanți din viața ta.

Ce să eviți: Evită să te sacrifici excesiv sau să îți neglijezi propriile nevoi în timp ce îngrijești pe alții. Nu deveni controlant în dorința ta de a proteja. Fii atent să nu îți asumi responsabilități care nu îți aparțin.

Sfat pentru ziua de astăzi: Fă ceva special pentru cineva drag sau petrece timp de calitate cu familia. Această zi îți oferă oportunitatea de a întări legăturile importante și de a crea amintiri frumoase. Oferă dragoste, dar nu uita să o primești și tu!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 7,
        title: "Zi de Introspecție și Înțelepciune",
        description: "Astăzi este ziua perfectă pentru meditație, studiu și căutare interioară.",
        fullText: `Astăzi, energia numărului 7 îți aduce dorința de introspecție, înțelegere profundă și conexiune spirituală. Este o zi excelentă pentru meditație, studiu, analiză și pentru a te conecta cu lumea ta interioară. Universul te încurajează să cauți răspunsuri în interior și să dezvolți înțelepciune.

Ce este favorabil astăzi: Meditația, studiul, cititul, analiza profundă, petrecerea timpului în natură, activități spirituale și reflecția asupra vieții tale. Este momentul perfect pentru a te conecta cu esența ta și a căuta înțelegere profundă.

Pe ce să te concentrezi: Ascultă-ți vocea interioară și acordă-ți timp pentru introspecție. Concentrează-te pe întrebările importante din viața ta și caută răspunsuri în interior. Dezvoltă-ți înțelepciunea prin studiu și contemplare.

Ce să eviți: Evită să te izolezi complet sau să devii prea retras. Nu te pierde în analize excesive până la punctul în care te paralizezi. Fii atent să nu devii prea critic sau perfecționist cu tine însuți sau cu alții.

Sfat pentru ziua de astăzi: Acordă-ți timp pentru liniște și reflecție. Această zi îți oferă oportunitatea de a te conecta cu înțelepciunea ta interioară și de a găsi claritate. Fii răbdător cu procesul de descoperire interioară!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 8,
        title: "Zi de Realizări și Succes",
        description:
          "Astăzi este ziua perfectă pentru afaceri, realizări și manifestarea abundenței.",
        fullText: `Astăzi, energia numărului 8 îți aduce putere, ambiție și capacitatea de a realiza lucruri mari. Este o zi excelentă pentru afaceri, pentru a lua decizii importante legate de carieră sau finanțe, și pentru a-ți manifesta obiectivele materiale. Universul te susține să îți asumi puterea și să creezi abundență.

Ce este favorabil astăzi: Negocieri de afaceri, decizii financiare importante, avansarea în carieră, stabilirea de obiective ambițioase, demonstrarea de leadership și luarea de măsuri concrete pentru succesul tău material. Este momentul perfect pentru acțiune decisivă.

Pe ce să te concentrezi: Fii ambițios și nu te teme să îți asumi puterea. Concentrează-te pe obiectivele tale materiale și ia măsuri concrete pentru realizarea lor. Gândește strategic și pe termen lung. Folosește-ți autoritatea cu înțelepciune și integritate.

Ce să eviți: Evită să devii obsedat de bani sau putere. Nu neglija relațiile personale în căutarea succesului material. Fii atent să nu devii autoritar sau să folosești puterea în mod abuziv. Balansează ambiția cu compasiunea.

Sfat pentru ziua de astăzi: Ia o decizie importantă legată de cariera sau finanțele tale. Această zi îți oferă energia și claritatea necesare pentru a face pași mari spre succesul tău material. Fii curajos și strategic!`,
        createdAt: Date.now(),
      },
      {
        type: "daily",
        number: 9,
        title: "Zi de Compasiune și Serviciu",
        description:
          "Astăzi este ziua perfectă pentru generozitate, compasiune și serviciu față de alții.",
        fullText: `Astăzi, energia numărului 9 îți aduce compasiune universală, generozitate și dorința de a face bine în lume. Este o zi excelentă pentru a ajuta pe alții, pentru a te implica în cauze nobile și pentru a-ți exprima latura umanitară. Universul te încurajează să gândești dincolo de tine și să contribui la binele comun.

Ce este favorabil astăzi: Voluntariatul, ajutorarea celor în nevoie, implicarea în cauze sociale, actele de generozitate, iertarea și lăsarea în urmă a trecutului. Este momentul perfect pentru a face o diferență pozitivă în viața altora.

Pe ce să te concentrezi: Fii generos cu timpul, energia și resursele tale. Concentrează-te pe cum poți contribui la binele comun și la ameliorarea suferinței din jurul tău. Practică compasiunea și înțelegerea față de toți, inclusiv față de tine însuți.

Ce să eviți: Evită să te sacrifici excesiv sau să îți neglijezi propriile nevoi în timp ce ajuți pe alții. Nu deveni martir sau să te aștepți la recunoștință pentru generozitatea ta. Fii atent să nu te dezamăgești când lumea nu se schimbă atât de repede pe cât ai dori.

Sfat pentru ziua de astăzi: Fă un act de bunătate fără să aștepți nimic în schimb. Această zi îți oferă oportunitatea de a face o diferență reală în viața cuiva și de a-ți exprima compasiunea. Fii lumina pe care vrei să o vezi în lume!`,
        createdAt: Date.now(),
      },
    ];

    // ========================================================================
    // Insert all interpretations into database
    // ========================================================================

    const allInterpretations = [
      ...lifePathData,
      ...lifePathMasterData,
      ...destinyData,
      ...destinyMasterData,
      ...compatibilityData,
      ...dailyData,
    ];

    let insertedCount = 0;

    for (const interpretation of allInterpretations) {
      await ctx.db.insert("interpretations", interpretation);
      insertedCount++;
    }

    return {
      success: true,
      message: `S-au adăugat cu succes ${insertedCount} interpretări în baza de date`,
      details: {
        lifePath: lifePathData.length,
        lifePathMaster: lifePathMasterData.length,
        destiny: destinyData.length,
        destinyMaster: destinyMasterData.length,
        compatibility: compatibilityData.length,
        daily: dailyData.length,
        total: insertedCount,
      },
    };
  },
});
