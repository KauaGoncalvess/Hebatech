"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { mudarStatusOrdem } from "@/app/admin/actions";
import { preco } from "@/lib/format";
import {
  aparelhoDe,
  ETAPA,
  LINHA_DO_TEMPO,
  type Ordem,
  type StatusOrdem,
} from "@/types/ordem";
import { AcaoIndisponivel, BotaoAcao, LinkAcao } from "./botao-acao";
import { EtiquetaEtapa } from "./etiqueta-estado";

const quando = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

/** A próxima etapa da fila, para o botão de avanço rápido. */
function proxima(status: StatusOrdem): StatusOrdem | null {
  const i = LINHA_DO_TEMPO.indexOf(status);
  if (i === -1 || i === LINHA_DO_TEMPO.length - 1) return null;
  return LINHA_DO_TEMPO[i + 1];
}

export function LinhaOrdem({ o, aviso }: { o: Ordem; aviso: string | null }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const seguinte = proxima(o.status);
  const encerrada = o.status === "entregue" || o.status === "cancelado";

  const avancar = () =>
    iniciar(async () => {
      if (!seguinte) return;
      const { erro } = await mudarStatusOrdem(o.id, seguinte);
      setErro(erro ?? null);
    });

  return (
    <li className={`card p-4 ${encerrada ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          {/*
            O código é o que o cliente tem no comprovante e o que o balcão
            procura na lista — era o menor e mais apagado texto do cartão.
            Agora é o primeiro elemento, em mono para alinhar entre as linhas.
          */}
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-mono text-corpo tracking-[0.06em] text-texto">
              {o.codigo}
            </span>
            <span className="font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase">
              {quando.format(new Date(o.criadoEm))}
              {o.previsao &&
                ` · previsão ${o.previsao.split("-").reverse().join("/")}`}
            </span>
          </p>

          {/* Nome de aparelho e de pessoa saem da mono: é texto de leitura. */}
          <p className="mt-2 text-corpo-g text-texto">
            {aparelhoDe(o) || "Aparelho"}
          </p>
          <p className="mt-0.5 text-nota text-texto-3">
            {o.clienteNome}
            {o.clienteTelefone && (
              <>
                {" · "}
                <span className="font-mono tabular-nums">
                  {o.clienteTelefone}
                </span>
              </>
            )}
          </p>

          <p className="mt-3 flex flex-wrap items-center gap-2">
            <EtiquetaEtapa status={o.status} />
            {o.valorOrcado !== null && (
              <span className="font-mono text-nota tabular-nums text-texto-2">
                {preco(o.valorOrcado)}
              </span>
            )}
          </p>
        </div>

        {/*
          Ordem fixa e papéis fixos: avançar a etapa é o trabalho e leva o
          laranja; abrir a ficha é navegação. Antes era o contrário.

          A grade também é fixa. Com `flex-wrap`, a largura do rótulo da
          próxima etapa decidia onde a linha quebrava — "→ EM REPARO" cabia
          com os outros dois, "→ PRONTO PARA RETIRAR" empurrava o terceiro
          para baixo — e o botão principal aparecia num lugar diferente em cada
          cartão. Aqui o principal ocupa a primeira faixa inteira e os dois de
          apoio dividem a segunda, sempre igual.
        */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          {seguinte ? (
            <BotaoAcao
              variante="principal"
              type="button"
              disabled={pendente}
              onClick={avancar}
              className="col-span-2 sm:col-auto"
            >
              → {ETAPA[seguinte].rotulo}
            </BotaoAcao>
          ) : (
            <AcaoIndisponivel className="col-span-2 sm:col-auto">
              {ETAPA[o.status].rotulo}
            </AcaoIndisponivel>
          )}

          {aviso ? (
            <LinkAcao href={aviso} target="_blank" rel="noopener noreferrer">
              Avisar
            </LinkAcao>
          ) : (
            <AcaoIndisponivel>Sem telefone</AcaoIndisponivel>
          )}

          {/* `Link` do Next para pré-carregar a ficha, com o visual do LinkAcao. */}
          <Link
            href={`/admin/ordens/${o.id}`}
            className="toque rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.1em] text-texto-2 uppercase transition-colors hover:bg-surface-3 hover:text-texto"
          >
            Abrir
          </Link>
        </div>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-alerta/12 px-4 py-3 text-nota text-alerta"
        >
          Não deu para mudar a etapa: {erro}
        </p>
      )}
    </li>
  );
}
