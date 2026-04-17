/* 
  🎨 ANIMATED UI COMPONENT LIBRARY
  For Construction Ecosystem Platform
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiBell, 
  FiMenu, 
  FiX,
  FiCheck,
  FiAlertCircle,
  FiMapPin,
  FiShoppingCart
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// =====================================================
// 1. ANIMATED BUTTONS
// =====================================================

export const PrimaryButton = ({ children, onClick, loading }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '12px 32px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#FF6B35',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="button-primary"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 1 : 0 }}
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          border: '3px solid white',
          borderRadius: '50%',
          borderTop: '3px solid transparent',
          animation: loading ? 'spin 1s linear infinite' : 'none'
        }}
      />
      <motion.span animate={{ opacity: loading ? 0 : 1 }}>
        {children}
      </motion.span>
    </motion.button>
  );
};

export const SecondaryButton = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, backgroundColor: '#F8F9FA' }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '12px 32px',
        fontSize: '16px',
        fontWeight: '600',
        border: '2px solid #004E89',
        borderRadius: '8px',
        backgroundColor: 'white',
        color: '#004E89',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </motion.button>
  );
};

// =====================================================
// 2. ANIMATED CARDS
// =====================================================

export const ServiceCard = ({ title, icon: Icon, description }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 8px 32px rgba(255, 107, 53, 0.2)' }}
      style={{
        padding: '24px',
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontSize: '32px',
          color: '#FF6B35',
          marginBottom: '12px'
        }}
      >
        <Icon />
      </motion.div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1A1A1A' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
        {description}
      </p>
    </motion.div>
  );
};

export const ProductCard = ({ image, title, price, rating, onAddCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer'
      }}
    >
      {/* Image */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        style={{
          height: '200px',
          backgroundColor: '#F0F0F0',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1A1A1A' }}>
          {title}
        </h4>
        
        {/* Rating */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ fontSize: '14px', color: i < rating ? '#FBD863' : '#DDD' }}
            >
              ★
            </motion.span>
          ))}
        </div>

        {/* Price & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35' }}>
            ₹{price}
          </span>
          <motion.button
            onClick={() => {
              setIsAdded(true);
              onAddCart?.();
              setTimeout(() => setIsAdded(false), 2000);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isAdded ? '#06D6A0' : '#FF6B35',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            {isAdded ? '✓' : '+'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// =====================================================
// 3. ANIMATED FORM INPUTS
// =====================================================

export const AnimatedInput = ({ label, type = 'text', value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div style={{ marginBottom: '20px', position: 'relative' }}>
      <motion.label
        animate={{
          y: isFocused || value ? -24 : 0,
          fontSize: isFocused || value ? '12px' : '14px',
          color: isFocused ? '#FF6B35' : '#666'
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          left: '12px',
          backgroundColor: 'white',
          padding: '0 4px',
          pointerEvents: 'none'
        }}
      >
        {label}
      </motion.label>

      <motion.input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChange={onChange}
        type={type}
        animate={{
          borderColor: error ? '#D62828' : isFocused ? '#FF6B35' : '#DDD',
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(255, 107, 53, 0.1)' 
            : '0 0 0 0px rgba(255, 107, 53, 0)'
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: '100%',
          padding: '12px 12px',
          border: '2px solid #DDD',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'Inter',
          outline: 'none'
        }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '12px',
            color: '#D62828',
            marginTop: '6px'
          }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// =====================================================
// 4. ANIMATED NOTIFICATIONS
// =====================================================

export const NotificationToast = ({ 
  message, 
  type = 'success', // 'success' | 'error' | 'info'
  onClose 
}) => {
  const colors = {
    success: '#06D6A0',
    error: '#D62828',
    info: '#004E89'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ'
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        maxWidth: '400px'
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: '24px',
          color: colors[type],
          fontWeight: 'bold'
        }}
      >
        {icons[type]}
      </motion.span>
      <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
        {message}
      </span>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#999',
          marginLeft: 'auto'
        }}
      >
        ✕
      </motion.button>
    </motion.div>
  );
};

// =====================================================
// 5. ANIMATED NAVBAR
// =====================================================

export const Navbar = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'white',
        padding: '16px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#FF6B35',
          cursor: 'pointer'
        }}
      >
        🏗️ BuildHub
      </motion.div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {[
          { name: t('welcome'), path: '/user-dashboard' },
          { name: t('shop'), path: '/shop' },
          { name: t('schemes'), path: '/schemes' }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
          >
            <Link
              to={item.path}
              style={{
                textDecoration: 'none',
                color: '#666',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Right Side (Notifications + User) */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* Notification Bell */}
        <motion.div
          style={{ position: 'relative', cursor: 'pointer' }}
          whileHover={{ scale: 1.1 }}
        >
          <FiBell size={24} color="#666" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#D62828',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.div>

        {/* User Dropdown */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
          onClick={onLogout}
        >
          {t('logout')}
        </motion.button>
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </motion.button>
    </motion.nav>
  );
};

// =====================================================
// 6. ANIMATED MODALS
// =====================================================

export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          maxWidth: '500px',
          width: '90%'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A' }}>
            {title}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ✕
          </motion.button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

// =====================================================
// 7. ANIMATED LOADING STATES
// =====================================================

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            height: '300px',
            backgroundColor: '#E0E0E0',
            borderRadius: '12px'
          }}
        />
      ))}
    </div>
  );
};

export const LoadingSpinner = ({ size = 40, color = '#FF6B35' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `4px solid ${color}30`,
        borderTop: `4px solid ${color}`,
        borderRadius: '50%'
      }}
    />
  );
};

// =====================================================
// 8. ANIMATED LIST/TIMELINE
// =====================================================

export const Timeline = ({ items }) => {
  return (
    <div style={{ position: 'relative', paddingLeft: '40px' }}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            marginBottom: '24px',
            position: 'relative'
          }}
        >
          {/* Timeline Dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            style={{
              position: 'absolute',
              left: '-40px',
              top: '0px',
              width: '24px',
              height: '24px',
              backgroundColor: item.completed ? '#06D6A0' : '#FF6B35',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 0 0 2px #FF6B35'
            }}
          />
          
          {/* Content */}
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: `3px solid ${item.completed ? '#06D6A0' : '#FF6B35'}`
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              {item.title}
            </h4>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {item.description}
            </p>
            <span style={{ fontSize: '11px', color: '#999' }}>
              {item.date}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// =====================================================
// 9. ANIMATED HERO SECTION
// =====================================================

export const HeroSection = ({ title, subtitle, image, primaryCTA, secondaryCTA }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '48px',
      alignItems: 'center',
      padding: '80px 40px',
      backgroundColor: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
      color: 'white',
      borderRadius: '20px',
      marginBottom: '40px'
    }}>
      {/* Left Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.95,
            lineHeight: '1.6'
          }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', gap: '16px' }}
        >
          <PrimaryButton>{primaryCTA}</PrimaryButton>
          <SecondaryButton>{secondaryCTA}</SecondaryButton>
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
};

// =====================================================
// 10. ANIMATED GRID WITH SCROLL REVEAL
// =====================================================

export const AnimatedGrid = ({ items, columns = 3 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '24px'
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default {
  PrimaryButton,
  SecondaryButton,
  ServiceCard,
  ProductCard,
  AnimatedInput,
  NotificationToast,
  Navbar,
  Modal,
  SkeletonLoader,
  LoadingSpinner,
  Timeline,
  HeroSection,
  AnimatedGrid
};
