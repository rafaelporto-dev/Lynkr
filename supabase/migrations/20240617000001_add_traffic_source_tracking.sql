-- Adicionar colunas para rastreamento de origem de tráfego à tabela clicks existente
ALTER TABLE clicks 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- Adicionar índice para consultas de origem mais rápidas
CREATE INDEX IF NOT EXISTS clicks_source_idx ON clicks(source);

-- Atualizar a função increment_link_click_with_timestamp para garantir compatibilidade
CREATE OR REPLACE FUNCTION increment_link_click_with_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the click_count in the links table
  UPDATE links SET click_count = click_count + 1 WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a tabela está na publicação realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'clicks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE clicks;
  END IF;
END
$$; 