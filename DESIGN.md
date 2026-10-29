# DESIGN.md — Instinct Élagage

Arboriste grimpeur à Cerny (91). Gérant : Maxence Cardon. Objectif : appels et demandes de devis.

## Idée directrice : la page se lit comme on descend un arbre

Un élagueur travaille à la verticale, de la cime vers le sol. La page fait pareil.
Sur desktop, une corde court le long de la marge gauche ; un mousqueton descend avec le scroll
et passe six repaires nommés avec le vocabulaire de l'arboriste :

| Repère | Section |
|---|---|
| Cime | Hero |
| Houppier | Prestations |
| Charpentières | Chantiers (galerie) |
| Tronc | Méthode + Maxence |
| Collet | Avis |
| Racines | Zone, FAQ, contact |

Sur mobile, la corde disparaît et chaque surtitre garde son repère.
Base technique : le composant 21st.dev « Scroll animated timeline » (ligne qui se dessine au scroll,
points qui s'activent), réécrit en vanilla JS, rendu en corde torsadée.

## Palette (tirée du logo et du terrain)

| Token | Hex | Rôle | Contraste |
|---|---|---|---|
| `--foret` | `#16291C` | Encre : titres, texte, sections sombres | 13,8:1 sur `--lichen` |
| `--lichen` | `#F2F3EC` | Fond de page, gris-vert froid (pas crème) | — |
| `--brume` | `#E3EAE4` | Sections alternées | `--foret` 12,5:1 |
| `--seve` | `#3C6A23` | Liens, surtitres, étoiles sur clair | 5,7:1 sur `--lichen` |
| `--feuille` | `#7FAF3A` | Vert du feuillage du logo, accents sur fond sombre | 5,9:1 sur `--foret` |
| `--epi` | `#E8650A` | Orange des EPI d'élagueur (casque, manchettes). Action uniquement | texte `--foret` 4,6:1 |
| `--ecorce` | `#5C5246` | Texte secondaire | 6,8:1 sur `--lichen` |

## Typographie

- Display : **Big Shoulders Display** 700/800. Condensée, verticale comme un fût.
- Texte : **Figtree** 400/500/600/700.

## Interactions

1. La corde (signature).
2. Galerie filtrable Grimpe / Nacelle / Abattage / Taille / Nids, avec lightbox `<dialog>`.
3. Avis en double marquee (composant 21st.dev « Testimonials Marquee »), pause au survol,
   défilement manuel si `prefers-reduced-motion`.
