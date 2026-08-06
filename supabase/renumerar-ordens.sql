-- ============================================================================
-- HebaTech — acertar o contador das ordens de serviço
--
-- Use depois de apagar ordens de teste: o contador não volta sozinho quando uma
-- ordem é excluída, e isso é de propósito. Numa loja em funcionamento, número
-- que já saiu no comprovante do cliente não pode ser reaproveitado — o cliente
-- consulta o aparelho por ele em /acompanhar.
--
-- Como usar: Supabase → SQL Editor → cole este arquivo → Run.
--
-- O que ele faz: recoloca o contador de cada ano no maior número que ainda
-- existe naquele ano. Com a tabela de ordens vazia, volta a zero e a próxima
-- ordem nasce como OS-<ano>-0001.
--
-- Escrito assim, e não como um "zerar tudo", porque zerar às cegas geraria
-- número repetido se ainda houvesse ordem antiga guardada — e o banco recusaria
-- o salvamento sem explicar o motivo.
-- ============================================================================

update public.contadores c
   set valor = coalesce(
         (
           select max(substring(o.codigo from '(\d+)$')::int)
             from public.ordens o
            where o.codigo like 'OS-' || substring(c.chave from 7) || '-%'
         ),
         0
       )
 where c.chave like 'ordem_%';

-- Confira o resultado: `valor` é o último número usado, e a próxima ordem sai
-- com esse número mais um.
select chave as ano, valor as ultimo_numero_usado
  from public.contadores
 where chave like 'ordem_%'
 order by chave;
