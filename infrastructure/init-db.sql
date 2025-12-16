-- ═══════════════════════════════════════════════════════════════════════════════
-- INIT DATABASE - OTTIMIZZAZIONI PER PRODUZIONE
-- ═══════════════════════════════════════════════════════════════════════════════
-- Eseguito automaticamente al primo avvio del container PostgreSQL

-- Estensioni utili
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Per ricerca full-text
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ─────────────────────────────────────────────────────────────────────────────
-- INDICI AGGIUNTIVI PER PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

-- Indici per ricerca utenti
CREATE INDEX IF NOT EXISTS idx_utente_email_lower ON "Utente" (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_utente_nome_trgm ON "Utente" USING gin (nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_utente_punti ON "Utente" (punti DESC);
CREATE INDEX IF NOT EXISTS idx_utente_livello ON "Utente" (livello);

-- Indici per statistiche giornaliere (query frequenti)
CREATE INDEX IF NOT EXISTS idx_stats_giornaliere_data ON "StatisticheGiornaliere" (data DESC);
CREATE INDEX IF NOT EXISTS idx_stats_giornaliere_utente_data ON "StatisticheGiornaliere" ("utenteId", data DESC);

-- Indici per sessioni studio
CREATE INDEX IF NOT EXISTS idx_sessioni_utente_data ON "SessioneStudio" ("utenteId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_sessioni_materia ON "SessioneStudio" (materia);

-- Indici per quiz/progressi
CREATE INDEX IF NOT EXISTS idx_progresso_utente ON "Progresso" ("utenteId");
CREATE INDEX IF NOT EXISTS idx_progresso_quiz ON "Progresso" ("quizId");

-- Indici per notifiche
CREATE INDEX IF NOT EXISTS idx_notifiche_utente_letta ON "Notifica" ("utenteId", letta);
CREATE INDEX IF NOT EXISTS idx_notifiche_created ON "Notifica" ("createdAt" DESC);

-- Indici per libromercato
CREATE INDEX IF NOT EXISTS idx_libro_venditore ON "Libro" ("venditoreId");
CREATE INDEX IF NOT EXISTS idx_libro_stato ON "Libro" (venduto);
CREATE INDEX IF NOT EXISTS idx_libro_materia ON "Libro" (materia);
CREATE INDEX IF NOT EXISTS idx_libro_titolo_trgm ON "Libro" USING gin (titolo gin_trgm_ops);

-- Indici per streak e achievements
CREATE INDEX IF NOT EXISTS idx_streak_corrente ON "Streak" ("streakCorrente" DESC);
CREATE INDEX IF NOT EXISTS idx_achievement_utente ON "AchievementUtente" ("utenteId");

-- Indici per league
CREATE INDEX IF NOT EXISTS idx_league_user_settimana ON "LeagueUser" (settimana, "xpSettimanale" DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- CONFIGURAZIONE POSTGRESQL PER PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

-- Queste impostazioni vanno nel postgresql.conf, ma le documentiamo qui
-- shared_buffers = 1GB
-- effective_cache_size = 3GB
-- maintenance_work_mem = 256MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 64MB
-- default_statistics_target = 100
-- random_page_cost = 1.1
-- effective_io_concurrency = 200
-- work_mem = 16MB
-- min_wal_size = 1GB
-- max_wal_size = 4GB
-- max_worker_processes = 4
-- max_parallel_workers_per_gather = 2
-- max_parallel_workers = 4
-- max_parallel_maintenance_workers = 2

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNZIONI UTILI
-- ─────────────────────────────────────────────────────────────────────────────

-- Funzione per calcolare XP settimanale
CREATE OR REPLACE FUNCTION calcola_xp_settimanale(p_utente_id UUID, p_settimana DATE)
RETURNS INTEGER AS $$
DECLARE
    v_xp INTEGER;
BEGIN
    SELECT COALESCE(SUM("xpGuadagnati"), 0)
    INTO v_xp
    FROM "StatisticheGiornaliere"
    WHERE "utenteId" = p_utente_id
    AND data >= p_settimana
    AND data < p_settimana + INTERVAL '7 days';
    
    RETURN v_xp;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare classifica settimanale
CREATE OR REPLACE FUNCTION aggiorna_classifica_settimanale()
RETURNS void AS $$
DECLARE
    v_settimana DATE;
BEGIN
    v_settimana := date_trunc('week', CURRENT_DATE)::DATE;
    
    -- Aggiorna XP settimanale per tutti gli utenti attivi
    UPDATE "LeagueUser" lu
    SET "xpSettimanale" = calcola_xp_settimanale(lu."utenteId", v_settimana)
    WHERE lu.settimana = v_settimana;
    
    -- Aggiorna posizioni
    WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY "leagueId" ORDER BY "xpSettimanale" DESC) as pos
        FROM "LeagueUser"
        WHERE settimana = v_settimana
    )
    UPDATE "LeagueUser" lu
    SET posizione = r.pos
    FROM ranked r
    WHERE lu.id = r.id;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- PULIZIA AUTOMATICA DATI VECCHI
-- ─────────────────────────────────────────────────────────────────────────────

-- Funzione per pulire dati vecchi (da schedulare con pg_cron o worker)
CREATE OR REPLACE FUNCTION pulizia_dati_vecchi()
RETURNS void AS $$
BEGIN
    -- Elimina notifiche lette più vecchie di 30 giorni
    DELETE FROM "Notifica"
    WHERE letta = true AND "createdAt" < NOW() - INTERVAL '30 days';
    
    -- Elimina activity log più vecchi di 90 giorni
    DELETE FROM "ActivityLog"
    WHERE "createdAt" < NOW() - INTERVAL '90 days';
    
    -- Elimina refresh token scaduti
    DELETE FROM "RefreshToken"
    WHERE "expiresAt" < NOW() OR revoked = true;
    
    -- Elimina ricerche recenti più vecchie di 7 giorni
    DELETE FROM "RicercaRecente"
    WHERE "createdAt" < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- VISTE MATERIALIZZATE PER DASHBOARD
-- ─────────────────────────────────────────────────────────────────────────────

-- Vista materializzata per classifica globale (refresh ogni ora)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_classifica_globale AS
SELECT 
    u.id,
    u.nome,
    u."avatarUrl",
    u.punti,
    u.livello,
    s."streakCorrente",
    s."streakMassimo",
    ROW_NUMBER() OVER (ORDER BY u.punti DESC) as posizione
FROM "Utente" u
LEFT JOIN "Streak" s ON u.id = s."utenteId"
WHERE u.ruolo = 'STUDENTE'
ORDER BY u.punti DESC
LIMIT 1000;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_classifica_id ON mv_classifica_globale (id);

-- Vista per statistiche aggregate per materia
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_stats_materie AS
SELECT 
    materia,
    COUNT(DISTINCT "utenteId") as utenti_attivi,
    SUM("durataMinuti") as minuti_totali,
    AVG("durataMinuti") as media_minuti_sessione,
    SUM("xpGuadagnati") as xp_totali
FROM "SessioneStudio"
WHERE materia IS NOT NULL
AND "createdAt" > NOW() - INTERVAL '30 days'
GROUP BY materia;

-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER PER AGGIORNAMENTI AUTOMATICI
-- ─────────────────────────────────────────────────────────────────────────────

-- Trigger per aggiornare livello quando cambiano i punti
CREATE OR REPLACE FUNCTION aggiorna_livello()
RETURNS TRIGGER AS $$
DECLARE
    v_livello INTEGER;
BEGIN
    -- Calcola livello basato su XP
    v_livello := CASE
        WHEN NEW.punti >= 40800 THEN 30
        WHEN NEW.punti >= 38000 THEN 29
        WHEN NEW.punti >= 35300 THEN 28
        WHEN NEW.punti >= 32700 THEN 27
        WHEN NEW.punti >= 30200 THEN 26
        WHEN NEW.punti >= 27800 THEN 25
        WHEN NEW.punti >= 25500 THEN 24
        WHEN NEW.punti >= 23300 THEN 23
        WHEN NEW.punti >= 21200 THEN 22
        WHEN NEW.punti >= 19200 THEN 21
        WHEN NEW.punti >= 17300 THEN 20
        WHEN NEW.punti >= 15500 THEN 19
        WHEN NEW.punti >= 13800 THEN 18
        WHEN NEW.punti >= 12200 THEN 17
        WHEN NEW.punti >= 10700 THEN 16
        WHEN NEW.punti >= 9300 THEN 15
        WHEN NEW.punti >= 8000 THEN 14
        WHEN NEW.punti >= 6800 THEN 13
        WHEN NEW.punti >= 5700 THEN 12
        WHEN NEW.punti >= 4700 THEN 11
        WHEN NEW.punti >= 3800 THEN 10
        WHEN NEW.punti >= 3000 THEN 9
        WHEN NEW.punti >= 2300 THEN 8
        WHEN NEW.punti >= 1700 THEN 7
        WHEN NEW.punti >= 1200 THEN 6
        WHEN NEW.punti >= 800 THEN 5
        WHEN NEW.punti >= 500 THEN 4
        WHEN NEW.punti >= 250 THEN 3
        WHEN NEW.punti >= 100 THEN 2
        ELSE 1
    END;
    
    NEW.livello := v_livello;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_aggiorna_livello ON "Utente";
CREATE TRIGGER trg_aggiorna_livello
    BEFORE UPDATE OF punti ON "Utente"
    FOR EACH ROW
    EXECUTE FUNCTION aggiorna_livello();

-- ─────────────────────────────────────────────────────────────────────────────
-- GRANT PERMISSIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- L'utente imparafacile ha già tutti i permessi come owner
-- Ma se servono utenti read-only per analytics:
-- CREATE USER analytics_reader WITH PASSWORD 'readonly_password';
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_reader;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO analytics_reader;
