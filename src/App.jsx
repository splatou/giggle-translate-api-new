import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [age, setAge] = useState(3);
  const [language, setLanguage] = useState('auto'); // Default: auto-detect
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const typingTimeoutRef = useRef(null);
  const API_URL = 'http://localhost:3001';
  

  // Expanded language list
  const languages = {
    auto: 'Detect language',
    af: 'Afrikaans',
    sq: 'Albanian',
    am: 'Amharic',
    ar: 'Arabic',
    hy: 'Armenian',
    az: 'Azerbaijani',
    eu: 'Basque',
    be: 'Belarusian',
    bn: 'Bengali',
    bs: 'Bosnian',
    bg: 'Bulgarian',
    ca: 'Catalan',
    ceb: 'Cebuano',
    ny: 'Chichewa',
    zh: 'Chinese',
    co: 'Corsican',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    en: 'English',
    eo: 'Esperanto',
    et: 'Estonian',
    tl: 'Filipino',
    fi: 'Finnish',
    fr: 'French',
    fy: 'Frisian',
    gl: 'Galician',
    ka: 'Georgian',
    de: 'German',
    el: 'Greek',
    gu: 'Gujarati',
    ht: 'Haitian Creole',
    ha: 'Hausa',
    haw: 'Hawaiian',
    he: 'Hebrew',
    hi: 'Hindi',
    hmn: 'Hmong',
    hu: 'Hungarian',
    is: 'Icelandic',
    ig: 'Igbo',
    id: 'Indonesian',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    jw: 'Javanese',
    kn: 'Kannada',
    kk: 'Kazakh',
    km: 'Khmer',
    ko: 'Korean',
    ku: 'Kurdish',
    ky: 'Kyrgyz',
    lo: 'Lao',
    la: 'Latin',
    lv: 'Latvian',
    lt: 'Lithuanian',
    lb: 'Luxembourgish',
    mk: 'Macedonian',
    mg: 'Malagasy',
    ms: 'Malay',
    ml: 'Malayalam',
    mt: 'Maltese',
    mi: 'Maori',
    mr: 'Marathi',
    mn: 'Mongolian',
    my: 'Myanmar (Burmese)',
    ne: 'Nepali',
    no: 'Norwegian',
    ps: 'Pashto',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    pa: 'Punjabi',
    ro: 'Romanian',
    ru: 'Russian',
    sm: 'Samoan',
    gd: 'Scots Gaelic',
    sr: 'Serbian',
    st: 'Sesotho',
    sn: 'Shona',
    sd: 'Sindhi',
    si: 'Sinhala',
    sk: 'Slovak',
    sl: 'Slovenian',
    so: 'Somali',
    es: 'Spanish',
    su: 'Sundanese',
    sw: 'Swahili',
    sv: 'Swedish',
    tg: 'Tajik',
    ta: 'Tamil',
    te: 'Telugu',
    th: 'Thai',
    tr: 'Turkish',
    uk: 'Ukrainian',
    ur: 'Urdu',
    uz: 'Uzbek',
    vi: 'Vietnamese',
    cy: 'Welsh',
    xh: 'Xhosa',
    yi: 'Yiddish',
    yo: 'Yoruba',
    zu: 'Zulu'
  };

  // Add this useEffect to handle clicking outside the language selector
  useEffect(() => {
    function handleClickOutside(event) {
      const languageSelector = document.getElementById('language-selector');
      if (languageSelector && !languageSelector.contains(event.target)) {
        setShowLanguageSelector(false);
      }
    }
    
    if (showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);

  // Improved language detection function
  const detectLanguage = async (text) => {
    if (!text.trim()) return 'en';
    
    // For short texts, use the backend API
    if (text.length < 50) {
      try {
        const response = await fetch(`${API_URL}/api/detect-language`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        
        const data = await response.json();
        const detectedCode = data.detectedLanguage;
        
        // Validate that the response is a known language code
        if (languages[detectedCode]) {
          return detectedCode;
        }
        return 'en'; // Default to English if the response isn't a valid code
      } catch (error) {
        console.error("Error detecting language:", error);
        return 'en'; // Default to English on error
      }
    }
    
    // Keep the regex detection for longer texts
    // ... rest of your existing regex detection code ...
  };

  // Main explanation generation function
  const generateExplanation = async (inputText) => {
    if (!inputText.trim()) {
      setExplanation('');
      return;
    }
    
    setIsLoading(true);
    
    // Detect language from input text
    const detected = await detectLanguage(inputText);
    setDetectedLanguage(detected);
    
    // If auto-detection is enabled and a language is detected, use it
    const currentLanguage = language === 'auto' ? detected : language;
    
    try {
      const response = await fetch(`${API_URL}/api/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: inputText,
          age: age,
          language: languages[currentLanguage]
        }),
      });
      
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error calling API:", error);
      setExplanation("Oops! I couldn't get an explanation right now. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
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
      {/* Header - removed icons */}
      <header className="flex justify-center items-center px-4 py-2 border-b">
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
          {/* Language selector with 3-column layout */}
          <div className="relative" id="language-selector">
            <div 
              className="w-48 bg-white rounded-full py-3 px-4 text-center shadow-md cursor-pointer"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{languages[language]}</span>
                <svg className="fill-current h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            {showLanguageSelector && (
              <div className="absolute z-10 bottom-full mb-2 bg-white rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
                {/* Detect language option */}
                <div 
                  className={`py-2 px-3 cursor-pointer rounded hover:bg-blue-100 ${language === 'auto' ? 'bg-blue-200' : ''}`}
                  onClick={() => {
                    setLanguage('auto');
                    setShowLanguageSelector(false);
                  }}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-500 font-semibold">Detect language</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {Object.entries(languages).map(([code, name]) => {
                    // Skip the auto-detect option as we've already added it
                    if (code === 'auto') return null;
                    
                    return (
                      <div 
                        key={code}
                        className={`py-2 px-3 cursor-pointer rounded hover:bg-gray-100 ${language === code ? 'bg-gray-200' : ''}`}
                        onClick={() => {
                          setLanguage(code);
                          setShowLanguageSelector(false);
                        }}
                      >
                        <span className="text-gray-700 text-sm">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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