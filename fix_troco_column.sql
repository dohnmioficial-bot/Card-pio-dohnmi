-- Adiciona coluna troco na tabela omi_pedidos
ALTER TABLE omi_pedidos ADD COLUMN IF NOT EXISTS troco text;

-- (Opcional) Limpa pedidos de teste para começar limpo
-- DELETE FROM omi_pedidos;
-- DELETE FROM omi_conversas;
-- UPDATE clientes SET total_pedidos=0, selos='{}', cromi_acumulado=0,
--   membro_coroa=false, premio_hamburguer=false, premio_combo=false,
--   desconto_usado=false WHERE whatsapp='SEU_NUMERO';
