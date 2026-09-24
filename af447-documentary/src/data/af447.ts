// The whole film as data. Every narration line has:
//   text – the subtitle, exactly as scripted (Hindi with English aviation terms)
//   say  – what the narrator speaks: the same words in Devanagari, numbers
//          written out, so the Hindi voice pronounces English terms naturally
//   bea  – true when the line states a finding of the BEA investigation (a
//          source label appears on screen)
// Scene lengths, subtitles and animation timing all derive from this file.
//
// ACCURACY: no dialogue is invented and no cockpit words are quoted. The
// explanation follows the BEA Final Report (5 July 2012).

export type Cue = {
  id: string;
  text: string;
  say: string;
  bea?: boolean;
  pauseBefore?: number;
  pauseAfter?: number;
  seconds?: number;
};

export type SceneId =
  | "opening"
  | "normalFlight"
  | "pitotProblem"
  | "climb"
  | "stall"
  | "disappearance"
  | "search"
  | "twoYears"
  | "blackBox"
  | "realMystery"
  | "lessons"
  | "ending";

export type Scene = { id: SceneId; number: number; title: string; leadIn: number; tail: number; cues: Cue[] };

export const SOURCE = {
  short: "BEA Final Report · AF447 · July 2012",
  full: "BEA — Bureau d'Enquêtes et d'Analyses pour la sécurité de l'aviation civile. Final Report on the accident on 1st June 2009 to the Airbus A330-203 registered F-GZCP operated by Air France, flight AF 447 Rio de Janeiro – Paris (July 2012)",
};

export const STORY: Scene[] = [
  {
    id: "opening",
    number: 1,
    title: "आख़िरी उड़ान",
    leadIn: 3,
    tail: 5,
    cues: [
      { id: "night", text: "31 मई 2009 की रात।", say: "इकतीस मई, दो हज़ार नौ की रात।", pauseAfter: 0.6 },
      { id: "takeoff", text: "Rio de Janeiro से एक Airbus A330 Paris के लिए उड़ान भरता है।", say: "रियो डी जनेरो से, एक एयरबस ए-थ्री-थर्टी, पेरिस के लिए उड़ान भरता है।" },
      { id: "flightNo", text: "Flight number था… Air France 447.", say: "फ़्लाइट नंबर था... एयर फ़्रांस, फ़ोर फ़ोर्टी-सेवन।", pauseAfter: 0.6 },
      { id: "people", text: "विमान में 216 passengers और 12 crew members थे।", say: "विमान में दो सौ सोलह पैसेंजर्स, और बारह क्रू मेंबर्स थे।", bea: true },
      { id: "total", text: "कुल 228 लोग।", say: "कुल, दो सौ अट्ठाईस लोग।", pauseAfter: 0.8 },
      { id: "normal", text: "शुरुआत में यह एक सामान्य transatlantic flight थी।", say: "शुरुआत में, यह एक सामान्य ट्रांस-अटलांटिक फ़्लाइट थी।" },
      { id: "hours", text: "लेकिन कुछ घंटों बाद…", say: "लेकिन कुछ घंटों बाद...", pauseAfter: 0.4 },
      { id: "contact", text: "विमान और दुनिया के बीच संपर्क टूटने वाला था।", say: "विमान और दुनिया के बीच, संपर्क टूटने वाला था।", pauseAfter: 0.6 },
      { id: "atlantic", text: "और Atlantic Ocean के ऊपर…", say: "और अटलांटिक ओशन के ऊपर...", pauseAfter: 0.3 },
      { id: "mystery", text: "एक ऐसा aviation mystery शुरू होने वाला था, जिसका जवाब मिलने में लगभग दो साल लगेंगे।", say: "एक ऐसी एविएशन मिस्ट्री शुरू होने वाली थी, जिसका जवाब मिलने में, लगभग दो साल लगेंगे।", pauseAfter: 1.5 },
    ],
  },
  {
    id: "normalFlight",
    number: 2,
    title: "एक सामान्य उड़ान",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "route", text: "AF447 ने Rio de Janeiro से उड़ान भरी और Atlantic के ऊपर अपनी निर्धारित route पर आगे बढ़ने लगा।", say: "ए-एफ़ फ़ोर फ़ोर्टी-सेवन ने रियो डी जनेरो से उड़ान भरी, और अटलांटिक के ऊपर, अपने निर्धारित रूट पर आगे बढ़ने लगा।" },
      { id: "a330", text: "विमान एक Airbus A330 था—एक modern long-haul aircraft.", say: "विमान एक एयरबस ए-थ्री-थर्टी था... एक मॉडर्न, लॉन्ग-हॉल एयरक्राफ़्ट।" },
      { id: "altitude", text: "ऊंचाई लगभग 35,000 feet थी।", say: "ऊंचाई, लगभग पैंतीस हज़ार फ़ीट थी।", bea: true },
      { id: "sea", text: "नीचे हजारों मीटर तक सिर्फ समुद्र।", say: "नीचे, हज़ारों मीटर तक, सिर्फ़ समुद्र।" },
      { id: "sky", text: "ऊपर रात का आसमान।", say: "ऊपर, रात का आसमान।" },
      { id: "paris", text: "और आगे Paris।", say: "और आगे... पेरिस।", pauseAfter: 1 },
      { id: "weather", text: "रास्ते में विमान को खराब मौसम के क्षेत्र का सामना करना पड़ा।", say: "रास्ते में, विमान को ख़राब मौसम के क्षेत्र का सामना करना पड़ा।", bea: true },
      { id: "deviate", text: "Crew ने weather radar पर दिखाई दे रहे returns को देखते हुए aircraft का course थोड़ा बदला।", say: "क्रू ने, वेदर रडार पर दिखाई दे रहे रिटर्न्स को देखते हुए, एयरक्राफ़्ट का कोर्स थोड़ा बदला।", bea: true },
      { id: "until", text: "उस समय तक…", say: "उस समय तक...", pauseAfter: 0.3 },
      { id: "nothing", text: "ऐसा कुछ नहीं था जिससे लगे कि कुछ ही मिनटों में यह flight दुनिया की सबसे चर्चित aviation accidents में से एक बनने वाली है।", say: "ऐसा कुछ नहीं था, जिससे लगे कि कुछ ही मिनटों में, यह फ़्लाइट, दुनिया के सबसे चर्चित एविएशन एक्सीडेंट्स में से एक बनने वाली है।", pauseAfter: 1 },
    ],
  },
  {
    id: "pitotProblem",
    number: 3,
    title: "पहली चेतावनी",
    leadIn: 2.5,
    tail: 1.5,
    cues: [
      { id: "time", text: "फिर आया लगभग 2 बजकर 10 मिनट का समय।", say: "फिर आया, लगभग दो बजकर दस मिनट का समय।", bea: true },
      { id: "change", text: "यहीं से घटनाएं तेजी से बदलने लगीं।", say: "यहीं से, घटनाएं तेज़ी से बदलने लगीं।", pauseAfter: 0.6 },
      { id: "crystals", text: "Air France 447 जिस ऊंचाई पर उड़ रहा था, वहां atmosphere में ice crystals मौजूद थे।", say: "एयर फ़्रांस फ़ोर फ़ोर्टी-सेवन, जिस ऊंचाई पर उड़ रहा था, वहां एटमॉस्फ़ियर में, आइस क्रिस्टल्स मौजूद थे।", bea: true },
      { id: "probes", text: "इन ice crystals ने aircraft की Pitot probes को प्रभावित किया।", say: "इन आइस क्रिस्टल्स ने, एयरक्राफ़्ट की पिटो प्रोब्स को प्रभावित किया।", bea: true, pauseAfter: 0.8 },
      { id: "what", text: "Pitot probe aircraft की airspeed measurement system का एक महत्वपूर्ण हिस्सा होती है।", say: "पिटो प्रोब, एयरक्राफ़्ट के एयरस्पीड मेज़रमेंट सिस्टम का, एक महत्वपूर्ण हिस्सा होती है।" },
      { id: "unreliable", text: "लेकिन जब probe ठीक से काम नहीं करती…", say: "लेकिन जब प्रोब ठीक से काम नहीं करती...", pauseAfter: 0.3 },
      { id: "info", text: "तो aircraft को मिलने वाली speed information unreliable हो सकती है।", say: "तो एयरक्राफ़्ट को मिलने वाली स्पीड इन्फ़ॉर्मेशन, अनरिलायबल हो सकती है।", pauseAfter: 0.8 },
      { id: "inconsistent", text: "कुछ ही क्षणों में aircraft की airspeed indications inconsistent हो गईं।", say: "कुछ ही क्षणों में, एयरक्राफ़्ट की एयरस्पीड इंडिकेशन्स, इनकंसिस्टेंट हो गईं।", bea: true },
      { id: "autopilot", text: "Autopilot disconnect हो गया।", say: "ऑटोपायलट, डिसकनेक्ट हो गया।", bea: true, pauseAfter: 0.4 },
      { id: "law", text: "Aircraft alternate control law में चला गया।", say: "एयरक्राफ़्ट, ऑल्टरनेट कंट्रोल लॉ में चला गया।", bea: true },
      { id: "manual", text: "अब pilots को aircraft manually control करना था।", say: "अब पायलट्स को, एयरक्राफ़्ट मैनुअली कंट्रोल करना था।", pauseAfter: 1 },
    ],
  },
  {
    id: "climb",
    number: 4,
    title: "विमान ऊपर उठने लगा",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "difficult", text: "यहीं से situation बेहद कठिन हो गई।", say: "यहीं से, सिचुएशन बेहद कठिन हो गई।", pauseAfter: 0.5 },
      { id: "nose", text: "Aircraft का nose ऊपर उठने लगा।", say: "एयरक्राफ़्ट का नोज़, ऊपर उठने लगा।", bea: true },
      { id: "altitude", text: "विमान की altitude बढ़ने लगी।", say: "विमान की ऑल्टिट्यूड बढ़ने लगी।", bea: true },
      { id: "speed", text: "लेकिन उसकी actual airspeed कम हो रही थी।", say: "लेकिन उसकी एक्चुअल एयरस्पीड, कम हो रही थी।", bea: true, pauseAfter: 0.8 },
      { id: "important", text: "High altitude पर aircraft को control करने के लिए सही pitch और airspeed information बेहद महत्वपूर्ण होती है।", say: "हाई ऑल्टिट्यूड पर, एयरक्राफ़्ट को कंट्रोल करने के लिए, सही पिच और एयरस्पीड इन्फ़ॉर्मेशन, बेहद महत्वपूर्ण होती है।" },
      { id: "contradictory", text: "लेकिन cockpit में pilots को contradictory information मिल रही थी।", say: "लेकिन कॉकपिट में, पायलट्स को कॉन्ट्राडिक्टरी इन्फ़ॉर्मेशन मिल रही थी।", bea: true },
      { id: "up", text: "Aircraft ऊपर जा रहा था…", say: "एयरक्राफ़्ट ऊपर जा रहा था...", pauseAfter: 0.3 },
      { id: "down", text: "लेकिन उसकी speed कम होती जा रही थी।", say: "लेकिन उसकी स्पीड, कम होती जा रही थी।", pauseAfter: 1 },
      { id: "envelope", text: "कुछ ही समय में aircraft अपनी normal flight envelope से बाहर जाने लगा।", say: "कुछ ही समय में, एयरक्राफ़्ट अपनी नॉर्मल फ़्लाइट एनवेलप से, बाहर जाने लगा।", bea: true },
      { id: "then", text: "और फिर…", say: "और फिर...", pauseAfter: 0.4 },
      { id: "warning", text: "सबसे खतरनाक warning शुरू हुई।", say: "सबसे ख़तरनाक वॉर्निंग शुरू हुई।", pauseAfter: 1.5 },
    ],
  },
  {
    id: "stall",
    number: 5,
    title: "स्टॉल",
    leadIn: 1.5,
    tail: 4,
    cues: [
      { id: "reaching", text: "Aircraft stall की स्थिति में पहुंचने लगा।", say: "एयरक्राफ़्ट, स्टॉल की स्थिति में पहुंचने लगा।", bea: true, pauseAfter: 0.6 },
      { id: "notEngines", text: "Stall का मतलब यह नहीं कि engines बंद हो गए।", say: "स्टॉल का मतलब यह नहीं, कि इंजन बंद हो गए।" },
      { id: "meaning", text: "यह aerodynamic condition है जिसमें wings पर्याप्त lift पैदा नहीं कर पाते।", say: "यह एक एयरोडायनामिक कंडीशन है, जिसमें विंग्स, पर्याप्त लिफ़्ट पैदा नहीं कर पाते।", pauseAfter: 0.8 },
      { id: "aoa", text: "Aircraft का angle of attack बढ़ता गया।", say: "एयरक्राफ़्ट का एंगल ऑफ़ अटैक, बढ़ता गया।", bea: true },
      { id: "notRecognised", text: "लेकिन crew तुरंत यह पहचान नहीं पाई कि aircraft stall में जा चुका है।", say: "लेकिन क्रू, तुरंत यह पहचान नहीं पाई, कि एयरक्राफ़्ट स्टॉल में जा चुका है।", bea: true, pauseAfter: 1 },
      { id: "minutes", text: "कुछ ही मिनटों में…", say: "कुछ ही मिनटों में...", pauseAfter: 0.3 },
      { id: "falling", text: "35,000 feet की ऊंचाई पर उड़ रहा aircraft तेजी से नीचे गिरने लगा।", say: "पैंतीस हज़ार फ़ीट की ऊंचाई पर उड़ रहा एयरक्राफ़्ट, तेज़ी से नीचे गिरने लगा।", bea: true, pauseAfter: 2 },
      { id: "andThen", text: "और फिर…", say: "और फिर...", pauseAfter: 0.6 },
      { id: "date", text: "1 जून 2009 को…", say: "एक जून, दो हज़ार नौ को...", pauseAfter: 0.3 },
      { id: "time", text: "लगभग 2 बजकर 14 मिनट और 28 सेकंड पर…", say: "लगभग दो बजकर चौदह मिनट, और अट्ठाईस सेकंड पर...", bea: true, pauseAfter: 0.4 },
      { id: "impact", text: "Air France 447 Atlantic Ocean से टकरा गया।", say: "एयर फ़्रांस फ़ोर फ़ोर्टी-सेवन, अटलांटिक ओशन से टकरा गया।", bea: true, pauseAfter: 2.5 },
    ],
  },
  {
    id: "disappearance",
    number: 6,
    title: "विमान गायब",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "unknown", text: "लेकिन दुनिया को उस समय यह पता नहीं था कि हुआ क्या था।", say: "लेकिन दुनिया को उस समय, यह पता नहीं था, कि हुआ क्या था।", pauseAfter: 0.8 },
      { id: "lastContact", text: "Flight से अंतिम normal radio communication Brazilian air traffic control के साथ हुआ था।", say: "फ़्लाइट से अंतिम नॉर्मल रेडियो कम्युनिकेशन, ब्राज़ीलियन एयर ट्रैफ़िक कंट्रोल के साथ हुआ था।", bea: true },
      { id: "ended", text: "इसके बाद aircraft से regular communication समाप्त हो गया।", say: "इसके बाद, एयरक्राफ़्ट से रेगुलर कम्युनिकेशन, समाप्त हो गया।", bea: true, pauseAfter: 1 },
      { id: "searchBegins", text: "Aircraft के disappearance के बाद search operation शुरू हुआ।", say: "एयरक्राफ़्ट के डिसअपियरेंस के बाद, सर्च ऑपरेशन शुरू हुआ।" },
      { id: "vast", text: "समुद्र विशाल था।", say: "समुद्र विशाल था।", pauseAfter: 0.3 },
      { id: "location", text: "Aircraft का exact location स्पष्ट नहीं था।", say: "एयरक्राफ़्ट की एग्ज़ैक्ट लोकेशन, स्पष्ट नहीं थी।" },
      { id: "important", text: "और सबसे महत्वपूर्ण बात…", say: "और सबसे महत्वपूर्ण बात...", pauseAfter: 0.3 },
      { id: "recorders", text: "Flight recorders अभी समुद्र की गहराई में कहीं पड़े थे।", say: "फ़्लाइट रिकॉर्डर्स, अभी समुद्र की गहराई में, कहीं पड़े थे।", pauseAfter: 1.2 },
    ],
  },
  {
    id: "search",
    number: 7,
    title: "तलाश",
    leadIn: 1.5,
    tail: 3,
    cues: [
      { id: "area", text: "Search teams ने Atlantic के एक विशाल क्षेत्र को search करना शुरू किया।", say: "सर्च टीम्स ने, अटलांटिक के एक विशाल क्षेत्र को, सर्च करना शुरू किया।" },
      { id: "debris", text: "Surface पर aircraft debris मिला।", say: "सरफ़ेस पर, एयरक्राफ़्ट का डेब्री मिला।", bea: true },
      { id: "notSurface", text: "लेकिन wreckage का मुख्य हिस्सा समुद्र की सतह पर नहीं था।", say: "लेकिन रेकेज का मुख्य हिस्सा, समुद्र की सतह पर नहीं था।", pauseAfter: 1 },
      { id: "depth", text: "विमान लगभग 3,900 मीटर गहरे पानी में चला गया था।", say: "विमान, लगभग तीन हज़ार नौ सौ मीटर गहरे पानी में चला गया था।", bea: true, pauseBefore: 1.5 },
      { id: "hard", text: "इतनी गहराई पर search करना बेहद कठिन था।", say: "इतनी गहराई पर, सर्च करना बेहद कठिन था।", pauseAfter: 1 },
      { id: "months", text: "कई महीनों तक search जारी रही।", say: "कई महीनों तक, सर्च जारी रही।" },
      { id: "notFound", text: "लेकिन Flight Data Recorder और Cockpit Voice Recorder नहीं मिले।", say: "लेकिन फ़्लाइट डेटा रिकॉर्डर, और कॉकपिट वॉइस रिकॉर्डर, नहीं मिले।", bea: true, pauseAfter: 1.5 },
    ],
  },
  {
    id: "twoYears",
    number: 8,
    title: "दो साल के सवाल",
    leadIn: 1.5,
    tail: 2.5,
    cues: [
      { id: "continued", text: "2009 के बाद भी investigation जारी रही।", say: "दो हज़ार नौ के बाद भी, इन्वेस्टिगेशन जारी रही।" },
      { id: "theories", text: "कई theories सामने आईं।", say: "कई थ्योरीज़ सामने आईं।" },
      { id: "missing", text: "लेकिन investigators के पास सबसे महत्वपूर्ण evidence नहीं था—", say: "लेकिन इन्वेस्टिगेटर्स के पास, सबसे महत्वपूर्ण एविडेंस नहीं था..." },
      { id: "recorders", text: "flight recorders.", say: "फ़्लाइट रिकॉर्डर्स।", pauseAfter: 1.2 },
      { id: "april", text: "फिर 3 अप्रैल 2011 को…", say: "फिर, तीन अप्रैल, दो हज़ार ग्यारह को...", bea: true, pauseAfter: 0.4 },
      { id: "discovery", text: "एक महत्वपूर्ण discovery हुई।", say: "एक महत्वपूर्ण डिस्कवरी हुई।" },
      { id: "wreckage", text: "Aircraft का wreckage समुद्र की गहराई में मिल गया।", say: "एयरक्राफ़्ट का रेकेज, समुद्र की गहराई में मिल गया।", bea: true, pauseAfter: 1.2 },
      { id: "recovered", text: "कुछ सप्ताह बाद investigators ने Flight Data Recorder और फिर Cockpit Voice Recorder भी recover कर लिए।", say: "कुछ सप्ताह बाद, इन्वेस्टिगेटर्स ने, फ़्लाइट डेटा रिकॉर्डर, और फिर कॉकपिट वॉइस रिकॉर्डर भी, रिकवर कर लिए।", bea: true, pauseAfter: 2 },
    ],
  },
  {
    id: "blackBox",
    number: 9,
    title: "ब्लैक बॉक्स ने बताया क्रम",
    leadIn: 1.5,
    tail: 2,
    cues: [
      { id: "now", text: "अब investigators के पास वह evidence था जो लगभग दो साल से गायब था।", say: "अब इन्वेस्टिगेटर्स के पास, वह एविडेंस था, जो लगभग दो साल से गायब था।" },
      { id: "fdr", text: "Flight Data Recorder ने aircraft की movements और systems की information दी।", say: "फ़्लाइट डेटा रिकॉर्डर ने, एयरक्राफ़्ट की मूवमेंट्स, और सिस्टम्स की इन्फ़ॉर्मेशन दी।", bea: true },
      { id: "cvr", text: "Cockpit Voice Recorder ने cockpit में हुई घटनाओं का record दिया।", say: "कॉकपिट वॉइस रिकॉर्डर ने, कॉकपिट में हुई घटनाओं का रिकॉर्ड दिया।", bea: true, pauseAfter: 1 },
      { id: "chain", text: "Investigation ने घटनाओं की एक detailed chain reconstruct की।", say: "इन्वेस्टिगेशन ने, घटनाओं की एक डिटेल्ड चेन, रीकंस्ट्रक्ट की।", bea: true },
      { id: "c1", text: "Pitot probes पर ice crystals के कारण airspeed indications unreliable हुईं।", say: "पिटो प्रोब्स पर आइस क्रिस्टल्स के कारण, एयरस्पीड इंडिकेशन्स अनरिलायबल हुईं।", bea: true },
      { id: "c2", text: "Autopilot disconnect हुआ।", say: "ऑटोपायलट डिसकनेक्ट हुआ।", bea: true },
      { id: "c3", text: "Aircraft के control inputs ने flight path को destabilize किया।", say: "एयरक्राफ़्ट के कंट्रोल इनपुट्स ने, फ़्लाइट पाथ को डीस्टेबिलाइज़ किया।", bea: true },
      { id: "c4", text: "Aircraft stall में चला गया।", say: "एयरक्राफ़्ट, स्टॉल में चला गया।", bea: true },
      { id: "c5", text: "और crew समय रहते stall की स्थिति को पहचानकर aircraft को recover नहीं कर पाई।", say: "और क्रू, समय रहते, स्टॉल की स्थिति को पहचानकर, एयरक्राफ़्ट को रिकवर नहीं कर पाई।", bea: true, pauseAfter: 1 },
      { id: "report", text: "BEA की final report ने इसी sequence को accident के प्रमुख कारणों के रूप में दर्ज किया।", say: "बी-ई-ए की फ़ाइनल रिपोर्ट ने, इसी सीक्वेंस को, एक्सीडेंट के प्रमुख कारणों के रूप में दर्ज किया।", bea: true, pauseAfter: 1.5 },
    ],
  },
  {
    id: "realMystery",
    number: 10,
    title: "असली सवाल",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "solved", text: "तो क्या Air France 447 की mystery आखिर सुलझ गई?", say: "तो क्या एयर फ़्रांस फ़ोर फ़ोर्टी-सेवन की मिस्ट्री, आख़िर सुलझ गई?", pauseAfter: 1 },
      { id: "yes", text: "हां…", say: "हां...", pauseAfter: 0.6 },
      { id: "notOnly", text: "लेकिन इस कहानी का सबसे महत्वपूर्ण हिस्सा सिर्फ यह नहीं है कि aircraft क्यों crash हुआ।", say: "लेकिन इस कहानी का सबसे महत्वपूर्ण हिस्सा, सिर्फ़ यह नहीं है, कि एयरक्राफ़्ट क्यों क्रैश हुआ।" },
      { id: "question", text: "असल सवाल था—", say: "असल सवाल था...", pauseAfter: 0.4 },
      { id: "modern", text: "एक modern passenger aircraft…", say: "एक मॉडर्न पैसेंजर एयरक्राफ़्ट...", pauseAfter: 0.2 },
      { id: "computers", text: "जिसमें advanced computers थे…", say: "जिसमें एडवांस्ड कंप्यूटर्स थे...", pauseAfter: 0.2 },
      { id: "pilots", text: "experienced pilots थे…", say: "एक्सपीरियंस्ड पायलट्स थे...", pauseAfter: 0.2 },
      { id: "systems", text: "और multiple safety systems थे…", say: "और मल्टिपल सेफ़्टी सिस्टम्स थे...", pauseAfter: 0.3 },
      { id: "how", text: "वह ऐसी स्थिति तक कैसे पहुंचा?", say: "वह ऐसी स्थिति तक, कैसे पहुंचा?", pauseAfter: 1.5 },
      { id: "notOne", text: "Investigation ने दिखाया कि यह किसी एक कारण की कहानी नहीं थी।", say: "इन्वेस्टिगेशन ने दिखाया, कि यह किसी एक कारण की कहानी नहीं थी।", bea: true },
      { id: "chain", text: "यह कई छोटे और बड़े factors की chain थी।", say: "यह कई छोटे और बड़े फ़ैक्टर्स की, एक चेन थी।", bea: true, pauseAfter: 0.6 },
      { id: "f1", text: "एक technical problem…", say: "एक टेक्निकल प्रॉब्लम...", pauseAfter: 0.2 },
      { id: "f2", text: "फिर unreliable information…", say: "फिर, अनरिलायबल इन्फ़ॉर्मेशन...", pauseAfter: 0.2 },
      { id: "f3", text: "फिर aircraft control में कठिनाई…", say: "फिर, एयरक्राफ़्ट कंट्रोल में कठिनाई...", pauseAfter: 0.2 },
      { id: "f4", text: "फिर situation को सही तरीके से पहचानने में समस्या…", say: "फिर, सिचुएशन को सही तरीक़े से पहचानने में समस्या...", pauseAfter: 0.2 },
      { id: "f5", text: "और अंत में stall से recovery न हो पाना।", say: "और अंत में, स्टॉल से रिकवरी न हो पाना।", pauseAfter: 1.5 },
    ],
  },
  {
    id: "lessons",
    number: 11,
    title: "AF447 के बाद क्या बदला?",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "industry", text: "AF447 के बाद aviation industry ने कई safety lessons पर काम किया।", say: "ए-एफ़ फ़ोर फ़ोर्टी-सेवन के बाद, एविएशन इंडस्ट्री ने, कई सेफ़्टी लेसन्स पर काम किया।" },
      { id: "training", text: "Pilot training में unreliable airspeed situations और high-altitude stall recovery पर अधिक ध्यान दिया गया।", say: "पायलट ट्रेनिंग में, अनरिलायबल एयरस्पीड सिचुएशन्स, और हाई-ऑल्टिट्यूड स्टॉल रिकवरी पर, अधिक ध्यान दिया गया।", bea: true },
      { id: "simulator", text: "Air France ने additional simulator training शुरू की।", say: "एयर फ़्रांस ने, एडिशनल सिम्युलेटर ट्रेनिंग शुरू की।", bea: true },
      { id: "probes", text: "Pitot probes से जुड़े equipment changes भी किए गए।", say: "पिटो प्रोब्स से जुड़े, इक्विपमेंट चेंजेस भी किए गए।", bea: true, pauseAfter: 1 },
      { id: "case", text: "आज AF447 को aviation safety history में एक महत्वपूर्ण case के रूप में पढ़ा जाता है।", say: "आज, ए-एफ़ फ़ोर फ़ोर्टी-सेवन को, एविएशन सेफ़्टी हिस्ट्री में, एक महत्वपूर्ण केस के रूप में पढ़ा जाता है।" },
      { id: "lesson", text: "क्योंकि इस accident ने एक कठोर lesson दिया—", say: "क्योंकि इस एक्सीडेंट ने, एक कठोर लेसन दिया...", pauseAfter: 0.5 },
      { id: "technology", text: "technology कितनी भी advanced क्यों न हो…", say: "टेक्नोलॉजी कितनी भी एडवांस्ड क्यों न हो...", pauseAfter: 0.3 },
      { id: "unreliable", text: "जब information unreliable हो जाए…", say: "जब इन्फ़ॉर्मेशन अनरिलायबल हो जाए...", pauseAfter: 0.3 },
      { id: "humans", text: "तो उसे सही तरीके से समझना और aircraft को control करना अब भी इंसानों के लिए बेहद महत्वपूर्ण है।", say: "तो उसे सही तरीक़े से समझना, और एयरक्राफ़्ट को कंट्रोल करना, अब भी इंसानों के लिए, बेहद महत्वपूर्ण है।", pauseAfter: 1.5 },
    ],
  },
  {
    id: "ending",
    number: 12,
    title: "अंत",
    leadIn: 1.5,
    tail: 10,
    cues: [
      { id: "night", text: "1 जून 2009 की रात…", say: "एक जून, दो हज़ार नौ की रात...", pauseAfter: 0.3 },
      { id: "crossing", text: "AF447 Atlantic के ऊपर से गुजर रहा था।", say: "ए-एफ़ फ़ोर फ़ोर्टी-सेवन, अटलांटिक के ऊपर से गुज़र रहा था।", pauseAfter: 0.6 },
      { id: "minutes", text: "कुछ ही मिनटों में…", say: "कुछ ही मिनटों में...", pauseAfter: 0.3 },
      { id: "chain", text: "एक technical problem ने घटनाओं की ऐसी chain शुरू की जिसे उस समय cockpit में मौजूद लोगों के लिए समझना बेहद मुश्किल था।", say: "एक टेक्निकल प्रॉब्लम ने, घटनाओं की ऐसी चेन शुरू की, जिसे उस समय कॉकपिट में मौजूद लोगों के लिए, समझना बेहद मुश्किल था।", pauseAfter: 1 },
      { id: "lost", text: "228 लोग वापस नहीं लौटे।", say: "दो सौ अट्ठाईस लोग, वापस नहीं लौटे।", pauseAfter: 1.2 },
      { id: "lessons", text: "लेकिन उस दुर्घटना से मिले evidence ने aviation को कई महत्वपूर्ण lessons दिए।", say: "लेकिन उस दुर्घटना से मिले एविडेंस ने, एविएशन को, कई महत्वपूर्ण लेसन्स दिए।", pauseAfter: 2.5 },
      { id: "sometimes", text: "कभी-कभी सबसे बड़ी aviation mysteries…", say: "कभी-कभी, सबसे बड़ी एविएशन मिस्ट्रीज़...", pauseAfter: 0.3 },
      { id: "notPlace", text: "किसी रहस्यमय जगह पर खत्म नहीं होतीं।", say: "किसी रहस्यमय जगह पर, ख़त्म नहीं होतीं।", pauseAfter: 0.6 },
      { id: "answer", text: "उनका जवाब…", say: "उनका जवाब...", pauseAfter: 0.3 },
      { id: "sensor", text: "एक छोटे sensor…", say: "एक छोटे सेंसर...", pauseAfter: 0.3 },
      { id: "seconds", text: "कुछ seconds…", say: "कुछ सेकंड्स...", pauseAfter: 0.3 },
      { id: "decisions", text: "और उन seconds में लिए गए decisions में छिपा होता है।", say: "और उन सेकंड्स में लिए गए डिसिज़न्स में, छिपा होता है।", pauseAfter: 2 },
    ],
  },
];
