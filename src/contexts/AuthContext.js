/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTH CONTEXT - GESTIONE AUTENTICAZIONE E STATO UTENTE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Fornisce:
 * - Login/Logout/Registrazione
 * - Gestione token JWT
 * - Refresh automatico token
 * - Stato utente globale
 * - Statistiche live
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// URL base API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [statistiche, setStatistiche] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH CON AUTENTICAZIONE
  // ═══════════════════════════════════════════════════════════════════════════

  const fetchAutenticato = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include' // Per i cookie del refresh token
    });

    // Se token scaduto, prova refresh
    if (response.status === 401 && token) {
      const refreshed = await refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${refreshed}`;
        return fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include'
        });
      }
    }

    return response;
  }, [token]);

  // ═══════════════════════════════════════════════════════════════════════════
  // REFRESH TOKEN
  // ═══════════════════════════════════════════════════════════════════════════

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return data.token;
      }
    } catch (error) {
      console.error('Errore refresh token:', error);
    }
    
    // Refresh fallito, logout
    logout();
    return null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CARICA PROFILO UTENTE
  // ═══════════════════════════════════════════════════════════════════════════

  const caricaProfilo = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetchAutenticato('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUtente(data.utente);
        
        // Carica anche statistiche
        await caricaStatistiche();
      } else {
        // Token non valido
        logout();
      }
    } catch (error) {
      console.error('Errore caricamento profilo:', error);
    } finally {
      setLoading(false);
    }
  }, [token, fetchAutenticato]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CARICA STATISTICHE LIVE
  // ═══════════════════════════════════════════════════════════════════════════

  const caricaStatistiche = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await fetchAutenticato('/api/stats/dashboard');
      
      if (response.ok) {
        const data = await response.json();
        setStatistiche(data);
        return data;
      }
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
    }
    return null;
  }, [token, fetchAutenticato]);

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════════════════════════════════════

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUtente(data.utente);
        localStorage.setItem('token', data.token);
        
        // Carica statistiche dopo login
        setTimeout(() => caricaStatistiche(), 100);
        
        return { success: true, utente: data.utente };
      } else {
        return { success: false, error: data.errore || 'Credenziali non valide' };
      }
    } catch (error) {
      console.error('Errore login:', error);
      return { success: false, error: 'Errore di connessione' };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRAZIONE
  // ═══════════════════════════════════════════════════════════════════════════

  const registrati = async (nome, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/registrati`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nome, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUtente(data.utente);
        localStorage.setItem('token', data.token);
        return { success: true, utente: data.utente };
      } else {
        return { success: false, error: data.errore || data.errors?.[0]?.msg || 'Errore registrazione' };
      }
    } catch (error) {
      console.error('Errore registrazione:', error);
      return { success: false, error: 'Errore di connessione' };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGOUT
  // ═══════════════════════════════════════════════════════════════════════════

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Errore logout:', error);
    }

    setToken(null);
    setUtente(null);
    setStatistiche(null);
    localStorage.removeItem('token');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRA ATTIVITÀ (per aggiornare statistiche live)
  // ═══════════════════════════════════════════════════════════════════════════

  const registraQuiz = async (dati) => {
    try {
      const response = await fetchAutenticato('/api/stats/quiz', {
        method: 'POST',
        body: JSON.stringify(dati)
      });

      if (response.ok) {
        const risultato = await response.json();
        // Aggiorna statistiche locali
        await caricaStatistiche();
        return risultato;
      }
    } catch (error) {
      console.error('Errore registra quiz:', error);
    }
    return null;
  };

  const registraFlashcard = async (dati) => {
    try {
      const response = await fetchAutenticato('/api/stats/flashcard', {
        method: 'POST',
        body: JSON.stringify(dati)
      });

      if (response.ok) {
        const risultato = await response.json();
        await caricaStatistiche();
        return risultato;
      }
    } catch (error) {
      console.error('Errore registra flashcard:', error);
    }
    return null;
  };

  const registraSessione = async (dati) => {
    try {
      const response = await fetchAutenticato('/api/stats/sessione', {
        method: 'POST',
        body: JSON.stringify(dati)
      });

      if (response.ok) {
        const risultato = await response.json();
        await caricaStatistiche();
        return risultato;
      }
    } catch (error) {
      console.error('Errore registra sessione:', error);
    }
    return null;
  };

  const registraEsame = async (dati) => {
    try {
      const response = await fetchAutenticato('/api/stats/esame', {
        method: 'POST',
        body: JSON.stringify(dati)
      });

      if (response.ok) {
        const risultato = await response.json();
        await caricaStatistiche();
        return risultato;
      }
    } catch (error) {
      console.error('Errore registra esame:', error);
    }
    return null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICHE
  // ═══════════════════════════════════════════════════════════════════════════

  const getNotifiche = async (limite = 20) => {
    try {
      const response = await fetchAutenticato(`/api/stats/notifiche?limite=${limite}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Errore get notifiche:', error);
    }
    return { notifiche: [], nonLette: 0 };
  };

  const segnaNotificaLetta = async (notificaId) => {
    try {
      await fetchAutenticato(`/api/stats/notifiche/${notificaId}/letta`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Errore segna notifica letta:', error);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASSIFICA
  // ═══════════════════════════════════════════════════════════════════════════

  const getClassifica = async (limite = 10, periodo = 'sempre') => {
    try {
      const response = await fetchAutenticato(`/api/stats/classifica?limite=${limite}&periodo=${periodo}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Errore get classifica:', error);
    }
    return { classifica: [], posizioneUtente: null };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  // Carica profilo all'avvio
  useEffect(() => {
    caricaProfilo();
  }, [caricaProfilo]);

  // Refresh statistiche ogni 30 secondi se loggato
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      caricaStatistiche();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, caricaStatistiche]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════

  const value = {
    // Stato
    utente,
    token,
    loading,
    isAuthenticated: !!token && !!utente,
    statistiche,

    // Auth
    login,
    registrati,
    logout,
    refreshToken,

    // Profilo
    caricaProfilo,
    caricaStatistiche,

    // Attività
    registraQuiz,
    registraFlashcard,
    registraSessione,
    registraEsame,

    // Notifiche
    getNotifiche,
    segnaNotificaLetta,

    // Classifica
    getClassifica,

    // Fetch autenticato
    fetchAutenticato
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook per usare il context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
}

export default AuthContext;
