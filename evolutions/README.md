# evolutions/

Specifications for planned and implemented evolutions of the MyBikeLab frontend.

## Structure

| Folder | Role |
| --- | --- |
| `[evolution-id]/` | Active evolution — one subfolder per ongoing evolution |
| `archive/` | Completed evolutions and legacy specs |

## Convention

Each evolution gets a dedicated subfolder named `evolution-[NNN]-[short-description]/`.

A standard evolution folder contains:

- `needs-assessment.md` — Phase 1: business need and acceptance criteria
- `prd.md` — Phase 2: functional specification
- `tech-specs.md` — Phase 3: technical task breakdown

Templates for these documents: [`shared-knowledge/templates/`](../../shared-knowledge/templates/)

Execution instructions: [`workflows/ai-dev-process/README.md`](../../workflows/ai-dev-process/README.md)

Once an evolution is merged, its folder moves to `archive/`.
