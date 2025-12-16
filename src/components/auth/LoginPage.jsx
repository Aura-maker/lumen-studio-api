/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOGIN PAGE - PAGINA DI ACCESSO MODERNA E ELEGANTE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, registrati } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!nome.trim()) {
          setError('Inserisci il tuo nome');
          setLoading(false);
          return;
        }
        result = await registrati(nome, email, password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Si è verificato un errore. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background animato */}
      <div style={styles.backgroundGradient} />
      <div style={styles.backgroundPattern} />
      
      {/* Card principale */}
      <div style={styles.card}>
        {/* Logo e titolo */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoEmoji}>📚</span>
          </div>
          <h1 style={styles.title}>ImparaFacile</h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Bentornato! Accedi per continuare' : 'Crea il tuo account gratuito'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nome (solo registrazione) */}
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Il tuo nome"
                  style={styles.input}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="la-tua@email.com"
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Errore */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Pulsante submit */}
          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>⏳</span>
            ) : (
              isLogin ? 'Accedi' : 'Registrati'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>oppure</span>
        </div>

        {/* Social login */}
        <div style={styles.socialButtons}>
          <button style={styles.socialButton} type="button">
            <span style={styles.socialIcon}>🔵</span>
            Google
          </button>
          <button style={styles.socialButton} type="button">
            <span style={styles.socialIcon}>⚫</span>
            Apple
          </button>
        </div>

        {/* Switch login/registrazione */}
        <div style={styles.switchContainer}>
          <span style={styles.switchText}>
            {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={styles.switchButton}
          >
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </div>

        {/* Link password dimenticata */}
        {isLogin && (
          <div style={styles.forgotPassword}>
            <Link to="/reset-password" style={styles.forgotLink}>
              Password dimenticata?
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Continuando accetti i <a href="/termini" style={styles.footerLink}>Termini di Servizio</a> e 
          la <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STILI
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    zIndex: -2
  },
  
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: -1
  },
  
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'slideUp 0.5s ease-out'
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  
  logoContainer: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
  },
  
  logoEmoji: {
    fontSize: '40px'
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0'
  },
  
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    pointerEvents: 'none'
  },
  
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: '#f9fafb',
    boxSizing: 'border-box'
  },
  
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    fontSize: '14px'
  },
  
  errorIcon: {
    fontSize: '16px'
  },
  
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '8px'
  },
  
  loadingSpinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '16px'
  },
  
  dividerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: '13px',
    color: '#9ca3af',
    position: 'relative'
  },
  
  socialButtons: {
    display: 'flex',
    gap: '12px'
  },
  
  socialButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    background: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  
  socialIcon: {
    fontSize: '18px'
  },
  
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px'
  },
  
  switchText: {
    fontSize: '14px',
    color: '#6b7280'
  },
  
  switchButton: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  },
  
  forgotPassword: {
    textAlign: 'center',
    marginTop: '16px'
  },
  
  forgotLink: {
    fontSize: '14px',
    color: '#667eea',
    textDecoration: 'none'
  },
  
  footer: {
    marginTop: '24px',
    textAlign: 'center'
  },
  
  footerText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  
  footerLink: {
    color: 'white',
    textDecoration: 'underline'
  }
};

// Aggiungi animazioni CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #667eea !important;
    background: white !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
  }
  
  .social-button:hover {
    background: #e5e7eb !important;
    border-color: #d1d5db !important;
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;
