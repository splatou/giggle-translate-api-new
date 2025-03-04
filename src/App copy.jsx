import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [age, setAge] = useState(3);
  const [language, setLanguage] = useState('auto'); // Default: auto-detect
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef(null);

  // List of supported languages (added Norwegian and Indonesian)
  const languages = {
    auto: 'Auto-detect',
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    nl: 'Dutch',
    no: 'Norwegian',
    id: 'Indonesian',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi'
  };

  // Simple language detection based on character sets
  const detectLanguage = (text) => {
    if (!text.trim()) return 'en';
    
    // This is a very simplified language detection
    // In a real app, you would use a proper language detection API or library
    
    // Regex patterns for different languages
    const patterns = {
      ru: /[А-Яа-я]/g, // Cyrillic (Russian)
      zh: /[\u4E00-\u9FFF]/g, // Chinese
      ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g, // Japanese
      ko: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, // Korean
      ar: /[\u0600-\u06FF]/g, // Arabic
      hi: /[\u0900-\u097F]/g, // Hindi
    };
    
    // Check for matches with non-Latin scripts
    for (const [code, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return code;
      }
    }
    
    // For Latin-based scripts, a more sophisticated approach would be needed
    // For now, defaulting to English for Latin scripts
    return 'en';
  };

  const generateExplanation = async (inputText) => {
    if (!inputText.trim()) {
      setExplanation('');
      return;
    }
    
    setIsLoading(true);
    
    // Detect language from input text
    const detected = detectLanguage(inputText);
    setDetectedLanguage(detected);
    
    // If auto-detection is enabled and a language is detected, use it
    const currentLanguage = language === 'auto' ? detected : language;
    
    // This would be replaced with an actual API call to Claude or ChatGPT
    // Simulating API call with setTimeout
    setTimeout(() => {
      // Sample explanations for different languages (just for demo)
      const explanationsByLanguage = {
        en: {
          2: {
            faded: "It means something was bright and pretty, but now it's not so bright anymore. Like when colors get sleepy.",
            default: "This is when something used to be bright but now it's not so bright."
          },
          3: {
            faded: "It means something used to be bright and colorful, but now it's not so bright anymore. Like when your favorite shirt gets washed many times and the color isn't as pretty as before.",
            default: "This means something that was once bright and strong now looks more soft and not as clear."
          },
          4: {
            faded: "When something is faded, it used to be very bright but now it's more dull. Like when a crayon drawing gets left in the sun and the colors get lighter.",
            default: "This means something has lost its bright color over time."
          },
          5: {
            faded: "Faded means something that was once very colorful now has lighter colors. Like when your favorite book cover gets old and the picture isn't as bright anymore.",
            default: "This is when something loses its bright colors or strong look over time."
          },
          6: {
            faded: "When something is faded, its colors have gotten lighter over time. Think about how your jeans might look less blue after washing them many times.",
            default: "This describes when something gradually loses its color or brightness over time."
          },
          7: {
            faded: "When something is faded, it means its color or brightness has slowly disappeared over time. Like when you leave a drawing in the sun for too long and the colors get lighter.",
            default: "This means something has lost its brightness, color, or intensity gradually over time or because of exposure to things like sunlight or washing."
          },
          8: {
            faded: "Faded means something has gradually lost some of its color or brightness. For example, clothes that have been washed many times often become faded and don't look as bright as when they were new.",
            default: "This describes when something has gradually lost its vivid appearance or intensity over time."
          },
          9: {
            faded: "When something is faded, it has gradually lost its original color or brightness due to things like sunlight, washing, or just getting old. Think of a poster that's been hanging in a sunny window for a long time.",
            default: "This refers to something that has gradually become less bright, less intense, or less distinct over time."
          },
          10: {
            faded: "Faded describes something that has lost its original vibrant color or intensity over time due to exposure to elements like sun, water, or air. Old photographs and well-worn clothes are common examples of things that become faded.",
            default: "This describes a gradual loss of color, intensity, or clarity in something due to age, exposure, or repeated use."
          }
        },
        es: {
          3: {
            faded: "Significa que algo solía ser brillante y colorido, pero ahora no es tan brillante. Como cuando tu camisa favorita se lava muchas veces y el color no es tan bonito como antes.",
            default: "Esto significa que algo que antes era brillante y fuerte ahora se ve más suave y no tan claro."
          },
          // Other Spanish explanations would go here
        },
        fr: {
          3: {
            faded: "Cela signifie que quelque chose était brillant et coloré, mais maintenant ce n'est plus aussi brillant. Comme quand ton t-shirt préféré est lavé plusieurs fois et la couleur n'est plus aussi jolie qu'avant.",
            default: "Cela signifie que quelque chose qui était autrefois brillant et fort semble maintenant plus doux et moins clair."
          },
          // Other French explanations would go here
        },
        no: {
          3: {
            faded: "Det betyr at noe som var lyst og fargerikt, er ikke så lyst lenger. Som når din favoritt-t-skjorte blir vasket mange ganger og fargen ikke er like fin som før.",
            default: "Dette betyr at noe som en gang var lyst og sterkt nå ser mer mykt og ikke så klart ut."
          },
          // Other Norwegian explanations would go here
        },
        id: {
          3: {
            faded: "Ini berarti sesuatu yang dulunya terang dan berwarna, sekarang tidak begitu terang lagi. Seperti ketika baju favoritmu dicuci berkali-kali dan warnanya tidak secantik sebelumnya.",
            default: "Ini berarti sesuatu yang dulunya terang dan jelas sekarang terlihat lebih pudar dan tidak sejelas sebelumnya."
          },
          // Other Indonesian explanations would go here
        }
        // Other languages would be added here
      };
      
      // Default to English if we don't have explanations for the detected/selected language
      const languageExplanations = explanationsByLanguage[currentLanguage] || explanationsByLanguage.en;
      const ageGroup = languageExplanations[age] || languageExplanations[5];
      const wordExplanation = ageGroup[inputText.toLowerCase()] || ageGroup.default;
      
      setExplanation(wordExplanation);
      setIsLoading(false);
    }, 1000);
  };

  // Handle text input with debounce
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      generateExplanation(text);
    }, 800); // Wait 800ms after user stops typing

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text]);

  // Handle age or language changes
  useEffect(() => {
    if (text.trim()) {
      generateExplanation(text);
    }
  }, [age, language]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b">
        <div className="w-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <div className="flex items-center">
          <span className="text-blue-500 font-bold text-2xl">G</span>
          <span className="text-red-500 font-bold text-2xl">i</span>
          <span className="text-yellow-500 font-bold text-2xl">g</span>
          <span className="text-blue-500 font-bold text-2xl">g</span>
          <span className="text-green-500 font-bold text-2xl">l</span>
          <span className="text-red-500 font-bold text-2xl">e</span>
          <span className="text-blue-500 font-bold text-2xl"> </span>
          <span className="text-yellow-500 font-bold text-2xl">T</span>
          <span className="text-green-500 font-bold text-2xl">r</span>
          <span className="text-red-500 font-bold text-2xl">a</span>
          <span className="text-blue-500 font-bold text-2xl">n</span>
          <span className="text-yellow-500 font-bold text-2xl">s</span>
          <span className="text-green-500 font-bold text-2xl">l</span>
          <span className="text-red-500 font-bold text-2xl">a</span>
          <span className="text-blue-500 font-bold text-2xl">t</span>
          <span className="text-yellow-500 font-bold text-2xl">e</span>
        </div>
        <div className="w-10">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Input area */}
        <div className="p-4 border-b flex-1">
          <textarea
            className="w-full h-full text-2xl text-gray-600 focus:outline-none resize-none"
            placeholder="Enter word"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Output area */}
        <div className="p-4 border-b flex-1 bg-gray-50">
          <div className="w-full h-full text-lg text-gray-700 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              explanation
            )}
          </div>
        </div>
      </main>

      {/* Footer with language and age selectors */}
      <footer className="bg-gray-100 p-4">
        <div className="flex justify-center items-center space-x-4">
          {/* Language selector */}
          <div className="w-48 bg-white rounded-full py-3 px-4 text-center shadow-md">
            <select 
              className="bg-transparent focus:outline-none w-full text-center text-gray-700"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Age selector */}
          <div className="w-32 bg-white rounded-full py-3 px-4 text-center shadow-md">
            <select 
              className="bg-transparent focus:outline-none w-full text-center text-gray-700"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            >
              <option value={2}>Age 2</option>
              <option value={3}>Age 3</option>
              <option value={4}>Age 4</option>
              <option value={5}>Age 5</option>
              <option value={6}>Age 6</option>
              <option value={7}>Age 7</option>
              <option value={8}>Age 8</option>
              <option value={9}>Age 9</option>
              <option value={10}>Age 10</option>
            </select>
          </div>
        </div>
        
        {/* Show detected language when auto-detect is on */}
        {language === 'auto' && detectedLanguage && (
          <div className="text-center text-sm text-gray-500 mt-2">
            Detected: {languages[detectedLanguage] || 'Unknown'}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;