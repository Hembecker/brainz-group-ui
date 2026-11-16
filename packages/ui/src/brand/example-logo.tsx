/*
 * Logo genérico para uma marca de exemplo: um quadrado com a inicial e o nome
 * escrito com a fonte da marca. Não reproduz nenhum logo real; serve para
 * mostrar a troca de marca na documentação. Num projeto de verdade, troque
 * por um componente com o SVG oficial, como o brainz-logo.tsx.
 */
import * as React from "react"

type LogoProps = React.ComponentProps<"svg"> & { title?: string }

function Initial({ initial }: { initial: string }) {
  return (
    <>
      <rect width="100" height="100" rx="22" fill="var(--bb-primary-600)" />
      <text
        x="50"
        y="69"
        textAnchor="middle"
        fontFamily="var(--bb-font-sans)"
        fontSize="58"
        fontWeight="700"
        fill="#ffffff"
      >
        {initial}
      </text>
    </>
  )
}

/**
 * Símbolo genérico (inicial num quadrado na Primária 600, texto branco: 5,2:1
 * na Brainz Group; é logotipo, isento do 1.4.3 da WCAG). Nenhuma marca
 * instalada o usa hoje: é o ponto de partida de uma marca nova, enquanto o
 * logo oficial não chega.
 */
export function createExampleMark(initial: string) {
  return function ExampleMark({ title, ...props }: LogoProps) {
    return (
      <svg
        viewBox="0 0 100 100"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <Initial initial={initial} />
      </svg>
    )
  }
}

/** Logo genérico (símbolo + nome em currentColor), proporção 4 : 1. */
export function createExampleLogo(initial: string, name: string) {
  return function ExampleLogo({ title, ...props }: LogoProps) {
    return (
      <svg
        viewBox="0 0 400 100"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <Initial initial={initial} />
        <text
          x="122"
          y="72"
          fontFamily="var(--bb-font-sans)"
          fontSize="64"
          fontWeight="700"
          fill="currentColor"
        >
          {name}
        </text>
      </svg>
    )
  }
}
