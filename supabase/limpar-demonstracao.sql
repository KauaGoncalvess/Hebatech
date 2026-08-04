-- ============================================================================
-- HebaTech — remover o catálogo de demonstração
--
-- Gerado por `npm run carga-sql`. Não edite à mão.
--
-- Use quando o estoque de verdade estiver cadastrado. Apaga só os 19
-- produtos e os 3 planos que vieram da carga inicial, pelos códigos exatos —
-- nada que você cadastrou é tocado, nem que use o mesmo prefixo.
--
-- Não dá para desfazer. Se quiser os exemplos de volta, é só colar de novo o
-- supabase/carga-inicial.sql.
-- ============================================================================

delete from public.produtos
 where codigo in (
   'HT-L5490',
   'HT-T480',
   'HT-E840G5',
   'HT-L7490',
   'HT-T14G1',
   'HT-P640G4',
   'HT-L5400',
   'HT-TMP214',
   'HT-X1C6',
   'HT-E840G6',
   'HT-L3420',
   'HT-L14G2',
   'HT-PC-R5',
   'HT-PC-I5',
   'HT-MON-P2419',
   'HT-SSD-1TB',
   'HT-MEM-8GB',
   'HT-DOCK-USBC',
   'HT-KIT-CORP'
 );

delete from public.planos_manutencao
 where codigo in (
   'MP-01',
   'MP-02',
   'MP-03'
 );

-- As regras do contrato ficam: são texto da casa, não produto de exemplo.
-- Para apagá-las também, tire o comentário da linha abaixo.
-- delete from public.configuracoes where chave = 'manutencao_regras';
