/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROTECTED ROUTE - PROTEZIONE PAGINE AUTENTICATE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostra loading mentre verifica autenticazione
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Caricamento...</p>
      </div>
    );
  }

  // Se non autenticato, redirect a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  spinner: {
    fontSize: '48px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
    marginTop: '16px'
  }
};

export default ProtectedRoute;
