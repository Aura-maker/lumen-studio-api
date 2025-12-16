/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DASHBOARD LIVE - STATISTICHE IN TEMPO REALE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Dashboard completa con:
 * - XP e livello
 * - Streak
 * - Grafici attività
 * - Obiettivi giornalieri
 * - Classifica
 * - Badge
 * - Notifiche
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  useStatisticheLive, 
  useClassifica, 
  useNotifiche, 
  useStreak, 
  useBadge,
  useObiettiviGiornalieri,
  useGraficiDashboard
} from '../../hooks/useStatisticheLive';

const DashboardLive = () => {
  const { utente, isAuthenticated } = useAuth();
  const { statistiche, loading: loadingStats } = useStatisticheLive();
  const { classifica, posizioneUtente } = useClassifica(10, 'settimana');
  const { notifiche, nonLette, segnaLetta } = useNotifiche();
  const { streak, usaFreeze } = useStreak();
  const { badge, totaleOttenuti, totaleBadge } = useBadge();
  const { obiettivi, progressoTotale, completati } = useObiettiviGiornalieri();
  const { graficoSettimana, graficoMaterie } = useGraficiDashboard();
  
  const [showNotifiche, setShowNotifiche] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={styles.loginPrompt}>
        <h2>Accedi per vedere le tue statistiche</h2>
        <p>Effettua il login per visualizzare la dashboard personalizzata</p>
      </div>
    );
  }

  if (loadingStats) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Caricamento statistiche...</p>
      </div>
    );
  }

  const profilo = statistiche?.profilo || {};

  return (
    <div style={styles.container}>
      {/* Header con profilo */}
      <div style={styles.header}>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {profilo.avatarUrl ? (
              <img src={profilo.avatarUrl} alt={profilo.nome} style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarEmoji}>👤</span>
            )}
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.userName}>Ciao, {profilo.nome || utente?.nome}!</h1>
            <p style={styles.userLevel}>Livello {profilo.livello || 1}</p>
          </div>
        </div>
        
        {/* Notifiche */}
        <div style={styles.notificheContainer}>
          <button 
            style={styles.notificheButton}
            onClick={() => setShowNotifiche(!showNotifiche)}
          >
            🔔
            {nonLette > 0 && (
              <span style={styles.notificheBadge}>{nonLette}</span>
            )}
          </button>
          
          {showNotifiche && (
            <div style={styles.notificheDropdown}>
              <h3 style={styles.notificheTitle}>Notifiche</h3>
              {notifiche.length === 0 ? (
                <p style={styles.noNotifiche}>Nessuna notifica</p>
              ) : (
                notifiche.slice(0, 5).map(n => (
                  <div 
                    key={n.id} 
                    style={{
                      ...styles.notificaItem,
                      background: n.letta ? '#f9fafb' : '#eff6ff'
                    }}
                    onClick={() => segnaLetta(n.id)}
                  >
                    <strong>{n.titolo}</strong>
                    <p>{n.corpo}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats principali */}
      <div style={styles.statsGrid}>
        {/* XP Card */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{profilo.xpTotale?.toLocaleString() || 0}</span>
            <span style={styles.statLabel}>XP Totali</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${profilo.progressoLivello || 0}%`
              }}
            />
          </div>
          <span style={styles.progressText}>
            {profilo.xpPerProssimoLivello || 0} XP al livello {(profilo.livello || 1) + 1}
          </span>
        </div>

        {/* Streak Card */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{streak.corrente}</span>
            <span style={styles.statLabel}>Giorni di streak</span>
          </div>
          <div style={styles.streakInfo}>
            <span>Record: {streak.massimo} giorni</span>
            <span>❄️ Freeze: {streak.freezeDisponibili}</span>
          </div>
        </div>

        {/* Quiz Card */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{profilo.statistiche?.quizCompletati || 0}</span>
            <span style={styles.statLabel}>Quiz completati</span>
          </div>
          <span style={styles.accuratezza}>
            Accuratezza: {profilo.statistiche?.accuratezzaMedia || 0}%
          </span>
        </div>

        {/* Studio Card */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>
              {Math.floor((profilo.statistiche?.minutiStudioTotali || 0) / 60)}h
            </span>
            <span style={styles.statLabel}>Ore di studio</span>
          </div>
          <span style={styles.sessioni}>
            {profilo.statistiche?.sessioniStudio || 0} sessioni
          </span>
        </div>
      </div>

      {/* Obiettivi giornalieri */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎯 Obiettivi di oggi</h2>
        <div style={styles.obiettiviContainer}>
          {obiettivi.map(ob => (
            <div key={ob.id} style={styles.obiettivoCard}>
              <div style={styles.obiettivoHeader}>
                <span style={styles.obiettivoIcon}>
                  {ob.tipoObiettivo === 'xp' ? '⭐' : 
                   ob.tipoObiettivo === 'quiz' ? '📝' : '⏱️'}
                </span>
                <span style={styles.obiettivoTitolo}>
                  {ob.tipoObiettivo === 'xp' ? 'Guadagna XP' :
                   ob.tipoObiettivo === 'quiz' ? 'Completa quiz' : 'Minuti di studio'}
                </span>
                {ob.completato && <span style={styles.checkmark}>✅</span>}
              </div>
              <div style={styles.obiettivoProgress}>
                <div style={styles.obiettivoBar}>
                  <div 
                    style={{
                      ...styles.obiettivoFill,
                      width: `${Math.min(100, (ob.corrente / ob.target) * 100)}%`,
                      background: ob.completato ? '#10b981' : '#667eea'
                    }}
                  />
                </div>
                <span style={styles.obiettivoText}>
                  {ob.corrente}/{ob.target}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.progressoTotale}>
          Progresso giornaliero: {progressoTotale}% ({completati}/{obiettivi.length} completati)
        </div>
      </div>

      {/* Grafico settimana */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Attività settimanale</h2>
        <div style={styles.graficoContainer}>
          {graficoSettimana.map((giorno, i) => (
            <div key={i} style={styles.graficoGiorno}>
              <div style={styles.graficoBarContainer}>
                <div 
                  style={{
                    ...styles.graficoBar,
                    height: `${Math.min(100, (giorno.minutiStudio / 60) * 100)}%`
                  }}
                />
              </div>
              <span style={styles.graficoLabel}>{giorno.giorno}</span>
              <span style={styles.graficoValue}>{giorno.minutiStudio}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Classifica e Badge */}
      <div style={styles.twoColumns}>
        {/* Classifica */}
        <div style={styles.columnCard}>
          <h2 style={styles.sectionTitle}>🏆 Classifica settimanale</h2>
          <div style={styles.classificaList}>
            {classifica.slice(0, 5).map((user, i) => (
              <div 
                key={user.id} 
                style={{
                  ...styles.classificaItem,
                  background: user.id === utente?.id ? '#eff6ff' : 'transparent'
                }}
              >
                <span style={styles.classificaPosizione}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <span style={styles.classificaNome}>{user.nome}</span>
                <span style={styles.classificaXP}>{user.xpSettimana || user.xpTotale} XP</span>
              </div>
            ))}
          </div>
          {posizioneUtente && posizioneUtente > 5 && (
            <div style={styles.tuaPosizione}>
              La tua posizione: #{posizioneUtente}
            </div>
          )}
        </div>

        {/* Badge */}
        <div style={styles.columnCard}>
          <h2 style={styles.sectionTitle}>🏅 Badge ({totaleOttenuti}/{totaleBadge})</h2>
          <div style={styles.badgeGrid}>
            {badge.slice(0, 8).map(b => (
              <div 
                key={b.id} 
                style={{
                  ...styles.badgeItem,
                  opacity: b.sbloccato ? 1 : 0.4
                }}
                title={b.descrizione}
              >
                <span style={styles.badgeIcon}>{b.nome?.split(' ')[0] || '🏅'}</span>
                <span style={styles.badgeName}>{b.nome?.split(' ').slice(1).join(' ') || b.id}</span>
                {!b.sbloccato && b.progresso && (
                  <div style={styles.badgeProgress}>
                    {b.progresso.percentuale}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer con ultimo aggiornamento */}
      <div style={styles.footer}>
        <span>Ultimo aggiornamento: {new Date().toLocaleTimeString()}</span>
        <span>Dati in tempo reale</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STILI
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  
  loginPrompt: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#6b7280'
  },
  
  spinner: {
    fontSize: '48px',
    animation: 'spin 1s linear infinite'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  
  avatarEmoji: {
    fontSize: '32px'
  },
  
  profileInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  
  userName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0
  },
  
  userLevel: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    margin: 0
  },
  
  notificheContainer: {
    position: 'relative'
  },
  
  notificheButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: '#f3f4f6',
    fontSize: '20px',
    cursor: 'pointer',
    position: 'relative'
  },
  
  notificheBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px'
  },
  
  notificheDropdown: {
    position: 'absolute',
    top: '56px',
    right: 0,
    width: '320px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    padding: '16px',
    zIndex: 100
  },
  
  notificheTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  
  noNotifiche: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px'
  },
  
  notificaItem: {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px'
  },
  
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a2e'
  },
  
  statLabel: {
    fontSize: '14px',
    color: '#6b7280'
  },
  
  progressBar: {
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  
  progressText: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  
  streakInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280'
  },
  
  accuratezza: {
    fontSize: '14px',
    color: '#10b981',
    fontWeight: '600'
  },
  
  sessioni: {
    fontSize: '12px',
    color: '#6b7280'
  },
  
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '20px'
  },
  
  obiettiviContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  obiettivoCard: {
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px'
  },
  
  obiettivoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  
  obiettivoIcon: {
    fontSize: '20px'
  },
  
  obiettivoTitolo: {
    flex: 1,
    fontWeight: '500'
  },
  
  checkmark: {
    fontSize: '16px'
  },
  
  obiettivoProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  obiettivoBar: {
    flex: 1,
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  
  obiettivoFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  
  obiettivoText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    minWidth: '60px',
    textAlign: 'right'
  },
  
  progressoTotale: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  },
  
  graficoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '200px',
    padding: '20px 0'
  },
  
  graficoGiorno: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  
  graficoBarContainer: {
    width: '40px',
    height: '120px',
    background: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  
  graficoBar: {
    width: '100%',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px 8px 0 0',
    transition: 'height 0.3s ease'
  },
  
  graficoLabel: {
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151'
  },
  
  graficoValue: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  
  columnCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  
  classificaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  classificaItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px'
  },
  
  classificaPosizione: {
    width: '32px',
    fontSize: '16px'
  },
  
  classificaNome: {
    flex: 1,
    fontWeight: '500'
  },
  
  classificaXP: {
    fontWeight: '600',
    color: '#667eea'
  },
  
  tuaPosizione: {
    marginTop: '12px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  },
  
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },
  
  badgeIcon: {
    fontSize: '24px',
    marginBottom: '4px'
  },
  
  badgeName: {
    fontSize: '10px',
    textAlign: 'center',
    color: '#374151'
  },
  
  badgeProgress: {
    fontSize: '10px',
    color: '#667eea',
    fontWeight: '600'
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9ca3af',
    padding: '16px 0'
  }
};

export default DashboardLive;
