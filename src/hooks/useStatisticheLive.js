/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HOOK STATISTICHE LIVE - DATI IN TEMPO REALE PER COMPONENTI
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook per ottenere statistiche live dell'utente
 * @param {number} refreshInterval - Intervallo di refresh in ms (default 30000)
 */
export function useStatisticheLive(refreshInterval = 30000) {
  const { statistiche, caricaStatistiche, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      await caricaStatistiche();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, caricaStatistiche]);

  useEffect(() => {
    refresh();
    
    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refresh, refreshInterval]);

  return {
    statistiche,
    loading,
    error,
    refresh
  };
}

/**
 * Hook per la classifica
 */
export function useClassifica(limite = 10, periodo = 'settimana') {
  const { getClassifica, isAuthenticated } = useAuth();
  const [classifica, setClassifica] = useState([]);
  const [posizioneUtente, setPosizioneUtente] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await getClassifica(limite, periodo);
      setClassifica(data.classifica || []);
      setPosizioneUtente(data.posizioneUtente);
    } catch (err) {
      console.error('Errore caricamento classifica:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getClassifica, limite, periodo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    classifica,
    posizioneUtente,
    loading,
    refresh
  };
}

/**
 * Hook per le notifiche
 */
export function useNotifiche(limite = 20) {
  const { getNotifiche, segnaNotificaLetta, isAuthenticated } = useAuth();
  const [notifiche, setNotifiche] = useState([]);
  const [nonLette, setNonLette] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await getNotifiche(limite);
      setNotifiche(data.notifiche || []);
      setNonLette(data.nonLette || 0);
    } catch (err) {
      console.error('Errore caricamento notifiche:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getNotifiche, limite]);

  const segnaLetta = useCallback(async (notificaId) => {
    await segnaNotificaLetta(notificaId);
    await refresh();
  }, [segnaNotificaLetta, refresh]);

  useEffect(() => {
    refresh();
    
    // Refresh ogni 60 secondi
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    notifiche,
    nonLette,
    loading,
    refresh,
    segnaLetta
  };
}

/**
 * Hook per lo streak
 */
export function useStreak() {
  const { fetchAutenticato, isAuthenticated } = useAuth();
  const [streak, setStreak] = useState({
    corrente: 0,
    massimo: 0,
    freezeDisponibili: 3
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await fetchAutenticato('/api/stats/streak');
      if (response.ok) {
        const data = await response.json();
        setStreak(data);
      }
    } catch (err) {
      console.error('Errore caricamento streak:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchAutenticato]);

  const usaFreeze = useCallback(async () => {
    try {
      const response = await fetchAutenticato('/api/stats/streak/freeze', {
        method: 'POST'
      });
      if (response.ok) {
        await refresh();
        return true;
      }
    } catch (err) {
      console.error('Errore uso freeze:', err);
    }
    return false;
  }, [fetchAutenticato, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    streak,
    loading,
    refresh,
    usaFreeze
  };
}

/**
 * Hook per i badge
 */
export function useBadge() {
  const { fetchAutenticato, isAuthenticated } = useAuth();
  const [badge, setBadge] = useState([]);
  const [totaleOttenuti, setTotaleOttenuti] = useState(0);
  const [totaleBadge, setTotaleBadge] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await fetchAutenticato('/api/stats/badge');
      if (response.ok) {
        const data = await response.json();
        setBadge(data.badge || []);
        setTotaleOttenuti(data.totaleOttenuti || 0);
        setTotaleBadge(data.totaleBadge || 0);
      }
    } catch (err) {
      console.error('Errore caricamento badge:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchAutenticato]);

  const segnaBadgeVisto = useCallback(async (badgeId) => {
    try {
      await fetchAutenticato(`/api/stats/badge/${badgeId}/visto`, {
        method: 'POST'
      });
      await refresh();
    } catch (err) {
      console.error('Errore segna badge visto:', err);
    }
  }, [fetchAutenticato, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    badge,
    totaleOttenuti,
    totaleBadge,
    loading,
    refresh,
    segnaBadgeVisto
  };
}

/**
 * Hook per gli obiettivi giornalieri
 */
export function useObiettiviGiornalieri() {
  const { fetchAutenticato, isAuthenticated } = useAuth();
  const [obiettivi, setObiettivi] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await fetchAutenticato('/api/stats/obiettivi');
      if (response.ok) {
        const data = await response.json();
        setObiettivi(data);
      }
    } catch (err) {
      console.error('Errore caricamento obiettivi:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchAutenticato]);

  useEffect(() => {
    refresh();
    
    // Refresh ogni 5 minuti
    const interval = setInterval(refresh, 300000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Calcola progresso totale
  const progressoTotale = obiettivi.length > 0
    ? Math.round(obiettivi.reduce((acc, ob) => acc + (ob.corrente / ob.target) * 100, 0) / obiettivi.length)
    : 0;

  const completati = obiettivi.filter(ob => ob.completato).length;

  return {
    obiettivi,
    progressoTotale,
    completati,
    totale: obiettivi.length,
    loading,
    refresh
  };
}

/**
 * Hook per i grafici della dashboard
 */
export function useGraficiDashboard() {
  const { fetchAutenticato, isAuthenticated } = useAuth();
  const [graficoSettimana, setGraficoSettimana] = useState([]);
  const [graficoMaterie, setGraficoMaterie] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      const [settimanaRes, materieRes] = await Promise.all([
        fetchAutenticato('/api/stats/grafico/settimana'),
        fetchAutenticato('/api/stats/grafico/materie')
      ]);

      if (settimanaRes.ok) {
        setGraficoSettimana(await settimanaRes.json());
      }
      if (materieRes.ok) {
        setGraficoMaterie(await materieRes.json());
      }
    } catch (err) {
      console.error('Errore caricamento grafici:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchAutenticato]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    graficoSettimana,
    graficoMaterie,
    loading,
    refresh
  };
}

export default {
  useStatisticheLive,
  useClassifica,
  useNotifiche,
  useStreak,
  useBadge,
  useObiettiviGiornalieri,
  useGraficiDashboard
};
