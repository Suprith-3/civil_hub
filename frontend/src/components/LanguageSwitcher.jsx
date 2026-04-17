import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { IoLanguageOutline } from 'react-icons/io5';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher-container">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lang-top-btn"
      >
        <IoLanguageOutline className="lang-icon" />
        <span>{currentLanguage.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="lang-dropdown"
          >
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => changeLanguage(lang.code)}
                className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .language-switcher-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .lang-top-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px border-solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .lang-icon {
          font-size: 1.2rem;
        }

        .lang-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          width: 150px;
          background: rgba(15, 15, 25, 0.9);
          backdrop-filter: blur(16px);
          border: 1px border-solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          margin-top: 8px;
        }

        .lang-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .lang-option.active {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.1);
        }

        .lang-flag {
          font-size: 1.1rem;
        }

        .lang-name {
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
