"""
mock_data.py — Hardcoded Q&A data for prototype demo
Contains questions and answers for Class 6-10 in Hindi, Tamil, and Bengali
"""

import random
from typing import Dict, List, Tuple

# Structure: {grade: {language: [(question, answer, topic_tag, confidence), ...]}}
MOCK_QA_DATA: Dict[int, Dict[str, List[Tuple[str, str, str, str]]]] = {
    6: {
        "hi": [
            ("प्रकाश संश्लेषण क्या है?", 
             "प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड की मदद से अपना भोजन बनाते हैं। इस प्रक्रिया में ऑक्सीजन भी निकलती है जो हमारे लिए जरूरी है।",
             "photosynthesis", "high"),
            ("अंश और हर क्या होते हैं?",
             "भिन्न में ऊपर वाली संख्या को अंश और नीचे वाली संख्या को हर कहते हैं। जैसे 3/4 में 3 अंश है और 4 हर है। हर बताता है कि पूरी चीज़ को कितने भागों में बांटा गया है।",
             "fractions", "high"),
            ("पानी का चक्र कैसे काम करता है?",
             "पानी का चक्र तीन मुख्य चरणों में होता है: वाष्पीकरण (पानी भाप बनता है), संघनन (भाप बादल बनती है), और वर्षा (बादलों से बारिश होती है)। यह चक्र लगातार चलता रहता है।",
             "water-cycle", "high"),
            ("जड़ और चेतन में क्या अंतर है?",
             "जड़ वस्तुएं वे हैं जो गति नहीं कर सकतीं जैसे पत्थर, मेज। चेतन वस्तुएं वे हैं जो जीवित हैं और गति कर सकती हैं जैसे पौधे, जानवर। चेतन वस्तुएं भोजन लेती हैं और बढ़ती हैं।",
             "living-nonliving", "high"),
            ("सौर मंडल में कितने ग्रह हैं?",
             "सौर मंडल में 8 ग्रह हैं: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, यूरेनस और नेपच्यून। सूर्य के सबसे पास बुध है और सबसे दूर नेपच्यून है।",
             "solar-system", "high"),
        ],
        "ta": [
            ("ஒளிச்சேர்க்கை என்றால் என்ன?",
             "ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடு ஆகியவற்றைப் பயன்படுத்தி தங்கள் உணவை உருவாக்கும் செயல்முறையாகும். இந்த செயல்முறையில் ஆக்சிஜனும் வெளியிடப்படுகிறது.",
             "photosynthesis", "high"),
            ("பின்னத்தில் தொகுதி மற்றும் பகுதி என்றால் என்ன?",
             "பின்னத்தில் மேலே உள்ள எண் தொகுதி மற்றும் கீழே உள்ள எண் பகுதி எனப்படும். உதாரணமாக 3/4 இல் 3 தொகுதி மற்றும் 4 பகுதியாகும்।",
             "fractions", "high"),
            ("நீர் சுழற்சி எப்படி செயல்படுகிறது?",
             "நீர் சுழற்சி மூன்று முக்கிய படிகளில் நடக்கிறது: ஆவியாதல் (நீர் நீராவியாகிறது), ஒடுக்கம் (நீராவி மேகமாகிறது), மற்றும் மழை (மேகங்களிலிருந்து மழை பெய்கிறது)।",
             "water-cycle", "high"),
            ("உயிருள்ளவை மற்றும் உயிரற்றவை என்ன?",
             "உயிரற்றவை அசையாதவை, உதாரணம் கல், மேசை. உயிருள்ளவை வாழும் மற்றும் அசையக்கூடியவை, உதாரணம் தாவரங்கள், விலங்குகள். உயிருள்ளவை உணவு உண்பது மற்றும் வளருகின்றன.",
             "living-nonliving", "high"),
            ("சூரிய குடும்பத்தில் எத்தனை கோள்கள் உள்ளன?",
             "சூரிய குடும்பத்தில் 8 கோள்கள் உள்ளன: புதன், வெள்ளி, பூமி, செவ்வாய், வியாழன், சனி, யூரேனஸ் மற்றும் நெப்டியூன். சூரியனுக்கு மிக அருகில் புதன் உள்ளது.",
             "solar-system", "high"),
        ],
        "bn": [
            ("সালোকসংশ্লেষণ কী?",
             "সালোকসংশ্লেষণ হল সেই প্রক্রিয়া যেখানে উদ্ভিদ সূর্যের আলো, পানি এবং কার্বন ডাই অক্সাইড ব্যবহার করে নিজের খাদ্য তৈরি করে। এই প্রক্রিয়ায় অক্সিজেনও তৈরি হয় যা আমাদের জন্য প্রয়োজনীয়।",
             "photosynthesis", "high"),
            ("ভগ্নাংশে লব এবং হর কী?",
             "ভগ্নাংশে উপরের সংখ্যাকে লব এবং নিচের সংখ্যাকে হর বলে। যেমন 3/4 এ 3 হল লব এবং 4 হল হর। হর বলে দেয় পুরো জিনিসটি কতগুলি ভাগে ভাগ করা হয়েছে।",
             "fractions", "high"),
            ("জল চক্র কীভাবে কাজ করে?",
             "জল চক্র তিনটি প্রধান ধাপে ঘটে: বাষ্পীভবন (পানি বাষ্প হয়), ঘনীভবন (বাষ্প মেঘ হয়), এবং বৃষ্টি (মেঘ থেকে বৃষ্টি হয়)। এই চক্র ক্রমাগত চলতে থাকে।",
             "water-cycle", "high"),
        ],
        "en": [
            ("What is photosynthesis?",
             "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to make their own food. This process also releases oxygen which is essential for us.",
             "photosynthesis", "high"),
            ("What are numerator and denominator in fractions?",
             "In a fraction, the top number is called the numerator and the bottom number is called the denominator. For example, in 3/4, 3 is the numerator and 4 is the denominator. The denominator tells us how many equal parts the whole is divided into.",
             "fractions", "high"),
            ("How does the water cycle work?",
             "The water cycle happens in three main steps: evaporation (water becomes vapor), condensation (vapor forms clouds), and precipitation (rain falls from clouds). This cycle continues constantly.",
             "water-cycle", "high"),
            ("What is the difference between living and non-living things?",
             "Non-living things cannot move on their own, like rocks and tables. Living things are alive and can move, like plants and animals. Living things eat food and grow.",
             "living-nonliving", "high"),
            ("How many planets are in the solar system?",
             "There are 8 planets in the solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Mercury is closest to the Sun and Neptune is farthest.",
             "solar-system", "high"),
        ],
    },
    7: {
        "hi": [
            ("पाइथागोरस प्रमेय क्या है?",
             "समकोण त्रिभुज में कर्ण का वर्ग दोनों भुजाओं के वर्गों के योग के बराबर होता है। यानी a² + b² = c² जहाँ c कर्ण है। उदाहरण: 3² + 4² = 5² यानी 9 + 16 = 25।",
             "pythagoras", "high"),
            ("परमाणु और अणु में क्या अंतर है?",
             "परमाणु किसी तत्व का सबसे छोटा कण है जिसे और नहीं तोड़ा जा सकता। अणु दो या अधिक परमाणुओं से मिलकर बनता है। जैसे पानी का अणु (H₂O) दो हाइड्रोजन और एक ऑक्सीजन परमाणु से बना है।",
             "atoms", "high"),
            ("गुरुत्वाकर्षण क्या है?",
             "गुरुत्वाकर्षण वह बल है जो सभी वस्तुओं को पृथ्वी की ओर खींचता है। इसी कारण चीजें ऊपर फेंकने पर नीचे गिरती हैं। चंद्रमा पर गुरुत्वाकर्षण पृथ्वी से कम है इसलिए वहाँ चीजें हल्की लगती हैं।",
             "gravity", "high"),
            ("प्रतिशत कैसे निकालते हैं?",
             "प्रतिशत निकालने के लिए संख्या को 100 से गुणा करके कुल से भाग दें। जैसे 25 में से 5 का प्रतिशत = (5/25) × 100 = 20%। प्रतिशत का मतलब है प्रति सौ।",
             "percentages", "high"),
            ("पाचन तंत्र कैसे काम करता है?",
             "भोजन मुंह से शुरू होकर पेट में जाता है जहाँ पाचन रस इसे तोड़ते हैं। फिर छोटी आंत में पोषक तत्व अवशोषित होते हैं। बची हुई चीजें बड़ी आंत से होकर बाहर निकल जाती हैं।",
             "digestive-system", "high"),
        ],
        "ta": [
            ("பித்தகோரஸ் தேற்றம் என்றால் என்ன?",
             "செங்கோண முக்கோணத்தில் கர்ணத்தின் வர்க்கம் மற்ற இரு பக்கங்களின் வர்க்கங்களின் கூட்டுத்தொகைக்கு சமம். அதாவது a² + b² = c² என்று கர்ணம். உதாரணம்: 3² + 4² = 5².",
             "pythagoras", "high"),
            ("அணு மற்றும் மூலக்கூறு என்ன வேறுபாடு?",
             "அணு ஒரு தனிமத்தின் மிகச் சிறிய துகள். மூலக்கூறு இரண்டு அல்லது அதற்கு மேற்பட்ட அணுக்களால் ஆனது. உதாரணமாக நீரின் மூலக்கூறு (H₂O) இரண்டு ஹைட்ரஜன் மற்றும் ஒரு ஆக்சிஜன் அணுக்களால் ஆனது.",
             "atoms", "high"),
            ("புவியீர்ப்பு என்றால் என்ன?",
             "புவியீர்ப்பு அனைத்து பொருட்களையும் பூமியை நோக்கி இழுக்கும் விசை. இதனால்தான் பொருட்கள் மேலே எறியும்போது கீழே விழுகின்றன. சந்திரனில் புவியீர்ப்பு பூமியை விட குறைவு.",
             "gravity", "high"),
        ],
        "bn": [
            ("পিথাগোরাসের উপপাদ্য কী?",
             "সমকোণী ত্রিভুজে কর্ণের বর্গ অন্য দুই বাহুর বর্গের সমষ্টির সমান। অর্থাৎ a² + b² = c² যেখানে c কর্ণ। উদাহরণ: 3² + 4² = 5² অর্থাৎ 9 + 16 = 25।",
             "pythagoras", "high"),
            ("পরমাণু এবং অণু কী পার্থক্য?",
             "পরমাণু একটি মৌলের ক্ষুদ্রতম কণা। অণু দুই বা তার বেশি পরমাণু দিয়ে গঠিত। যেমন পানির অণু (H₂O) দুটি হাইড্রোজেন এবং একটি অক্সিজেন পরমাণু দিয়ে তৈরি।",
             "atoms", "high"),
        ],
        "en": [
            ("What is the Pythagorean theorem?",
             "In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides. That is, a² + b² = c² where c is the hypotenuse. Example: 3² + 4² = 5², which means 9 + 16 = 25.",
             "pythagoras", "high"),
            ("What is the difference between atoms and molecules?",
             "An atom is the smallest particle of an element that cannot be broken down further. A molecule is made up of two or more atoms. For example, a water molecule (H₂O) is made of two hydrogen atoms and one oxygen atom.",
             "atoms", "high"),
            ("What is gravity?",
             "Gravity is the force that pulls all objects toward the Earth. This is why things fall down when thrown up. Gravity on the Moon is less than on Earth, so things feel lighter there.",
             "gravity", "high"),
            ("How do you calculate percentages?",
             "To calculate percentage, multiply the number by 100 and divide by the total. For example, 5 out of 25 as a percentage = (5/25) × 100 = 20%. Percentage means per hundred.",
             "percentages", "high"),
            ("How does the digestive system work?",
             "Food starts from the mouth and goes to the stomach where digestive juices break it down. Then nutrients are absorbed in the small intestine. The remaining waste goes through the large intestine and exits the body.",
             "digestive-system", "high"),
        ],
    },
    8: {
        "hi": [
            ("गति और वेग में क्या अंतर है?",
             "गति बताती है कि कोई वस्तु कितनी तेज चल रही है (जैसे 50 km/h)। वेग बताता है कि वस्तु किस दिशा में कितनी तेज चल रही है (जैसे 50 km/h उत्तर की ओर)। वेग में दिशा जरूरी है।",
             "motion", "high"),
            ("विद्युत धारा क्या है?",
             "विद्युत धारा इलेक्ट्रॉनों के प्रवाह को कहते हैं। जब किसी तार में बैटरी लगाई जाती है तो इलेक्ट्रॉन एक दिशा में चलने लगते हैं। इसी को धारा कहते हैं जिसे एम्पियर में मापा जाता है।",
             "simple-circuit", "high"),
            ("कोशिका क्या है?",
             "कोशिका सभी जीवों की मूल इकाई है। यह बहुत छोटी होती है जिसे माइक्रोस्कोप से देखा जाता है। कोशिका में न्यूक्लियस, साइटोप्लाज्म और कोशिका झिल्ली होती है। सभी जीवित चीजें कोशिकाओं से बनी हैं।",
             "cells", "high"),
            ("समीकरण को हल कैसे करें?",
             "समीकरण हल करने के लिए अज्ञात को एक तरफ और संख्याओं को दूसरी तरफ रखें। जैसे 2x + 5 = 15 में, पहले 5 घटाएं: 2x = 10, फिर 2 से भाग दें: x = 5। दोनों तरफ एक ही क्रिया करें।",
             "algebra", "high"),
            ("रासायनिक अभिक्रिया क्या है?",
             "रासायनिक अभिक्रिया में पदार्थ बदलकर नए पदार्थ बनते हैं। जैसे लोहे में जंग लगना - लोहा और ऑक्सीजन मिलकर लोहे का ऑक्साइड बनाते हैं। इसमें रंग, गंध या तापमान बदल सकता है।",
             "chemistry", "high"),
        ],
        "ta": [
            ("வேகம் மற்றும் திசைவேகம் என்ன வேறுபாடு?",
             "வேகம் ஒரு பொருள் எவ்வளவு வேகமாக நகர்கிறது என்பதை மட்டும் கூறுகிறது (எ.கா. 50 km/h). திசைவேகம் எந்த திசையில் எவ்வளவு வேகமாக நகர்கிறது என்று கூறுகிறது. திசைவேகத்தில் திசை அவசியம்.",
             "motion", "high"),
            ("மின்னோட்டம் என்றால் என்ன?",
             "மின்னோட்டம் எலக்ட்ரான்களின் ஓட்டம். ஒரு கம்பியில் மின்கலம் இணைக்கப்படும் போது எலக்ட்ரான்கள் ஒரு திசையில் நகரத் தொடங்குகின்றன. இதை ஆம்பியரில் அளவிடுகிறோம்.",
             "simple-circuit", "high"),
        ],
        "bn": [
            ("গতি এবং বেগ কী পার্থক্য?",
             "গতি বলে কোনো বস্তু কত দ্রুত চলছে (যেমন 50 km/h)। বেগ বলে বস্তুটি কোন দিকে কত দ্রুত চলছে (যেমন 50 km/h উত্তর দিকে)। বেগে দিক প্রয়োজন।",
             "motion", "high"),
            ("তড়িৎ প্রবাহ কী?",
             "তড়িৎ প্রবাহ ইলেকট্রনের প্রবাহ। যখন একটি তারে ব্যাটারি সংযুক্ত করা হয় তখন ইলেকট্রন এক দিকে চলতে শুরু করে। এটিকে এমপিয়ারে মাপা হয়।",
             "simple-circuit", "high"),
        ],
        "en": [
            ("What is the difference between speed and velocity?",
             "Speed tells how fast an object is moving (like 50 km/h). Velocity tells how fast and in which direction an object is moving (like 50 km/h north). Direction is essential in velocity.",
             "motion", "high"),
            ("What is electric current?",
             "Electric current is the flow of electrons. When a battery is connected to a wire, electrons start moving in one direction. This is called current and is measured in amperes.",
             "simple-circuit", "high"),
            ("What is a cell?",
             "A cell is the basic unit of all living things. It is very small and viewed under a microscope. A cell has a nucleus, cytoplasm, and cell membrane. All living things are made of cells.",
             "cells", "high"),
            ("How do you solve equations?",
             "To solve an equation, keep the unknown on one side and numbers on the other. For example, in 2x + 5 = 15, first subtract 5: 2x = 10, then divide by 2: x = 5. Do the same operation on both sides.",
             "algebra", "high"),
            ("What is a chemical reaction?",
             "In a chemical reaction, substances change to form new substances. Like iron rusting - iron and oxygen combine to form iron oxide. Color, smell, or temperature may change in the process.",
             "chemistry", "high"),
        ],
    },
    9: {
        "hi": [
            ("न्यूटन के गति के नियम क्या हैं?",
             "पहला नियम: वस्तु अपनी अवस्था में तब तक रहती है जब तक बाहरी बल न लगे। दूसरा नियम: बल = द्रव्यमान × त्वरण (F=ma)। तीसरा नियम: प्रत्येक क्रिया की बराबर और विपरीत प्रतिक्रिया होती है।",
             "newtons-laws", "high"),
            ("DNA क्या है?",
             "DNA (डीऑक्सीराइबोन्यूक्लिक एसिड) हमारे जींस की वाहक है। यह दोहरी कुंडली के रूप में होता है और सभी आनुवंशिक जानकारी रखता है। DNA माता-पिता से बच्चों में जाता है और हमारे शरीर की सभी विशेषताओं को निर्धारित करता है।",
             "dna", "high"),
            ("द्विघात समीकरण क्या है?",
             "द्विघात समीकरण में चर का उच्चतम घात 2 होता है। सामान्य रूप: ax² + bx + c = 0। इसे हल करने के लिए गुणनखंड विधि या सूत्र x = [-b ± √(b²-4ac)]/2a का उपयोग करते हैं।",
             "quadratic", "high"),
            ("ऊर्जा संरक्षण का नियम क्या है?",
             "ऊर्जा न तो बनाई जा सकती है न नष्ट की जा सकती है, केवल एक रूप से दूसरे रूप में बदली जा सकती है। जैसे बल्ब में विद्युत ऊर्जा प्रकाश और ऊष्मा में बदलती है। कुल ऊर्जा हमेशा संरक्षित रहती है।",
             "energy", "high"),
        ],
        "ta": [
            ("நியூட்டனின் இயக்க விதிகள் என்ன?",
             "முதல் விதி: ஒரு பொருள் வெளிப்புற விசை பயன்படுத்தப்படும் வரை அதன் நிலையில் இருக்கும். இரண்டாம் விதி: விசை = நிறை × முடுக்கம் (F=ma). மூன்றாம் விதி: ஒவ்வொரு செயலுக்கும் சம மற்றும் எதிர் எதிர்வினை உண்டு.",
             "newtons-laws", "high"),
            ("DNA என்றால் என்ன?",
             "DNA (டிஆக்ஸிரைபோநியூக்ளிக் அமிலம்) நமது மரபணுக்களை சுமந்து செல்கிறது. இது இரட்டை சுருள் வடிவில் உள்ளது மற்றும் அனைத்து மரபியல் தகவல்களையும் கொண்டுள்ளது.",
             "dna", "high"),
        ],
        "bn": [
            ("নিউটনের গতির সূত্র কী?",
             "প্রথম সূত্র: বস্তু তার অবস্থায় থাকে যতক্ষণ না বাইরের বল প্রয়োগ করা হয়। দ্বিতীয় সূত্র: বল = ভর × ত্বরণ (F=ma)। তৃতীয় সূত্র: প্রতিটি ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া আছে।",
             "newtons-laws", "high"),
        ],
        "en": [
            ("What are Newton's laws of motion?",
             "First law: An object remains in its state until an external force is applied. Second law: Force = mass × acceleration (F=ma). Third law: Every action has an equal and opposite reaction.",
             "newtons-laws", "high"),
            ("What is DNA?",
             "DNA (Deoxyribonucleic Acid) carries our genes. It is in the form of a double helix and holds all genetic information. DNA passes from parents to children and determines all our body characteristics.",
             "dna", "high"),
            ("What is a quadratic equation?",
             "In a quadratic equation, the highest power of the variable is 2. General form: ax² + bx + c = 0. To solve it, we use factorization or the formula x = [-b ± √(b²-4ac)]/2a.",
             "quadratic", "high"),
            ("What is the law of conservation of energy?",
             "Energy can neither be created nor destroyed, only converted from one form to another. For example, in a bulb, electrical energy converts to light and heat. Total energy is always conserved.",
             "energy", "high"),
        ],
    },
    10: {
        "hi": [
            ("रासायनिक समीकरण को संतुलित कैसे करें?",
             "रासायनिक समीकरण में दोनों तरफ परमाणुओं की संख्या बराबर होनी चाहिए। गुणांक बदलें लेकिन सबस्क्रिप्ट नहीं। उदाहरण: H₂ + O₂ → H₂O असंतुलित है, संतुलित रूप: 2H₂ + O₂ → 2H₂O।",
             "chemistry", "high"),
            ("प्रकाश का परावर्तन क्या है?",
             "जब प्रकाश किसी सतह से टकराकर वापस लौटता है तो उसे परावर्तन कहते हैं। परावर्तन के नियम: आपतन कोण = परावर्तन कोण। दर्पण में हमारा प्रतिबिंब परावर्तन के कारण दिखता है।",
             "reflection", "high"),
            ("त्रिकोणमिति में sin, cos, tan क्या हैं?",
             "समकोण त्रिभुज में: sin = लंब/कर्ण, cos = आधार/कर्ण, tan = लंब/आधार। ये कोण और भुजाओं के बीच संबंध बताते हैं। 30°, 45°, 60° के मान याद रखें - ये परीक्षा में बहुत आते हैं।",
             "trigonometry", "high"),
            ("इलेक्ट्रॉन विन्यास क्या है?",
             "इलेक्ट्रॉन विन्यास बताता है कि परमाणु में इलेक्ट्रॉन कैसे व्यवस्थित हैं। पहले K shell (2 electrons), फिर L shell (8), फिर M shell (18)। उदाहरण: सोडियम (11) का विन्यास = 2, 8, 1।",
             "atoms", "high"),
            ("समांतर श्रेणी क्या है?",
             "समांतर श्रेणी में प्रत्येक पद अगले पद से एक निश्चित संख्या (सार्व अंतर) से अलग होता है। जैसे 2, 5, 8, 11... (सार्व अंतर = 3)। n वां पद = a + (n-1)d जहाँ a पहला पद और d सार्व अंतर है।",
             "arithmetic-progression", "high"),
        ],
        "ta": [
            ("வேதியியல் சமன்பாட்டை சமநிலைப்படுத்துவது எப்படி?",
             "வேதியியல் சமன்பாட்டில் இருபுறமும் அணுக்களின் எண்ணிக்கை சமமாக இருக்க வேண்டும். குணகங்களை மாற்றவும் ஆனால் கீழெழுத்துக்களை அல்ல. உதாரணம்: 2H₂ + O₂ → 2H₂O சமநிலையானது.",
             "chemistry", "high"),
            ("ஒளி பிரதிபலிப்பு என்றால் என்ன?",
             "ஒளி ஒரு மேற்பரப்பில் மோதி திரும்பும்போது அதை பிரதிபலிப்பு என்கிறோம். பிரதிபலிப்பு விதி: நிழல் கோணம் = பிரதிபலிப்பு கோணம். கண்ணாடியில் நமது பிம்பம் பிரதிபலிப்பால் தெரிகிறது.",
             "reflection", "high"),
        ],
        "bn": [
            ("রাসায়নিক সমীকরণ সমতুল্য কীভাবে করবেন?",
             "রাসায়নিক সমীকরণে উভয় পাশে পরমাণুর সংখ্যা সমান হতে হবে। সহগ পরিবর্তন করুন কিন্তু সাবস্ক্রিপ্ট নয়। উদাহরণ: 2H₂ + O₂ → 2H₂O সমতুল্য।",
             "chemistry", "high"),
            ("আলোর প্রতিফলন কী?",
             "যখন আলো কোনো পৃষ্ঠ থেকে ফিরে আসে তাকে প্রতিফলন বলে। প্রতিফলনের নিয়ম: আপতন কোণ = প্রতিফলন কোণ। আয়নায় আমাদের প্রতিবিম্ব প্রতিফলনের কারণে দেখা যায়।",
             "reflection", "high"),
        ],
        "en": [
            ("How do you balance chemical equations?",
             "In a chemical equation, the number of atoms must be equal on both sides. Change coefficients but not subscripts. Example: H₂ + O₂ → H₂O is unbalanced; balanced form is 2H₂ + O₂ → 2H₂O.",
             "chemistry", "high"),
            ("What is reflection of light?",
             "When light hits a surface and bounces back, it is called reflection. Law of reflection: angle of incidence = angle of reflection. Our image in a mirror is visible due to reflection.",
             "reflection", "high"),
            ("What are sin, cos, tan in trigonometry?",
             "In a right-angled triangle: sin = perpendicular/hypotenuse, cos = base/hypotenuse, tan = perpendicular/base. These show the relationship between angles and sides. Remember values for 30°, 45°, 60° - they appear frequently in exams.",
             "trigonometry", "high"),
            ("What is electron configuration?",
             "Electron configuration tells how electrons are arranged in an atom. First K shell (2 electrons), then L shell (8), then M shell (18). Example: Sodium (11) configuration = 2, 8, 1.",
             "atoms", "high"),
            ("What is an arithmetic progression?",
             "In an arithmetic progression, each term differs from the next by a fixed number (common difference). For example, 2, 5, 8, 11... (common difference = 3). The nth term = a + (n-1)d where a is the first term and d is the common difference.",
             "arithmetic-progression", "high"),
        ],
    },
}


def get_questions_list(language: str, grade: int) -> list[str]:
    """
    Return list of all available questions for a given language and grade.
    """
    grade_data = MOCK_QA_DATA.get(grade, {})
    lang_data = grade_data.get(language, [])
    
    if not lang_data:
        # Fallback to Hindi if language not found
        lang_data = grade_data.get("hi", [])
    
    # Extract just the questions
    return [q for q, _, _, _ in lang_data]


def get_mock_answer(question: str, language: str, grade: int) -> dict:
    """
    Return a mock answer based on grade and language.
    If exact question match found, return that. Otherwise return a random answer from that grade/language.
    """
    grade_data = MOCK_QA_DATA.get(grade, {})
    lang_data = grade_data.get(language, [])
    
    if not lang_data:
        # Fallback to Hindi if language not found
        lang_data = grade_data.get("hi", [])
    
    if not lang_data:
        # Ultimate fallback
        return {
            "answer": "यह एक प्रोटोटाइप है। कृपया कक्षा 6-10 के प्रश्न पूछें।" if language == "hi" else "This is a prototype. Please ask questions for Class 6-10.",
            "confidence": "medium",
            "topic_tag": "general",
            "diagram_eligible": False,
        }
    
    # Check for exact or partial match
    question_lower = question.lower()
    for q, ans, topic, conf in lang_data:
        if q.lower() in question_lower or question_lower in q.lower():
            return {
                "answer": ans,
                "confidence": conf,
                "topic_tag": topic,
                "diagram_eligible": topic in ["photosynthesis", "water-cycle", "pythagoras", "fractions", "simple-circuit", "digestive-system"],
                "diagram_data": _get_diagram_data(topic) if topic in ["fractions", "pythagoras"] else None,
            }
    
    # No match found, return a random answer from the same grade/language
    q, ans, topic, conf = random.choice(lang_data)
    return {
        "answer": ans,
        "confidence": conf,
        "topic_tag": topic,
        "diagram_eligible": topic in ["photosynthesis", "water-cycle", "pythagoras", "fractions", "simple-circuit", "digestive-system"],
        "diagram_data": _get_diagram_data(topic) if topic in ["fractions", "pythagoras"] else None,
    }


def _get_diagram_data(topic: str) -> dict:
    """Return diagram data for topics that support it."""
    if topic == "fractions":
        return {"numerator": 3, "denominator": 4}
    elif topic == "pythagoras":
        return {"side_a": 3, "side_b": 4, "hypotenuse": 5}
    return {}


def get_mock_practice_questions(topic_tag: str, language: str, grade: int) -> list:
    """Return 5 mock practice MCQ questions for the given topic."""
    # This is simplified - just return generic questions
    questions_data = {
        "hi": [
            {
                "question": f"{topic_tag} के बारे में: यह क्या है?",
                "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} का मुख्य उद्देश्य क्या है?",
                "options": ["उद्देश्य 1", "उद्देश्य 2", "उद्देश्य 3", "उद्देश्य 4"],
                "correct_index": 1
            },
            {
                "question": f"{topic_tag} में सबसे महत्वपूर्ण क्या है?",
                "options": ["तत्व A", "तत्व B", "तत्व C", "तत्व D"],
                "correct_index": 2
            },
            {
                "question": f"{topic_tag} का उदाहरण क्या है?",
                "options": ["उदाहरण 1", "उदाहरण 2", "उदाहरण 3", "उदाहरण 4"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} को कैसे समझें?",
                "options": ["तरीका 1", "तरीका 2", "तरीका 3", "तरीका 4"],
                "correct_index": 3
            },
        ],
        "ta": [
            {
                "question": f"{topic_tag} பற்றி: இது என்ன?",
                "options": ["விருப்பம் A", "விருப்பம் B", "விருப்பம் C", "விருப்பம் D"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} இன் முக்கிய நோக்கம் என்ன?",
                "options": ["நோக்கம் 1", "நோக்கம் 2", "நோக்கம் 3", "நோக்கம் 4"],
                "correct_index": 1
            },
            {
                "question": f"{topic_tag} இல் மிக முக்கியமானது என்ன?",
                "options": ["கூறு A", "கூறு B", "கூறு C", "கூறு D"],
                "correct_index": 2
            },
            {
                "question": f"{topic_tag} உதாரணம் என்ன?",
                "options": ["உதாரணம் 1", "உதாரணம் 2", "உதாரணம் 3", "உதாரணம் 4"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} எப்படி புரிந்து கொள்வது?",
                "options": ["வழி 1", "வழி 2", "வழி 3", "வழி 4"],
                "correct_index": 3
            },
        ],
        "bn": [
            {
                "question": f"{topic_tag} সম্পর্কে: এটি কী?",
                "options": ["বিকল্প A", "বিকল্প B", "বিকল্প C", "বিকল্প D"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} এর মূল উদ্দেশ্য কী?",
                "options": ["উদ্দেশ্য 1", "উদ্দেশ্য 2", "উদ্দেশ্য 3", "উদ্দেশ্য 4"],
                "correct_index": 1
            },
            {
                "question": f"{topic_tag} এ সবচেয়ে গুরুত্বপূর্ণ কী?",
                "options": ["উপাদান A", "উপাদান B", "উপাদান C", "উপাদান D"],
                "correct_index": 2
            },
            {
                "question": f"{topic_tag} এর উদাহরণ কী?",
                "options": ["উদাহরণ 1", "উদাহরণ 2", "উদাহরণ 3", "উদাহরণ 4"],
                "correct_index": 0
            },
            {
                "question": f"{topic_tag} কীভাবে বুঝবেন?",
                "options": ["পদ্ধতি 1", "পদ্ধতি 2", "পদ্ধতি 3", "পদ্ধতি 4"],
                "correct_index": 3
            },
        ],
        "en": [
            {
                "question": f"About {topic_tag}: What is it?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_index": 0
            },
            {
                "question": f"What is the main purpose of {topic_tag}?",
                "options": ["Purpose 1", "Purpose 2", "Purpose 3", "Purpose 4"],
                "correct_index": 1
            },
            {
                "question": f"What is most important in {topic_tag}?",
                "options": ["Element A", "Element B", "Element C", "Element D"],
                "correct_index": 2
            },
            {
                "question": f"What is an example of {topic_tag}?",
                "options": ["Example 1", "Example 2", "Example 3", "Example 4"],
                "correct_index": 0
            },
            {
                "question": f"How to understand {topic_tag}?",
                "options": ["Method 1", "Method 2", "Method 3", "Method 4"],
                "correct_index": 3
            },
        ],
    }
    
    return questions_data.get(language, questions_data["en"])
