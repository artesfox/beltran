#!/usr/bin/env node
/**
 * Descarga todas las imágenes de la landing a la carpeta /img.
 * Uso (en esta carpeta):   node descargar-imagenes.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://artefox.com/beltran/wp-content/uploads/';
const files = `
2024/07/beltran-pardo-logo-horizonal.svg
2024/07/beltran-pardo-logo.svg
2024/06/beltran-pardo-abogados.webp
2024/06/logitipo-10-conversatorio-compras-publicas-abogados-pardo-beltran.webp
2024/07/shapes-bg-1.png
2024/06/beltranpard-conversatorioo.webp
2024/06/conversatorio-compras-publicas.webp
2024/06/teams-beltran-pardo.jpg
2024/07/conversatorio-presencial-1.jpg
2024/06/evento-publico.webp
2024/06/jorge-beltran-pardo.jpg
2024/06/2-cristobal-padilla-tejeda.jpg
2024/06/3-monica-ortiz-medina.jpg
2024/06/4-jaime-orlando-santofimio.jpg
2024/06/5-ivan-cancino.jpg
2024/07/cesar-palomino.jpg
2024/06/07-alvaro-namen-vargas-humberto-pinto.jpg
2024/06/08-juan-carlos-quinones.jpg
2024/07/carlos-perdomo.jpg
2024/07/tatiana-rincon-fasecolda-.jpg
2024/06/11-marcio-alfredo-melgosa.jpg
2024/07/sebastian-garces-restrepo.jpg
2024/06/13-andres-mancipe-gonzalez.jpg
2024/06/14-manuel-eduardo-marin-santoyo.jpg
2024/06/15-luis-carlos-pineda-telles.jpg
2024/06/16-gabriel-del-toro-benavides.jpg
2024/06/17-andres-vasquez-plazas.jpg
2024/07/diego-felipe-cabrera-celis-1.jpg
2024/06/19-adriana-munoz-clavijo.jpg
2024/07/ernesto-ortiz-diaz.jpg
2024/07/luz-stella-hernandez.jpg
2024/07/yenny-arias-molina-1.jpg
2024/06/24-hector-enrique-ferrer-leal.jpg
`.trim().split(/\s+/);

const OUT = path.join(process.cwd(), 'img');
await fs.mkdir(OUT, { recursive: true });
let ok = 0;
const failed = [];
for (const f of files) {
  const name = path.basename(f);
  const dest = path.join(OUT, name);
  try { await fs.access(dest); ok++; continue; } catch {}
  try {
    const res = await fetch(BASE + f);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    process.stdout.write(`\r  ${ok}/${files.length}`);
  } catch (e) { failed.push(`${name} (${e.message})`); }
}
console.log(`\n✔ Listas: ${ok}/${files.length}`);
if (failed.length) console.log('✖ Fallaron:\n  ' + failed.join('\n  '));
