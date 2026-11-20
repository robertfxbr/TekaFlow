"""Ondinhas em quadradinho: anéis no formato do ícone (quadrado arredondado) que saem de trás de um disco escuro
e perdem a cor. Peça comum aos dois moodboards."""
LIM, AZUL, DISCO = "#C5EF6B", "#5BC0FF", "#0F1012"
RAIO = 0.286   # raio dos cantos, em proporção do lado: o mesmo do ícone (4 de 14)


def ondas_quadradas(cx, cy, halo, icone, escala, dur, n, href, fundo="#25262A", disco=None):
    """Retorna o miolo de um <svg>: n anéis que crescem de `halo` até `halo*escala`, o halo escuro e o ícone no centro."""
    s = ""
    for i in range(n):
        d = f"-{i * dur / n:.2f}s"
        s += (f'<g transform="translate({cx} {cy})"><rect x="{-halo / 2}" y="{-halo / 2}" width="{halo}" height="{halo}" rx="{halo * RAIO:.1f}" '
              f'fill="none" stroke="{LIM}" stroke-width="4" vector-effect="non-scaling-stroke" opacity="0">'
              f'<animateTransform attributeName="transform" type="scale" values="1;{escala}" dur="{dur}s" begin="{d}" repeatCount="indefinite"/>'
              f'<animate attributeName="opacity" values="0;.95;.5;0" keyTimes="0;.1;.55;1" dur="{dur}s" begin="{d}" repeatCount="indefinite"/>'
              f'<animate attributeName="stroke" values="{LIM};{LIM};{AZUL};{fundo}" keyTimes="0;.25;.6;1" dur="{dur}s" begin="{d}" repeatCount="indefinite"/>'
              f'<animate attributeName="stroke-width" values="5;3;1.5" dur="{dur}s" begin="{d}" repeatCount="indefinite"/></rect></g>')
    if disco:   # disco escuro opcional (a versão atual não usa: o fundo da peça já é a cor mais escura)
        s += f'<rect x="{cx - halo / 2}" y="{cy - halo / 2}" width="{halo}" height="{halo}" rx="{halo * RAIO:.1f}" fill="{disco}"/>'
    s += f'<image href="{href}" x="{cx - icone / 2}" y="{cy - icone / 2}" width="{icone}" height="{icone}"/>'
    return s


def padrao_quadradinhos(id_, lado, cores):
    """<pattern> de quadrados arredondados concêntricos, para fundo de peça."""
    c = lado / 2
    aneis = ""
    for k, (tam, cor, op) in enumerate(cores):
        aneis += (f'<rect x="{c - tam / 2}" y="{c - tam / 2}" width="{tam}" height="{tam}" rx="{tam * RAIO:.1f}" fill="none" '
                  f'stroke="{cor}" stroke-width="3" opacity="{op}"/>')
    return f'<pattern id="{id_}" width="{lado}" height="{lado}" patternUnits="userSpaceOnUse">{aneis}</pattern>'
