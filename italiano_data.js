/* ═══════════════════════════════════════════════════════════════════
   italiano_data.js — كل داتا التطبيق (v6 — Contextual Mapping)
   ═══════════════════════════════════════════════════════════════════ */

const STORAGE_KEY='it_daily_v2';

/* ── Modifiers — ظروف زمنية تُضاف للجمل عشوائياً ── */
const MODIFIERS=['ogni giorno','spesso','stasera','al mattino'];
const MOD_AR={
  'ogni giorno':'كل يوم',
  'spesso':'كثيراً',
  'stasera':'الليلة',
  'al mattino':'في الصباح'
};

/* ── ظروف زمنية موسعة من الكتاب ── */
const BOOK_TIME_WORDS = [
  { it: 'lunedì',             ar: 'الإثنين',               type: 'giorno' },
  { it: 'martedì',            ar: 'الثلاثاء',              type: 'giorno' },
  { it: 'mercoledì',          ar: 'الأربعاء',              type: 'giorno' },
  { it: 'giovedì',            ar: 'الخميس',                type: 'giorno' },
  { it: 'venerdì',            ar: 'الجمعة',                type: 'giorno' },
  { it: 'sabato',             ar: 'السبت',                 type: 'giorno' },
  { it: 'domenica',           ar: 'الأحد',                 type: 'giorno' },
  { it: 'il fine settimana',  ar: 'عطلة نهاية الأسبوع',   type: 'periodo' },
  { it: 'prima',              ar: 'قبل',                   type: 'avverbio' },
  { it: 'dopo',               ar: 'بعد',                   type: 'avverbio' },
  { it: 'presto',             ar: 'مبكراً',                type: 'avverbio' },
  { it: 'tardi',              ar: 'متأخراً',               type: 'avverbio' },
  { it: "all'inizio",         ar: 'في البداية',            type: 'avverbio' },
  { it: 'alla fine',          ar: 'في النهاية',            type: 'avverbio' }
];

/* ── تصنيفات الأفعال ── */
/*
  SEMI_REGULAR: أفعال ذات تغيير إملائي — موجودة في IRREGULAR_PRESENT لأن getConjugation
  تحتاج التصريف الصحيح، لكنها ليست شاذة بالمعنى الحقيقي
  - -iare (studiare, mangiare): لا تضعيف i+i → studi لا studii
  - -care (giocare, comunicare): تضيف h قبل i/e للحفاظ على النطق
  - -gare (navigare, bloggare): تضيف h قبل i/e للحفاظ على النطق
*/
const SEMI_REGULAR=['mangiare','giocare','comunicare','navigare','bloggare','studiare'];

const IRREGULAR_ALL=new Set(['andare','fare','venire','dire','vedere','prendere','leggere','bere','scrivere','uscire','aprire','chiudere','rimanere','vivere','stare','morire','scendere','crescere','succedere','volere','potere','dovere','sapere','salire','capire','preferire']);

/* تصريف المضارع للأفعال الشاذة — [io,tu,lui/lei,noi,voi,loro] */
const IRREGULAR_PRESENT={
  andare:    ['vado','vai','va','andiamo','andate','vanno'],
  fare:      ['faccio','fai','fa','facciamo','fate','fanno'],
  venire:    ['vengo','vieni','viene','veniamo','venite','vengono'],
  dire:      ['dico','dici','dice','diciamo','dite','dicono'],
  uscire:    ['esco','esci','esce','usciamo','uscite','escono'],
  stare:     ['sto','stai','sta','stiamo','state','stanno'],
  rimanere:  ['rimango','rimani','rimane','rimaniamo','rimanete','rimangono'],
  bere:      ['bevo','bevi','beve','beviamo','bevete','bevono'],
  morire:    ['muoio','muori','muore','moriamo','morite','muoiono'],
  capire:    ['capisco','capisci','capisce','capiamo','capite','capiscono'],
  salire:    ['salgo','sali','sale','saliamo','salite','salgono'],
  preferire: ['preferisco','preferisci','preferisce','preferiamo','preferite','preferiscono'],
  /* أفعال -iare: لا تضعيف i عند نهاية -i أو -iamo */
  studiare:  ['studio','studi','studia','studiamo','studiate','studiano'],
  mangiare:  ['mangio','mangi','mangia','mangiamo','mangiate','mangiano'],
  /* أفعال -care: تضيف h قبل -i و-e للحفاظ على نطق الـ c */
  giocare:   ['gioco','giochi','gioca','giochiamo','giocate','giocano'],
  comunicare:['comunico','comunichi','comunica','comunichiamo','comunicate','comunicano'],
  /* أفعال -gare: تضيف h قبل -i و-e للحفاظ على نطق الـ g */
  navigare:  ['navigo','navighi','naviga','navighiamo','navigate','navigano'],
  bloggare:  ['bloggo','bloggi','blogga','blogghiamo','bloggiate','bloggano'],
  volere:    ['voglio','vuoi','vuole','vogliamo','volete','vogliono'],
  potere:    ['posso','puoi','può','possiamo','potete','possono'],
  dovere:    ['devo','devi','deve','dobbiamo','dovete','devono'],
  sapere:    ['so','sai','sa','sappiamo','sapete','sanno']
};

const ARABIC_BRIDGE_NOTES={
  are:'💡 نهاية <b dir="ltr">-a</b> مع lui/lei تشبه التأنيث في العربي',
  ere:'💡 أفعال <b dir="ltr">-ere</b> تستخدم <b dir="ltr">-e</b> مع lui/lei بدل <b dir="ltr">-a</b>',
  ire:'💡 أفعال <b dir="ltr">-ire</b> نهاياتها قريبة من <b dir="ltr">-ere</b> لكن لها بعض الاختلافات'
};

/* ══════════════════════════════════════════════════════════════════
   GRAMMAR_NOTES — ملاحظات جرامر تظهر في Stage 4 (النسخ)
   المفتاح = جزء من الجملة الإيطالية، القيمة = شرح HTML
   ══════════════════════════════════════════════════════════════════ */
const GRAMMAR_NOTES = {
  'la TV':             '💡 <b dir="ltr">la</b> = أداة مؤنث مفرد | TV مؤنث في الإيطالية',
  'la pizza':          '💡 أسماء تنتهي بـ <b dir="ltr">-a</b> غالباً مؤنثة → أداتها <b dir="ltr">la</b>',
  'la porta':          '💡 <b dir="ltr">la porta</b> = الباب | تنتهي بـ <b dir="ltr">-a</b> → مؤنث',
  'la finestra':       '💡 <b dir="ltr">la finestra</b> = النافذة | تنتهي بـ <b dir="ltr">-a</b> → مؤنث',
  'la camera':         '💡 <b dir="ltr">la camera</b> = الغرفة | <b dir="ltr">camera da letto</b> = غرفة النوم',
  'la cucina':         '💡 <b dir="ltr">la cucina</b> = المطبخ | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'la macchina':       '💡 <b dir="ltr">la macchina</b> = السيارة | <b dir="ltr">l\'auto</b> مختصر مؤنث',
  'la bicicletta':     '💡 <b dir="ltr">la bici</b> = المختصر الشائع | جمعه <b dir="ltr">le bici</b> ثابت',
  'la storia':         '💡 <b dir="ltr">la storia</b> = التاريخ أو القصة | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'la lingua':         '💡 <b dir="ltr">la lingua</b> = اللغة | جمعها <b dir="ltr">le lingue</b>',
  'la palestra':       '💡 <b dir="ltr">la palestra</b> = الصالة الرياضية | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'la colazione':      '💡 كل كلمة تنتهي بـ <b dir="ltr">-zione</b> مؤنثة → تجمع بـ <b dir="ltr">-zioni</b>',
  'la verità':         '💡 ينتهي بتشديد → لا يتغير في الجمع | <b dir="ltr">le verità</b>',
  'la spesa':          '💡 <b dir="ltr">fare la spesa</b> = يتسوق | تعبير ثابت شائع',
  'la partita':        '💡 <b dir="ltr">la partita</b> = المباراة | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'la radio':          '💡 <b dir="ltr">la radio</b> = الراديو | مؤنث وإن كان ينتهي بـ <b dir="ltr">-o</b>',
  'la voce':           '💡 <b dir="ltr">la voce</b> = الصوت | ينتهي بـ <b dir="ltr">-e</b> → مؤنث بالأداة',
  'la mail':           '💡 <b dir="ltr">la mail / la email</b> مؤنث في الإيطالية | كلمة أجنبية دخيلة',
  'le scale':          '💡 <b dir="ltr">le</b> = جمع مؤنث | <b dir="ltr">scala→scale</b> (a→e في الجمع)',
  'il treno':          '💡 <b dir="ltr">il</b> = أداة مذكر | أسماء تنتهي بـ <b dir="ltr">-o</b> غالباً مذكرة',
  'il libro':          '💡 <b dir="ltr">il libro</b> = الكتاب | الجمع: <b dir="ltr">i libri</b> (o→i)',
  'il cellulare':      '💡 <b dir="ltr">il cellulare</b> = الموبايل | ينتهي بـ <b dir="ltr">-e</b> → جمعه <b dir="ltr">i cellulari</b>',
  'il tempo':          '💡 <b dir="ltr">il tempo</b> = الوقت أو الطقس | حسب السياق',
  'il fine settimana': '💡 <b dir="ltr">il fine settimana</b> = عطلة نهاية الأسبوع | مركب مذكر',
  'il giornale':       '💡 <b dir="ltr">il giornale</b> = الجريدة | مذكر ينتهي بـ <b dir="ltr">-e</b>',
  'il telefono':       '💡 <b dir="ltr">il telefono</b> = الهاتف | مذكر ينتهي بـ <b dir="ltr">-o</b>',
  'il tè':             '💡 <b dir="ltr">il tè</b> ينتهي بتشديد → لا يتغير في الجمع',
  'il succo':          '💡 <b dir="ltr">il succo</b> = العصير | جمعه <b dir="ltr">i succhi</b> (co→chi)',
  'il quaderno':       '💡 <b dir="ltr">il quaderno</b> = الكراسة | جمعه <b dir="ltr">i quaderni</b>',
  'un libro':          '💡 <b dir="ltr">un</b> = نكرة مذكر أمام حرف ساكن',
  'un messaggio':      '💡 <b dir="ltr">un</b> = نكرة مذكر | جمع: <b dir="ltr">messaggi</b> (gio→gi)',
  'un regalo':         '💡 <b dir="ltr">un regalo</b> = هدية | نكرة مذكر مفرد',
  'un film':           '💡 <b dir="ltr">un film</b> = فيلم | كلمات أجنبية لا تتغير في الجمع',
  'un rumore':         '💡 <b dir="ltr">un rumore</b> = ضجيج | ينتهي بـ <b dir="ltr">-e</b> → جمعه <b dir="ltr">i rumori</b>',
  'un caffè':          '💡 <b dir="ltr">un caffè</b> ينتهي بتشديد → لا يتغير في الجمع',
  'una lettera':       '💡 <b dir="ltr">una</b> = نكرة مؤنث أمام حرف ساكن',
  'una storia':        '💡 <b dir="ltr">una</b> = نكرة مؤنث | <b dir="ltr">storia</b> ينتهي بـ <b dir="ltr">-a</b>',
  'una canzone':       '💡 <b dir="ltr">una canzone</b> = أغنية | ينتهي بـ <b dir="ltr">-e</b> → مؤنث',
  'una passeggiata':   '💡 <b dir="ltr">fare una passeggiata</b> = يتنزه | تعبير ثابت شائع',
  'otto ore':          '💡 <b dir="ltr">ora→ore</b> = جمع مؤنث | بعد الأرقام نستخدم الجمع',
  'acqua':             '💡 <b dir="ltr">acqua</b> بدون أداة = مفعول به غير محدد (نكرة)',
  'molto':             '💡 <b dir="ltr">molto</b> = كثيراً (ظرف ثابت) | صفة: يتغير molto/a/i/e',
  'bene':              '💡 <b dir="ltr">stare bene</b> = أن تكون بخير | <b dir="ltr">bene</b> ظرف لا يتغير',
  'tutto':             '💡 <b dir="ltr">tutto</b> = كل شيء | الجمع: <b dir="ltr">tutti</b> = الجميع',
  'a casa':            '💡 <b dir="ltr">a casa</b> بدون أداة = تعبير ظرفي ثابت "في البيت / للبيت"',
  'a calcio':          '💡 <b dir="ltr">a calcio</b> = تعبير ثابت للعب كرة القدم | لا أداة هنا',
  'a letto':           '💡 <b dir="ltr">a letto</b> = في السرير | تعبير ظرفي ثابت بدون أداة',
  'a piedi':           '💡 <b dir="ltr">a piedi</b> = سيراً على الأقدام | تعبير ثابت',
  'a tennis':          '💡 <b dir="ltr">a + رياضة</b> بدون أداة = تعبير ثابت للألعاب',
  'a carte':           '💡 <b dir="ltr">giocare a carte</b> = يلعب الورق | نفس قاعدة a calcio',
  'in classe':         '💡 <b dir="ltr">in + مكان</b> بدون أداة = ظرف مكان شائع في الإيطالية',
  'in Italia':         '💡 <b dir="ltr">in</b> مع أسماء الدول المؤنثة بدون أداة = في إيطاليا',
  'in palestra':       '💡 <b dir="ltr">in palestra</b> بدون أداة = تعبير مكان ثابت (كـ in casa)',
  'in camera':         '💡 <b dir="ltr">in camera</b> بدون أداة = في الغرفة | تعبير ثابت',
  'in cucina':         '💡 <b dir="ltr">in cucina</b> بدون أداة = في المطبخ | تعبير ثابت',
  'in fretta':         '💡 <b dir="ltr">in fretta</b> = بسرعة | تعبير ظرفي ثابت',
  'in silenzio':       '💡 <b dir="ltr">in silenzio</b> = بصمت | تعبير ثابت',
  'al parco':          '💡 <b dir="ltr">al = a + il</b> | حرف الجر يندمج مع الأداة',
  'al mattino':        '💡 <b dir="ltr">al mattino</b> = في الصباح | <b dir="ltr">al = a + il</b>',
  'al lavoro':         '💡 <b dir="ltr">al lavoro</b> = إلى العمل | <b dir="ltr">al = a + il</b>',
  'al mercato':        '💡 <b dir="ltr">al mercato</b> = إلى السوق | <b dir="ltr">al = a + il</b>',
  'al telefono':       '💡 <b dir="ltr">al telefono</b> = بالهاتف | تعبير ثابت',
  'sul treno':         '💡 <b dir="ltr">sul = su + il</b> = على + الـ | حرف الجر يندمج مع الأداة',
  "dall'autobus":      '💡 <b dir="ltr">dall\' = da + l\'</b> | حرف الجر مع أداة أمام متحرك',
  'dal treno':         '💡 <b dir="ltr">dal = da + il</b> = من + الـ | حرف الجر يندمج مع الأداة',
  'dal lavoro':        '💡 <b dir="ltr">dal = da + il</b> = من + الـ',
  'di casa':           '💡 <b dir="ltr">di casa</b> = من المنزل | حرف الجر <b dir="ltr">di</b> = من/خاص بـ',
  'di fame':           '💡 <b dir="ltr">morire di + اسم</b> = يموت من | تعبير مجازي شائع',
  'di freddo':         '💡 <b dir="ltr">di freddo/caldo/paura</b> = من البرد/الحر/الخوف',
  'con noi':           '💡 <b dir="ltr">con</b> = مع | الضمائر لا تتغير بعد حروف الجر',
  'con gli amici':     '💡 <b dir="ltr">gli</b> = أداة جمع مذكر أمام متحرك أو z أو s+ساكن',
  'con il fratello':   '💡 <b dir="ltr">il fratello</b> = الأخ | مذكر ينتهي بـ <b dir="ltr">-o</b>',
  'con la famiglia':   '💡 <b dir="ltr">la famiglia</b> = العائلة | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'con la sorella':    '💡 <b dir="ltr">la sorella</b> = الأخت | مؤنث ينتهي بـ <b dir="ltr">-a</b>',
  'con la madre':      '💡 <b dir="ltr">la madre</b> = الأم | ينتهي بـ <b dir="ltr">-e</b> → مؤنث بالأداة',
  'con il padre':      '💡 <b dir="ltr">il padre</b> = الأب | ينتهي بـ <b dir="ltr">-e</b> → مذكر بالأداة',
  'con il professore': '💡 <b dir="ltr">il professore</b> = الأستاذ | ينتهي بـ <b dir="ltr">-e</b> مذكر',
  "l'italiano":        '💡 <b dir="ltr">l\'</b> = أداة أمام متحرك | هنا مع <b dir="ltr">italiano</b> يبدأ بـ i',
  "l'autobus":         '💡 <b dir="ltr">l\'autobus</b> = الأتوبيس | لا يتغير في الجمع: <b dir="ltr">gli autobus</b>',
  'per Roma':          '💡 <b dir="ltr">per</b> = إلى/لأجل | يُستخدم مع وجهة السفر',
  'sport':             '💡 <b dir="ltr">fare sport</b> = يمارس الرياضة | <b dir="ltr">sport</b> لا يتغير في الجمع',
  'colazione':         '💡 <b dir="ltr">fare colazione</b> = يتناول الإفطار | بدون أداة هنا',
  'i compiti':         '💡 <b dir="ltr">i compiti</b> = الواجبات | جمع مذكر أداته <b dir="ltr">i</b>',
  'medico':            '💡 <b dir="ltr">diventare + مهنة</b> بدون أداة = يصبح طبيباً/أستاذاً',
  'professore':        '💡 بعد <b dir="ltr">diventare</b> المهن تأتي بدون أداة',
  'famoso':            '💡 الصفة تتبع الموصوف: مذكر <b dir="ltr">famoso</b>، مؤنث <b dir="ltr">famosa</b>',
  'grande':            '💡 <b dir="ltr">grande</b> = نوع ثانٍ من الصفات | لا يتغير بين مذكر ومؤنث',
  'tranquillo':        '💡 الصفة بعد <b dir="ltr">stare</b>: مذكر <b dir="ltr">tranquillo</b>، مؤنث <b dir="ltr">tranquilla</b>',
  'insieme':           '💡 <b dir="ltr">insieme</b> = معاً | ظرف لا يتغير',
  'subito':            '💡 <b dir="ltr">subito</b> = فوراً / حالاً | ظرف لا يتغير',
  'sempre':            '💡 <b dir="ltr">sempre</b> = دائماً | ظرف لا يتغير',
  'spesso':            '💡 <b dir="ltr">spesso</b> = كثيراً/في الغالب | ظرف لا يتغير',
  'raramente':         '💡 <b dir="ltr">raramente</b> = نادراً | ظروف المنوال تنتهي بـ <b dir="ltr">-mente</b>',
  'lentamente':        '💡 <b dir="ltr">lentamente</b> = ببطء | <b dir="ltr">lento + mente</b>',
  'velocemente':       '💡 <b dir="ltr">veloce + mente</b> = بسرعة | قاعدة ظروف <b dir="ltr">-mente</b>',
};

/* دالة تجلب أول ملاحظة جرامر مطابقة لجملة معينة */
function getGrammarNote(sentenceIt){
  if(!sentenceIt) return null;
  for(const key of Object.keys(GRAMMAR_NOTES)){
    if(sentenceIt.includes(key)) return GRAMMAR_NOTES[key];
  }
  return null;
}

/* ── مستويات الإتقان (Ebbinghaus) ── */
const MASTERY_LEVELS=[
  {level:0, name:'Seen',        nameAr:'رأيته', days:1 },
  {level:1, name:'Familiar',    nameAr:'مألوف',  days:3 },
  {level:2, name:'Comfortable', nameAr:'مرتاح',  days:7 },
  {level:3, name:'Strong',      nameAr:'قوي',    days:14},
  {level:4, name:'Sealed',      nameAr:'مختوم',  days:30}
];
const FAM_LEVELS=MASTERY_LEVELS;
function masteryAr(lv){return(MASTERY_LEVELS[Math.max(0,Math.min(4,lv|0))]||MASTERY_LEVELS[0]).nameAr;}
function famLevelAr(n){
  if(typeof n==='number')return masteryAr(n);
  const l=MASTERY_LEVELS.find(x=>x.name===n||x.nameAr===n);
  return l?l.nameAr:masteryAr(0);
}

/* ── ترتيب تعلم الأفعال ── */
const DAILY_ORDER=[
  /* منتظمة -are */
  'giocare','dormire','parlare','sentire','guardare','partire','lavorare',
  'studiare','abitare','ascoltare','comprare','mandare','mangiare','passare',
  'diventare','arrivare','tornare','entrare','restare',
  'pranzare','cenare','accettare','rifiutare','comunicare','incontrare',
  'aspettare','amare','adorare','salutare','ballare','insegnare',
  'chattare','navigare','bloggare',
  /* منتظمة/شبه منتظمة -ere */
  'ricevere','nascere','cadere',
  /* شبه منتظمة -ire (تأخذ -isc- في التصريف) */
  'capire','pulire','preferire',
  /* شاذة في الحاضر أو الماضي */
  'salire',  /* شاذ في الحاضر: io salgo وليس salisco */
  'vedere','prendere','leggere','scrivere','vivere','aprire','chiudere','scendere',
  'crescere','succedere','fare','andare','venire','stare','dire','uscire','bere',
  'rimanere','morire','volere','potere','dovere','sapere'
];

/* ══════════════════════════════════════════════════════════════════
   VERB_COMPLEMENTS — الكلمات المخصصة لكل فعل (Contextual Mapping)
   8 مكملات لكل فعل = 12 سؤال بتنويع كافٍ (idx % 8)
   ══════════════════════════════════════════════════════════════════ */
const VERB_COMPLEMENTS = {
  'giocare':   [{s:'a calcio.',as:'كرة القدم'},{s:'con il fratello.',as:'مع الأخ'},{s:'a tennis.',as:'التنس'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'in palestra.',as:'في الجيم'},{s:'a carte.',as:'بالأوراق'},{s:'con il cugino.',as:'مع ابن العم'},{s:'molto bene.',as:'بشكل جيد جداً'}],
  'dormire':   [{s:'otto ore.',as:'ثماني ساعات'},{s:'in camera.',as:'في الغرفة'},{s:'presto.',as:'مبكراً'},{s:'molto.',as:'كثيراً'},{s:'tardi.',as:'متأخراً'},{s:'nel salotto.',as:'في الصالون'},{s:'bene.',as:'جيداً'},{s:'ogni giorno.',as:'كل يوم'}],
  'parlare':   [{s:'italiano.',as:'الإيطالية'},{s:'con la famiglia.',as:'مع العائلة'},{s:'al telefono.',as:'بالهاتف'},{s:'con il professore.',as:'مع الأستاذ'},{s:'spesso.',as:'كثيراً'},{s:'di storia.',as:'عن التاريخ'},{s:'con la madre.',as:'مع الأم'},{s:'lentamente.',as:'ببطء'}],
  'sentire':   [{s:'un rumore.',as:'ضوضاء'},{s:'musica.',as:'موسيقى'},{s:'la radio.',as:'الراديو'},{s:'il telefono.',as:'الهاتف'},{s:'tutto.',as:'كل شيء'},{s:'bene.',as:'جيداً'},{s:'la voce.',as:'الصوت'},{s:'spesso.',as:'كثيراً'}],
  'guardare':  [{s:'la TV.',as:'التلفاز'},{s:'un film.',as:'فيلماً'},{s:'il cellulare.',as:'الموبايل'},{s:'la partita.',as:'المباراة'},{s:'fuori.',as:'للخارج'},{s:'con la famiglia.',as:'مع العائلة'},{s:'spesso.',as:'كثيراً'},{s:'la sorella.',as:'الأخت'}],
  'partire':   [{s:'presto.',as:'مبكراً'},{s:'di mattina.',as:'صباحاً'},{s:'per Roma.',as:'إلى روما'},{s:'con la famiglia.',as:'مع العائلة'},{s:'tardi.',as:'متأخراً'},{s:'lunedì.',as:'الإثنين'},{s:'in treno.',as:'بالقطار'},{s:'domani.',as:'غداً'}],
  'lavorare':  [{s:'molto.',as:'كثيراً'},{s:'ogni giorno.',as:'كل يوم'},{s:'in ufficio.',as:'في المكتب'},{s:'da casa.',as:'من المنزل'},{s:'tardi.',as:'متأخراً'},{s:'con il padre.',as:'مع الأب'},{s:'in centro.',as:'في وسط المدينة'},{s:'spesso.',as:'كثيراً'}],
  'capire':    [{s:'tutto.',as:'كل شيء'},{s:'la lingua.',as:'اللغة'},{s:'bene.',as:'جيداً'},{s:'la lezione.',as:'الدرس'},{s:'poco.',as:'قليلاً'},{s:'la domanda.',as:'السؤال'},{s:'subito.',as:'فوراً'},{s:'sempre.',as:'دائماً'}],
  'studiare':  [{s:'la storia.',as:'التاريخ'},{s:'la geografia.',as:'الجغرافيا'},{s:"l'italiano.",as:'الإيطالية'},{s:'una materia difficile.',as:'مادة صعبة'},{s:'in camera.',as:'في الغرفة'},{s:'ogni giorno.',as:'كل يوم'},{s:'con la sorella.',as:'مع الأخت'},{s:'molto.',as:'كثيراً'}],
  'salire':    [{s:'le scale.',as:'السلالم'},{s:'in fretta.',as:'بسرعة'},{s:'sul treno.',as:'على القطار'},{s:'al primo piano.',as:'للطابق الأول'},{s:'in ascensore.',as:'بالمصعد'},{s:'subito.',as:'فوراً'},{s:'sul motorino.',as:'على الدراجة النارية'},{s:'presto.',as:'مبكراً'}],
  'abitare':   [{s:'a Roma.',as:'في روما'},{s:'in centro.',as:'في وسط المدينة'},{s:'vicino alla scuola.',as:'قرب المدرسة'},{s:'con la famiglia.',as:'مع العائلة'},{s:'in un appartamento.',as:'في شقة'},{s:'al secondo piano.',as:'في الطابق الثاني'},{s:'in via Roma.',as:'في شارع روما'},{s:'con il fratello.',as:'مع الأخ'}],
  'pulire':    [{s:'la camera.',as:'الغرفة'},{s:'la cucina.',as:'المطبخ'},{s:'il bagno.',as:'الحمام'},{s:'la casa.',as:'المنزل'},{s:'il salotto.',as:'الصالون'},{s:'la sala.',as:'الصالة'},{s:'ogni giorno.',as:'كل يوم'},{s:'bene.',as:'جيداً'}],
  'ascoltare': [{s:'musica.',as:'موسيقى'},{s:'la radio.',as:'الراديو'},{s:'il professore.',as:'الأستاذ'},{s:'la madre.',as:'الأم'},{s:'una canzone.',as:'أغنية'},{s:'spesso.',as:'كثيراً'},{s:'bene.',as:'جيداً'},{s:'con attenzione.',as:'باهتمام'}],
  'nascere':   [{s:'in Italia.',as:'في إيطاليا'},{s:'a Milano.',as:'في ميلانو'},{s:'in estate.',as:'في الصيف'},{s:'in famiglia.',as:'في العائلة'},{s:'al mattino.',as:'في الصباح'},{s:'in primavera.',as:'في الربيع'},{s:'in una piccola città.',as:'في مدينة صغيرة'},{s:'a Roma.',as:'في روما'}],
  'comprare':  [{s:'un regalo.',as:'هدية'},{s:'la macchina.',as:'السيارة'},{s:'un libro.',as:'كتاباً'},{s:'la colazione.',as:'الإفطار'},{s:'qualcosa di nuovo.',as:'شيئاً جديداً'},{s:'al mercato.',as:'في السوق'},{s:'il cellulare.',as:'الموبايل'},{s:'la bicicletta.',as:'الدراجة'}],
  'cadere':    [{s:'a terra.',as:'على الأرض'},{s:'sulle scale.',as:'على الدرج'},{s:'dal motorino.',as:'من الدراجة'},{s:'in strada.',as:'في الشارع'},{s:'di mattina.',as:'صباحاً'},{s:'spesso.',as:'كثيراً'},{s:'per caso.',as:'بالصدفة'},{s:'dal letto.',as:'من السرير'}],
  'mandare':   [{s:'un messaggio.',as:'رسالة'},{s:'una lettera.',as:'خطاباً'},{s:'una foto.',as:'صورة'},{s:'un regalo.',as:'هدية'},{s:'una mail.',as:'بريداً إلكترونياً'},{s:'al fratello.',as:'للأخ'},{s:'spesso.',as:'كثيراً'},{s:'alla madre.',as:'للأم'}],
  'mangiare':  [{s:'la pizza.',as:'البيتزا'},{s:'la pasta.',as:'الباستا'},{s:'a casa.',as:'في المنزل'},{s:'in cucina.',as:'في المطبخ'},{s:'con la famiglia.',as:'مع العائلة'},{s:'la colazione.',as:'الإفطار'},{s:'molto.',as:'كثيراً'},{s:'bene.',as:'جيداً'}],
  'passare':   [{s:'il tempo.',as:'الوقت'},{s:'il fine settimana.',as:'عطلة نهاية الأسبوع'},{s:'le vacanze in Italia.',as:'العطلة في إيطاليا'},{s:'la sera a casa.',as:'المساء في المنزل'},{s:'il pomeriggio.',as:'بعد الظهر'},{s:'bene.',as:'وقتاً ممتعاً'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'la mattina.',as:'الصباح'}],
  'diventare': [{s:'famoso.',as:'مشهوراً'},{s:'grande.',as:'كبيراً'},{s:'medico.',as:'طبيباً'},{s:'professore.',as:'أستاذاً'},{s:'bravo.',as:'جيداً'},{s:'importante.',as:'مهماً'},{s:'presto.',as:'قريباً'},{s:'un campione.',as:'بطلاً'}],
  'arrivare':  [{s:'tardi.',as:'متأخراً'},{s:'presto.',as:'مبكراً'},{s:'a casa.',as:'إلى المنزل'},{s:'a Roma.',as:'إلى روما'},{s:'in treno.',as:'بالقطار'},{s:'di mattina.',as:'صباحاً'},{s:"in autobus.",as:'بالأتوبيس'},{s:'insieme.',as:'معاً'}],
  'tornare':   [{s:'a casa.',as:'إلى المنزل'},{s:'presto.',as:'مبكراً'},{s:'tardi.',as:'متأخراً'},{s:'dal lavoro.',as:'من العمل'},{s:'in Italia.',as:'إلى إيطاليا'},{s:'domani.',as:'غداً'},{s:'ogni sera.',as:'كل مساء'},{s:'con la famiglia.',as:'مع العائلة'}],
  'entrare':   [{s:'in classe.',as:'الفصل'},{s:'in casa.',as:'في المنزل'},{s:'in cucina.',as:'في المطبخ'},{s:'in ufficio.',as:'في المكتب'},{s:'presto.',as:'مبكراً'},{s:'in palestra.',as:'في الجيم'},{s:'senza bussare.',as:'بدون طرق'},{s:'dalla porta.',as:'من الباب'}],
  'restare':   [{s:'qui.',as:'هنا'},{s:'a casa.',as:'في المنزل'},{s:'con la famiglia.',as:'مع العائلة'},{s:'a letto.',as:'في السرير'},{s:'in camera.',as:'في الغرفة'},{s:'tutta la sera.',as:'طوال المساء'},{s:'poco.',as:'قليلاً'},{s:'sempre.',as:'دائماً'}],
  'vedere':    [{s:'un film.',as:'فيلماً'},{s:'la nonna.',as:'الجدة'},{s:'gli amici.',as:'الأصدقاء'},{s:'la partita.',as:'المباراة'},{s:'la TV.',as:'التلفاز'},{s:'il fratello.',as:'الأخ'},{s:'spesso.',as:'كثيراً'},{s:'tutto.',as:'كل شيء'}],
  'prendere':  [{s:'il treno.',as:'القطار'},{s:"l'autobus.",as:'الأتوبيس'},{s:'il taxi.',as:'التاكسي'},{s:'un caffè.',as:'قهوة'},{s:'il cellulare.',as:'الموبايل'},{s:'un libro.',as:'كتاباً'},{s:'la bici.',as:'الدراجة'},{s:'il metrò.',as:'المترو'}],
  'leggere':   [{s:'un libro.',as:'كتاباً'},{s:'il giornale.',as:'الجريدة'},{s:'una storia.',as:'قصة'},{s:'la geografia.',as:'الجغرافيا'},{s:'un messaggio.',as:'رسالة'},{s:'in camera.',as:'في الغرفة'},{s:'la mail.',as:'البريد الإلكتروني'},{s:'spesso.',as:'كثيراً'}],
  'scrivere':  [{s:'una lettera.',as:'رسالة'},{s:'un messaggio.',as:'رسالة نصية'},{s:'sul quaderno.',as:'على الكراسة'},{s:'una mail.',as:'بريداً إلكترونياً'},{s:'in italiano.',as:'بالإيطالية'},{s:'bene.',as:'جيداً'},{s:'la storia.',as:'التاريخ'},{s:'spesso.',as:'كثيراً'}],
  'vivere':    [{s:'a Milano.',as:'في ميلانو'},{s:'in Italia.',as:'في إيطاليا'},{s:'con la famiglia.',as:'مع العائلة'},{s:'bene.',as:'جيداً'},{s:'in centro.',as:'في وسط المدينة'},{s:'vicino al parco.',as:'قرب الحديقة'},{s:'insieme.',as:'معاً'},{s:'in appartamento.',as:'في شقة'}],
  'aprire':    [{s:'la porta.',as:'الباب'},{s:'la finestra.',as:'النافذة'},{s:'il libro.',as:'الكتاب'},{s:'la borsa.',as:'الحقيبة'},{s:'il negozio.',as:'المحل'},{s:'la macchina.',as:'السيارة'},{s:'subito.',as:'فوراً'},{s:'con cura.',as:'بعناية'}],
  'chiudere':  [{s:'la porta.',as:'الباب'},{s:'la finestra.',as:'النافذة'},{s:'il libro.',as:'الكتاب'},{s:'la borsa.',as:'الحقيبة'},{s:'il negozio.',as:'المحل'},{s:'bene.',as:'جيداً'},{s:'presto.',as:'مبكراً'},{s:'la macchina.',as:'السيارة'}],
  'rimanere':  [{s:'a casa.',as:'في المنزل'},{s:'qui.',as:'هنا'},{s:'in camera.',as:'في الغرفة'},{s:'con la famiglia.',as:'مع العائلة'},{s:'tutta la sera.',as:'طوال المساء'},{s:'a letto.',as:'في السرير'},{s:'vicino.',as:'قريباً'},{s:'insieme.',as:'معاً'}],
  'stare':     [{s:'bene.',as:'بخير'},{s:'a casa.',as:'في المنزل'},{s:'qui.',as:'هنا'},{s:'con la famiglia.',as:'مع العائلة'},{s:'male.',as:'بشكل سيئ'},{s:'in silenzio.',as:'بصمت'},{s:'insieme.',as:'معاً'},{s:'tranquillo.',as:'بهدوء'}],
  'morire':    [{s:'di fame.',as:'من الجوع'},{s:'di freddo.',as:'من البرد'},{s:'di paura.',as:'من الخوف'},{s:'vecchio.',as:'عجوزاً'},{s:'di caldo.',as:'من الحر'},{s:'di noia.',as:'من الملل'},{s:'di stanchezza.',as:'من التعب'},{s:'presto.',as:'مبكراً'}],
  'scendere':  [{s:'le scale.',as:'الدرج'},{s:'dal treno.',as:'من القطار'},{s:"dall'autobus.",as:'من الأتوبيس'},{s:'in fretta.',as:'بسرعة'},{s:'dalla macchina.',as:'من السيارة'},{s:'presto.',as:'مبكراً'},{s:'piano.',as:'بهدوء'},{s:'subito.',as:'فوراً'}],
  'crescere':  [{s:'in fretta.',as:'بسرعة'},{s:'a Roma.',as:'في روما'},{s:'con la famiglia.',as:'مع العائلة'},{s:'bene.',as:'جيداً'},{s:'insieme.',as:'معاً'},{s:'in campagna.',as:'في الريف'},{s:'vicino al mare.',as:'قرب البحر'},{s:'lentamente.',as:'ببطء'}],
  'succedere': [{s:'spesso.',as:'كثيراً'},{s:'a volte.',as:'أحياناً'},{s:'sempre.',as:'دائماً'},{s:'di mattina.',as:'صباحاً'},{s:'raramente.',as:'نادراً'},{s:'in fretta.',as:'بسرعة'},{s:'a tutti.',as:'للجميع'},{s:'in classe.',as:'في الفصل'}],
  'fare':      [{s:'la spesa.',as:'التسوق'},{s:'colazione.',as:'الإفطار'},{s:'sport.',as:'رياضة'},{s:'i compiti.',as:'الواجبات'},{s:'una passeggiata.',as:'نزهة'},{s:'presto.',as:'مبكراً'},{s:'tutto.',as:'كل شيء'},{s:'bene.',as:'جيداً'}],
  'andare':    [{s:'al parco.',as:'إلى الحديقة'},{s:'a scuola.',as:'إلى المدرسة'},{s:'in palestra.',as:'إلى الجيم'},{s:'al lavoro.',as:'إلى العمل'},{s:'a casa.',as:'إلى المنزل'},{s:'al mercato.',as:'إلى السوق'},{s:'in bicicletta.',as:'بالدراجة'},{s:'con la famiglia.',as:'مع العائلة'}],
  'venire':    [{s:'con noi.',as:'معنا'},{s:'a casa.',as:'إلى المنزل'},{s:'presto.',as:'مبكراً'},{s:'in classe.',as:'إلى الفصل'},{s:'con il fratello.',as:'مع الأخ'},{s:'a piedi.',as:'سيراً على الأقدام'},{s:'spesso.',as:'كثيراً'},{s:'domani.',as:'غداً'}],
  'dire':      [{s:'la verità.',as:'الحقيقة'},{s:'ciao.',as:'مرحباً'},{s:'sempre.',as:'دائماً'},{s:'tutto.',as:'كل شيء'},{s:'bene.',as:'جيداً'},{s:'buongiorno.',as:'صباح الخير'},{s:'grazie.',as:'شكراً'},{s:'spesso.',as:'كثيراً'}],
  'uscire':    [{s:'di casa.',as:'من المنزل'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'presto.',as:'مبكراً'},{s:'tardi.',as:'متأخراً'},{s:'di sera.',as:'مساءً'},{s:'con la sorella.',as:'مع الأخت'},{s:'spesso.',as:'كثيراً'},{s:'ogni giorno.',as:'كل يوم'}],

  'pranzare':   [{s:'a casa.',as:'في المنزل'},{s:'con la famiglia.',as:'مع العائلة'},{s:'al ristorante.',as:'في المطعم'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'in cucina.',as:'في المطبخ'},{s:'ogni giorno.',as:'كل يوم'},{s:'insieme.',as:'معاً'},{s:'tardi.',as:'متأخراً'}],
  'cenare':     [{s:'con la famiglia.',as:'مع العائلة'},{s:'a casa.',as:'في المنزل'},{s:'al ristorante.',as:'في المطعم'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'tardi.',as:'متأخراً'},{s:'insieme.',as:'معاً'},{s:'spesso.',as:'كثيراً'},{s:'in cucina.',as:'في المطبخ'}],
  'accettare':  [{s:'la proposta.',as:'العرض'},{s:'il lavoro.',as:'العمل'},{s:"l'invito.",as:'الدعوة'},{s:'la sfida.',as:'التحدي'},{s:'la verità.',as:'الحقيقة'},{s:'tutto.',as:'كل شيء'},{s:'sempre.',as:'دائماً'},{s:'volentieri.',as:'بكل سرور'}],
  'rifiutare':  [{s:'la proposta.',as:'العرض'},{s:"l'invito.",as:'الدعوة'},{s:'il lavoro.',as:'العمل'},{s:'la sfida.',as:'التحدي'},{s:'tutto.',as:'كل شيء'},{s:'sempre.',as:'دائماً'},{s:'la verità.',as:'الحقيقة'},{s:'categoricamente.',as:'بشكل قاطع'}],
  'ricevere':   [{s:'un messaggio.',as:'رسالة'},{s:'una lettera.',as:'خطاباً'},{s:'un regalo.',as:'هدية'},{s:'una mail.',as:'بريداً إلكترونياً'},{s:'una foto.',as:'صورة'},{s:'buone notizie.',as:'أخباراً جيدة'},{s:'spesso.',as:'كثيراً'},{s:'tutto.',as:'كل شيء'}],
  'comunicare': [{s:'con gli amici.',as:'مع الأصدقاء'},{s:'con la famiglia.',as:'مع العائلة'},{s:'al telefono.',as:'بالهاتف'},{s:'via mail.',as:'عبر البريد'},{s:'bene.',as:'جيداً'},{s:'spesso.',as:'كثيراً'},{s:'con il professore.',as:'مع الأستاذ'},{s:'ogni giorno.',as:'كل يوم'}],
  'incontrare': [{s:'un amico.',as:'صديقاً'},{s:'la famiglia.',as:'العائلة'},{s:'il professore.',as:'الأستاذ'},{s:'gli amici.',as:'الأصدقاء'},{s:'spesso.',as:'كثيراً'},{s:'per caso.',as:'بالصدفة'},{s:'in centro.',as:'في وسط المدينة'},{s:'domani.',as:'غداً'}],
  'aspettare':  [{s:"l'autobus.",as:'الأتوبيس'},{s:'il treno.',as:'القطار'},{s:'gli amici.',as:'الأصدقاء'},{s:'la famiglia.',as:'العائلة'},{s:'tanto.',as:'طويلاً'},{s:'in silenzio.',as:'بصمت'},{s:'fuori.',as:'بالخارج'},{s:'ancora.',as:'أكثر'}],
  'amare':      [{s:'la musica.',as:'الموسيقى'},{s:'la famiglia.',as:'العائلة'},{s:'gli amici.',as:'الأصدقاء'},{s:"l'Italia.",as:'إيطاليا'},{s:'la pizza.',as:'البيتزا'},{s:'studiare.',as:'الدراسة'},{s:'molto.',as:'كثيراً'},{s:'il cinema.',as:'السينما'}],
  'adorare':    [{s:'la pizza.',as:'البيتزا'},{s:'la musica.',as:'الموسيقى'},{s:'viaggiare.',as:'السفر'},{s:'il cinema.',as:'السينما'},{s:'cucinare.',as:'الطبخ'},{s:'leggere.',as:'القراءة'},{s:"l'estate.",as:'الصيف'},{s:'dormire.',as:'النوم'}],
  'salutare':   [{s:'gli amici.',as:'الأصدقاء'},{s:'la famiglia.',as:'العائلة'},{s:'il professore.',as:'الأستاذ'},{s:'tutti.',as:'الجميع'},{s:'spesso.',as:'كثيراً'},{s:'con un sorriso.',as:'بابتسامة'},{s:'la sorella.',as:'الأخت'},{s:'il fratello.',as:'الأخ'}],
  'ballare':    [{s:'bene.',as:'جيداً'},{s:'con gli amici.',as:'مع الأصدقاء'},{s:'alla festa.',as:'في الحفلة'},{s:'il sabato.',as:'يوم السبت'},{s:'spesso.',as:'كثيراً'},{s:'in palestra.',as:'في الجيم'},{s:'insieme.',as:'معاً'},{s:'tutta la notte.',as:'طوال الليل'}],
  'insegnare':  [{s:'italiano.',as:'الإيطالية'},{s:'matematica.',as:'الرياضيات'},{s:'storia.',as:'التاريخ'},{s:'bene.',as:'جيداً'},{s:'ai bambini.',as:'للأطفال'},{s:'in classe.',as:'في الفصل'},{s:'ogni giorno.',as:'كل يوم'},{s:'con passione.',as:'بشغف'}],
  'preferire':  [{s:'la pizza.',as:'البيتزا'},{s:'il caffè.',as:'القهوة'},{s:'studiare.',as:'الدراسة'},{s:'dormire.',as:'النوم'},{s:'leggere.',as:'القراءة'},{s:"l'estate.",as:'الصيف'},{s:'la musica.',as:'الموسيقى'},{s:'stare a casa.',as:'البقاء في المنزل'}],
  'chattare':   [{s:'con gli amici.',as:'مع الأصدقاء'},{s:'con la famiglia.',as:'مع العائلة'},{s:'ogni giorno.',as:'كل يوم'},{s:'la sera.',as:'مساءً'},{s:'spesso.',as:'كثيراً'},{s:'sul cellulare.',as:'على الموبايل'},{s:'tardi.',as:'متأخراً'},{s:'insieme.',as:'معاً'}],
  'navigare':   [{s:'internet.',as:'الإنترنت'},{s:'sul web.',as:'على الويب'},{s:'ogni giorno.',as:'كل يوم'},{s:'spesso.',as:'كثيراً'},{s:'per ore.',as:'لساعات'},{s:'la sera.',as:'مساءً'},{s:'sul cellulare.',as:'على الموبايل'},{s:'velocemente.',as:'بسرعة'}],
  'bloggare':   [{s:'ogni giorno.',as:'كل يوم'},{s:'di cucina.',as:'عن الطبخ'},{s:'di sport.',as:'عن الرياضة'},{s:'in italiano.',as:'بالإيطالية'},{s:'spesso.',as:'كثيراً'},{s:'di viaggi.',as:'عن السفر'},{s:'sul web.',as:'على الويب'},{s:'con passione.',as:'بشغف'}],
  'volere':     [{s:'studiare.',as:'الدراسة'},{s:'dormire.',as:'النوم'},{s:'venire.',as:'المجيء'},{s:'uscire.',as:'الخروج'},{s:'mangiare.',as:'الأكل'},{s:'lavorare.',as:'العمل'},{s:'capire.',as:'الفهم'},{s:'parlare.',as:'التحدث'}],
  'potere':     [{s:'venire.',as:'المجيء'},{s:'studiare.',as:'الدراسة'},{s:'uscire.',as:'الخروج'},{s:'aiutare.',as:'المساعدة'},{s:'capire.',as:'الفهم'},{s:'lavorare.',as:'العمل'},{s:'dormire.',as:'النوم'},{s:'parlare.',as:'التحدث'}],
  'dovere':     [{s:'lavorare.',as:'العمل'},{s:'studiare.',as:'الدراسة'},{s:'tornare.',as:'العودة'},{s:'mangiare.',as:'الأكل'},{s:'dormire.',as:'النوم'},{s:'uscire.',as:'الخروج'},{s:'capire.',as:'الفهم'},{s:'parlare.',as:'التحدث'}],
  'sapere':     [{s:'la verità.',as:'الحقيقة'},{s:"l'italiano.",as:'الإيطالية'},{s:'tutto.',as:'كل شيء'},{s:'cucinare.',as:'الطبخ'},{s:'cantare.',as:'الغناء'},{s:'bene.',as:'جيداً'},{s:'molto.',as:'كثيراً'},{s:'dove andare.',as:'أين يذهب'}],
  'bere':      [{s:'acqua.',as:'ماء'},{s:'un caffè.',as:'قهوة'},{s:'il tè.',as:'الشاي'},{s:'molto.',as:'كثيراً'},{s:'il succo.',as:'العصير'},{s:'la mattina.',as:'في الصباح'},{s:'spesso.',as:'كثيراً'},{s:'insieme.',as:'معاً'}],
};

/*
  getComplementForIdx — تجلب complement بناءً على index
  (يضمن تنويع الكلمات عبر الـ 12 سؤال في كل stage)
*/
function getComplementForIdx(verbIt, idx){
  const pool = VERB_COMPLEMENTS[verbIt];
  if(!pool || pool.length === 0) return null;
  return pool[idx % pool.length];
}

/* ══════════════════════════════════════════════════════════════════
   data — الضمائر + قواعد التصريف + الأفعال
   ══════════════════════════════════════════════════════════════════ */
const data={
  pronouns:[
    {it:'Io',     ar:'أنا',   p:'تُ',  gender:null, conjIndex:0},
    {it:'Tu',     ar:'أنتَ',  p:'تَ',  gender:null, conjIndex:1},
    {it:'Lui/Lei',ar:'هو/هي', p:'ـ',   gender:null, conjIndex:2},
    {it:'Noi',    ar:'نحن',   p:'نا',  gender:null, conjIndex:3},
    {it:'Voi',    ar:'أنتم',  p:'تُم', gender:null, conjIndex:4},
    {it:'Loro',   ar:'هم',    p:'وا',  gender:null, conjIndex:5}
  ],

  rules:{
    pres:{
      are:['o','i','a','iamo','ate','ano'],
      ere:['o','i','e','iamo','ete','ono'],
      ire:['o','i','e','iamo','ite','ono']
    },
    fut:{
      are:['erò','erai','erà','eremo','erete','eranno'],
      ere:['erò','erai','erà','eremo','erete','eranno'],
      ire:['irò','irai','irà','iremo','irete','iranno']
    },
    past_aux_avere: ['ho','hai','ha','abbiamo','avete','hanno'],
    past_aux_essere:['sono','sei','è','siamo','siete','sono']
  },

  verbs:{
    regular:[
      {it:'giocare',   ar:'يلعب',    arPast:'لعب',    arPres:['ألعب','تلعب','يلعب/تلعب','نلعب','تلعبون','يلعبون'],        s:'a calcio.',        as:'كرة القدم',    aux:'avere'},
      {it:'sentire',   ar:'يسمع',    arPast:'سمع',    arPres:['أسمع','تسمع','يسمع/تسمع','نسمع','تسمعون','يسمعون'],        s:'un rumore.',       as:'ضوضاء',         aux:'avere'},
      {it:'dormire',   ar:'ينام',    arPast:'نام',    arPastRoot:'نم', arPres:['أنام','تنام','ينام/تنام','ننام','تنامون','ينامون'],  s:'otto ore.',        as:'ثماني ساعات',  aux:'avere'},
      {it:'parlare',   ar:'يتحدث',   arPast:'تحدث',   arPres:['أتحدث','تتحدث','يتحدث/تتحدث','نتحدث','تتحدثون','يتحدثون'], s:'italiano.',        as:'الإيطالية',     aux:'avere'},
      {it:'partire',   ar:'يغادر',   arPast:'غادر',   arPres:['أغادر','تغادر','يغادر/تغادر','نغادر','تغادرون','يغادرون'],  s:'presto.',          as:'مبكراً',        aux:'essere', pastPart:'partito'},
      {it:'capire',    ar:'يفهم',    arPast:'فهم',    arPres:['أفهم','تفهم','يفهم/تفهم','نفهم','تفهمون','يفهمون'],         s:'tutto.',           as:'كل شيء',       aux:'avere'},
      {it:'guardare',  ar:'يشاهد',   arPast:'شاهد',   arPres:['أشاهد','تشاهد','يشاهد/تشاهد','نشاهد','تشاهدون','يشاهدون'], s:'la TV.',           as:'التلفاز',       aux:'avere'},
      {it:'nascere',   ar:'يولد',    arPast:'ولد',    arPres:['أولد','تولد','يولد/تولد','نولد','تولدون','يولدون'],          s:'in Italia.',       as:'في إيطاليا',    aux:'essere', pastPart:'nato'},
      {it:'pulire',    ar:'ينظف',    arPast:'نظف',    arPres:['أنظف','تنظف','ينظف/تنظف','ننظف','تنظفون','ينظفون'],          s:'la camera.',       as:'الغرفة',        aux:'avere'},
      {it:'studiare',  ar:'يدرس',    arPast:'درس',    arPres:['أدرس','تدرس','يدرس/تدرس','ندرس','تدرسون','يدرسون'],          s:"l'italiano.",      as:'الإيطالية',     aux:'avere'},
      {it:'diventare', ar:'يصبح',    arPast:'أصبح',   arPres:['أصبح','تصبح','يصبح/تصبح','نصبح','تصبحون','يصبحون'],         s:'famoso.',          as:'مشهوراً',       aux:'essere', pastPart:'diventato'},
      {it:'salire',    ar:'يصعد',    arPast:'صعد',    arPres:['أصعد','تصعد','يصعد/تصعد','نصعد','تصعدون','يصعدون'],          s:'le scale.',        as:'السلالم',       aux:'essere', pastPart:'salito'},
      {it:'lavorare',  ar:'يعمل',    arPast:'عمل',    arPres:['أعمل','تعمل','يعمل/تعمل','نعمل','تعملون','يعملون'],          s:'molto.',           as:'كثيراً',        aux:'avere'},
      {it:'cadere',    ar:'يسقط',    arPast:'سقط',    arPres:['أسقط','تسقط','يسقط/تسقط','نسقط','تسقطون','يسقطون'],          s:'a terra.',         as:'على الأرض',     aux:'essere', pastPart:'caduto'},
      {it:'mangiare',  ar:'يأكل',    arPast:'أكل',    arPres:['آكل','تأكل','يأكل/تأكل','نأكل','تأكلون','يأكلون'],            s:'la pizza.',        as:'البيتزا',       aux:'avere'},
      {it:'abitare',   ar:'يسكن',    arPast:'سكن',    arPres:['أسكن','تسكن','يسكن/تسكن','نسكن','تسكنون','يسكنون'],          s:'a Roma.',          as:'في روما',       aux:'avere'},
      {it:'ascoltare', ar:'يستمع',   arPast:'استمع',  arPres:['أستمع','تستمع','يستمع/تستمع','نستمع','تستمعون','يستمعون'],   s:'musica.',          as:'للموسيقى',      aux:'avere'},
      {it:'comprare',  ar:'يشتري',   arPast:'اشترى',  arPastRoot:'اشتري', arPres:['أشتري','تشتري','يشتري/تشتري','نشتري','تشترون','يشترون'], s:'un regalo.', as:'هدية', aux:'avere'},
      {it:'mandare',   ar:'يرسل',    arPast:'أرسل',   arPres:['أرسل','ترسل','يرسل/ترسل','نرسل','ترسلون','يرسلون'],          s:'un messaggio.',    as:'رسالة',         aux:'avere'},
      {it:'passare',   ar:'يقضي',    arPast:'قضى',    arPastRoot:'قضي', arPres:['أقضي','تقضي','يقضي/تقضي','نقضي','تقضون','يقضون'], s:'il tempo.',  as:'الوقت',         aux:'avere'},
      {it:'arrivare',  ar:'يصل',     arPast:'وصل',    arPres:['أصل','تصل','يصل/تصل','نصل','تصلون','يصلون'],                 s:'tardi.',           as:'متأخراً',       aux:'essere', pastPart:'arrivato'},
      {it:'tornare',   ar:'يعود',    arPast:'عاد',    arPastRoot:'عد', arPres:['أعود','تعود','يعود/تعود','نعود','تعودون','يعودون'], s:'a casa.',   as:'إلى المنزل',   aux:'essere', pastPart:'tornato'},
      {it:'entrare',   ar:'يدخل',    arPast:'دخل',    arPres:['أدخل','تدخل','يدخل/تدخل','ندخل','تدخلون','يدخلون'],          s:'in classe.',       as:'الفصل',         aux:'essere', pastPart:'entrato'},
      {it:'restare',   ar:'يبقى',    arPast:'بقي',    arPastRoot:'بقي', arPres:['أبقى','تبقى','يبقى/تبقى','نبقى','تبقون','يبقون'], s:'qui.',      as:'هنا',            aux:'essere', pastPart:'restato'},
      /* ── أفعال جديدة ── */
      {it:'pranzare',  ar:'يتغدّى',  arPast:'تغدّى',  arPastRoot:'تغدّ', arPres:['أتغدّى','تتغدّى','يتغدّى/تتغدّى','نتغدّى','تتغدّون','يتغدّون'],  s:'a casa.',         as:'في المنزل',     aux:'avere'},
      {it:'cenare',    ar:'يتعشّى',  arPast:'تعشّى',  arPastRoot:'تعشّ', arPres:['أتعشّى','تتعشّى','يتعشّى/تتعشّى','نتعشّى','تتعشّون','يتعشّون'],  s:'con la famiglia.',as:'مع العائلة',    aux:'avere'},
      {it:'accettare', ar:'يقبل',    arPast:'قبل',    arPres:['أقبل','تقبل','يقبل/تقبل','نقبل','تقبلون','يقبلون'],                                  s:'la proposta.',    as:'العرض',         aux:'avere'},
      {it:'rifiutare', ar:'يرفض',    arPast:'رفض',    arPres:['أرفض','ترفض','يرفض/ترفض','نرفض','ترفضون','يرفضون'],                                  s:'la proposta.',    as:'العرض',         aux:'avere'},
      {it:'ricevere',  ar:'يستقبل',  arPast:'استقبل', arPres:['أستقبل','تستقبل','يستقبل/تستقبل','نستقبل','تستقبلون','يستقبلون'],                   s:'un messaggio.',   as:'رسالة',         aux:'avere', pastPart:'ricevuto'},
      {it:'comunicare',ar:'يتواصل',  arPast:'تواصل',  arPres:['أتواصل','تتواصل','يتواصل/تتواصل','نتواصل','تتواصلون','يتواصلون'],                   s:'con gli amici.',  as:'مع الأصدقاء',   aux:'avere'},
      {it:'incontrare',ar:'يقابل',   arPast:'قابل',   arPres:['أقابل','تقابل','يقابل/تقابل','نقابل','تقابلون','يقابلون'],                           s:'un amico.',       as:'صديقاً',        aux:'avere'},
      {it:'aspettare', ar:'ينتظر',   arPast:'انتظر',  arPres:['أنتظر','تنتظر','ينتظر/تنتظر','ننتظر','تنتظرون','ينتظرون'],                           s:"l'autobus.",      as:'الأتوبيس',      aux:'avere'},
      {it:'amare',     ar:'يحب',     arPast:'أحب',    arPres:['أحب','تحب','يحب/تحب','نحب','تحبون','يحبون'],                                          s:'la musica.',      as:'الموسيقى',      aux:'avere'},
      {it:'adorare',   ar:'يعشق',    arPast:'عشق',    arPres:['أعشق','تعشق','يعشق/تعشق','نعشق','تعشقون','يعشقون'],                                  s:'la pizza.',       as:'البيتزا',       aux:'avere'},
      {it:'salutare',  ar:'يحيّي',   arPast:'حيّا',   arPastRoot:'حيّ', arPres:['أحيّي','تحيّي','يحيّي/تحيّي','نحيّي','تحيّون','يحيّون'],            s:'gli amici.',      as:'الأصدقاء',      aux:'avere'},
      {it:'ballare',   ar:'يرقص',    arPast:'رقص',    arPres:['أرقص','ترقص','يرقص/ترقص','نرقص','ترقصون','يرقصون'],                                  s:'bene.',           as:'جيداً',         aux:'avere'},
      {it:'insegnare', ar:'يعلّم',   arPast:'علّم',   arPres:['أعلّم','تعلّم','يعلّم/تعلّم','نعلّم','تعلّمون','يعلّمون'],                            s:'italiano.',       as:'الإيطالية',     aux:'avere'},
      {it:'preferire', ar:'يفضّل',   arPast:'فضّل',   arPres:['أفضّل','تفضّل','يفضّل/تفضّل','نفضّل','تفضّلون','يفضّلون'],                            s:'la pizza.',       as:'البيتزا',       aux:'avere'},
      {it:'chattare',  ar:'يدردش',   arPast:'دردش',   arPres:['أدردش','تدردش','يدردش/تدردش','ندردش','تدردشون','يدردشون'],                            s:'con gli amici.',  as:'مع الأصدقاء',   aux:'avere'},
      {it:'navigare',  ar:'يتصفّح',  arPast:'تصفّح',  arPres:['أتصفّح','تتصفّح','يتصفّح/تتصفّح','نتصفّح','تتصفّحون','يتصفّحون'],                   s:'internet.',       as:'الإنترنت',      aux:'avere'},
      {it:'bloggare',  ar:'يدوّن',   arPast:'دوّن',   arPres:['أدوّن','تدوّن','يدوّن/تدوّن','ندوّن','تدوّنون','يدوّنون'],                            s:'ogni giorno.',    as:'كل يوم',        aux:'avere'}
    ],

    irregular:[
      {it:'andare',   ar:'يذهب',      arPast:'ذهب',  arPastRoot:'ذهب', arPres:['أذهب','تذهب','يذهب/تذهب','نذهب','تذهبون','يذهبون'],    s:'al parco.',      as:'إلى الحديقة',  aux:'essere', pastPart:'andato'},
      {it:'fare',     ar:'يفعل',      arPast:'فعل',  arPres:['أفعل','تفعل','يفعل/تفعل','نفعل','تفعلون','يفعلون'],                      s:'la spesa.',      as:'التسوق',       aux:'avere',  pastPart:'fatto'},
      {it:'venire',   ar:'يأتي',      arPast:'أتى',  arPastRoot:'أتي', arPres:['آتي','تأتي','يأتي/تأتي','نأتي','تأتون','يأتون'],        s:'con noi.',       as:'معنا',         aux:'essere', pastPart:'venuto'},
      {it:'dire',     ar:'يقول',      arPast:'قال',  arPastRoot:'قل',  arPres:['أقول','تقول','يقول/تقول','نقول','تقولون','يقولون'],     s:'la verità.',     as:'الحقيقة',      aux:'avere',  pastPart:'detto'},
      {it:'vedere',   ar:'يرى',       arPast:'رأى',  arPastRoot:'رأي', arPres:['أرى','ترى','يرى/ترى','نرى','ترون','يرون'],              s:'un film.',       as:'فيلماً',       aux:'avere',  pastPart:'visto'},
      {it:'prendere', ar:'يأخذ',      arPast:'أخذ',  arPres:['آخذ','تأخذ','يأخذ/تأخذ','نأخذ','تأخذون','يأخذون'],                      s:'il treno.',      as:'القطار',       aux:'avere',  pastPart:'preso'},
      {it:'leggere',  ar:'يقرأ',      arPast:'قرأ',  arPres:['أقرأ','تقرأ','يقرأ/تقرأ','نقرأ','تقرأون','يقرأون'],                     s:'un libro.',      as:'كتاباً',       aux:'avere',  pastPart:'letto'},
      {it:'bere',     ar:'يشرب',      arPast:'شرب',  arPres:['أشرب','تشرب','يشرب/تشرب','نشرب','تشربون','يشربون'],                     s:'acqua.',         as:'ماء',          aux:'avere',  pastPart:'bevuto'},
      {it:'scrivere', ar:'يكتب',      arPast:'كتب',  arPres:['أكتب','تكتب','يكتب/تكتب','نكتب','تكتبون','يكتبون'],                     s:'una lettera.',   as:'رسالة',        aux:'avere',  pastPart:'scritto'},
      {it:'uscire',   ar:'يخرج',      arPast:'خرج',  arPres:['أخرج','تخرج','يخرج/تخرج','نخرج','تخرجون','يخرجون'],                     s:'di casa.',       as:'من المنزل',    aux:'essere', pastPart:'uscito'},
      {it:'aprire',   ar:'يفتح',      arPast:'فتح',  arPres:['أفتح','تفتح','يفتح/تفتح','نفتح','تفتحون','يفتحون'],                     s:'la porta.',      as:'الباب',        aux:'avere',  pastPart:'aperto'},
      {it:'chiudere', ar:'يغلق',      arPast:'أغلق', arPres:['أغلق','تغلق','يغلق/تغلق','نغلق','تغلقون','يغلقون'],                     s:'la finestra.',   as:'النافذة',      aux:'avere',  pastPart:'chiuso'},
      {it:'rimanere', ar:'يمكث',      arPast:'مكث',  arPres:['أمكث','تمكث','يمكث/تمكث','نمكث','تمكثون','يمكثون'],                     s:'a casa.',        as:'في المنزل',    aux:'essere', pastPart:'rimasto'},
      {it:'vivere',   ar:'يعيش',      arPast:'عاش',  arPres:['أعيش','تعيش','يعيش/تعيش','نعيش','تعيشون','يعيشون'],                     s:'a Milano.',      as:'في ميلانو',    aux:'avere',  pastPart:'vissuto'},
      {it:'stare',    ar:'يكون/يقيم', arPast:'كان',  arPres:['أكون','تكون','يكون/تكون','نكون','تكونون','يكونون'],                      s:'bene.',          as:'بخير',         aux:'essere'},
      {it:'morire',   ar:'يموت',      arPast:'مات',  arPastRoot:'مت',  arPres:['أموت','تموت','يموت/تموت','نموت','تموتون','يموتون'],     s:'vecchio.',       as:'عجوزاً',       aux:'essere', pastPart:'morto'},
      {it:'scendere', ar:'ينزل',      arPast:'نزل',  arPres:['أنزل','تنزل','ينزل/تنزل','ننزل','تنزلون','ينزلون'],                     s:'le scale.',      as:'السلالم',      aux:'essere', pastPart:'sceso'},
      {it:'crescere', ar:'يكبر',      arPast:'كبر',  arPres:['أكبر','تكبر','يكبر/تكبر','نكبر','تكبرون','يكبرون'],                     s:'in fretta.',     as:'بسرعة',        aux:'essere', pastPart:'cresciuto'},
      {it:'succedere',ar:'يحدث',      arPast:'حدث',  arPres:['أحدث','تحدث','يحدث/تحدث','نحدث','تحدثون','يحدثون'],                     s:'spesso.',        as:'كثيراً',       aux:'essere', pastPart:'successo'},
      /* ── أفعال شاذة جديدة (modals) ── */
      {it:'volere',   ar:'يريد',      arPast:'أراد', arPastRoot:'أرد', arPres:['أريد','تريد','يريد/تريد','نريد','تريدون','يريدون'],                    s:'studiare.',      as:'أن يدرس',      aux:'avere', pastPart:'voluto'},
      {it:'potere',   ar:'يستطيع',    arPast:'استطاع',arPres:['أستطيع','تستطيع','يستطيع/تستطيع','نستطيع','تستطيعون','يستطيعون'],                      s:'venire.',        as:'أن يأتي',      aux:'avere', pastPart:'potuto'},
      {it:'dovere',   ar:'يجب',       arPast:'وجب',  arPres:['يلزمني','يلزمك','يلزمه/يلزمها','يلزمنا','يلزمكم','يلزمهم'],                              s:'lavorare.',      as:'أن يعمل',      aux:'avere', pastPart:'dovuto'},
      {it:'sapere',   ar:'يعرف',      arPast:'عرف',  arPres:['أعرف','تعرف','يعرف/تعرف','نعرف','تعرفون','يعرفون'],                                     s:'la verità.',     as:'الحقيقة',      aux:'avere', pastPart:'saputo'}
    ]
  }
};
