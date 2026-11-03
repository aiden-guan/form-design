# FORM Design

**Give your coding agent a stronger design process, from visual direction to the last detail.**

A portable Agent Skill for distinctive websites, apps, and interfaces. FORM helps an agent choose a coherent visual direction, use references deliberately, implement the result, and inspect what it actually built. It adapts to the project instead of imposing one visual style.

[Download the skill ZIP](https://github.com/aiden-guan/form-design/releases/latest/download/form-design.zip) · [Read the skill](skills/form-design/SKILL.md) · [Research and sources](skills/form-design/references/designer-principles.md) · [Worked examples](skills/form-design/references/examples.md)

## Install

With the [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add aiden-guan/form-design --skill form-design
```

Choose your agent when prompted. The CLI installs into your current project by default; add `-g` for a personal installation. The current Skills CLI requires **Node.js 22.20+**. FORM's own optional scripts need **Node.js 18+**, and its written design guidance works without a shell.

### Install from the ZIP

1. [Download form-design.zip](https://github.com/aiden-guan/form-design/releases/latest/download/form-design.zip) and extract it.
2. Copy the entire `form-design` folder into the appropriate skill directory below.
3. Invoke the skill in your agent. If it does not appear, restart the agent.

| Agent | Personal installation | Project installation |
| --- | --- | --- |
| Codex | `~/.agents/skills/form-design/` | `.agents/skills/form-design/` |
| Claude Code | `~/.claude/skills/form-design/` | `.claude/skills/form-design/` |
| Another Agent Skills host | Use its skill-folder import procedure | Preserve the complete folder structure |

Keep `SKILL.md`, `references/`, `scripts/`, and `data/` together. Review an existing installation before replacing it. Installation guidance: [official OpenAI documentation](https://learn.chatgpt.com/docs/build-skills), [Claude Code documentation](https://code.claude.com/docs/en/skills).

## Use it

In Codex, mention **`$form-design`**. In Claude Code, use **`/form-design`**. The agent can also select it when a request matches the skill description.

```text
Use $form-design to build a distinctive site for our ceramics studio.
Use our existing photos and stack. Make it welcoming, with class booking
as the primary task. Choose a direction and implement it.
```

```text
Use $form-design to improve this dashboard's typography, density, and
visual hierarchy. Keep the existing component library and workflows.
```

```text
Use $form-design to explore three genuinely different directions for
this festival page, then recommend one based on the audience and content.
```

For a faithful match, provide the screenshot or reference. For an existing app, provide code or a view the agent can inspect. Real content, audience, the primary task, and constraints give the skill more to work with than “make it premium.”

## What's inside

| Resource | What it helps with |
| --- | --- |
| [Core workflow](skills/form-design/SKILL.md) | New designs, redesigns, exploration, reference matching, and critique |
| [Art direction](skills/form-design/references/art-direction.md) | Specific concepts, divergent compositions, and a practical design brief |
| [Visual craft](skills/form-design/references/visual-craft.md) | Hierarchy, type, color, imagery, material, and responsive composition |
| [Surfaces](skills/form-design/references/surfaces.md) | Different priorities for marketing, working products, mobile, reading, and immersive experiences |
| [Motion](skills/form-design/references/motion.md) | Purpose, pacing, spatial continuity, interruption, and reduced motion |
| [Critique](skills/form-design/references/critique.md) | Observable problems, concrete corrections, and honest verification |
| [Practitioner research](skills/form-design/references/designer-principles.md) | 13 source-linked lenses, with applications and inspection limits |
| [Worked examples](skills/form-design/references/examples.md) | Five briefs translated into different design decisions |
| [Reference search](skills/form-design/references/library.md) | Offline discovery across 13,351 public references |

Research draws on Frank Chimero, Ethan Marcotte, Jen Simmons, Jason Santa Maria, iA, Rauno Freiberg, Emil Kowalski, Josh W. Comeau, Steve Schoger and Adam Wathan, Luke Wroblewski, Sara Soueidan, Maxime Heckel, and Bruno Simon. The writing is an original synthesis with linked primary sources, not copied essays or paid course material. The practitioners do not endorse this skill.

The skill keeps framework, brand, and user constraints intact. No particular palette, font, UI library, paid service, or image-generation tool is required. It instructs the agent to look at its output when rendering tools are available and to distinguish tested behavior from assumptions.

## Search the reference library

The bundled search uses local data and Node.js built-ins. It makes no network requests and needs no npm install or API key.

From this checkout:

```sh
node skills/form-design/scripts/search.mjs "quiet mechanical navigation" --limit 5
node skills/form-design/scripts/search.mjs "retro texture but not glass" --limit 5
node skills/form-design/scripts/search.mjs "intent:hero technique:halftone" --limit 3
node skills/form-design/scripts/search.mjs --stats
```

Results include attribution, matching concepts, recorded rights, evidence limits, original URLs, and public handoff links. They are candidates for inspection—not a claim that every visual, interaction, or license was independently verified. The snapshot is dated **November 2, 2026**. Linked previews require internet access.

Check an opaque solid color pair with:

```sh
node skills/form-design/scripts/contrast.mjs '#17201b' '#f6f3eb'
```

This computes a WCAG contrast ratio for that pair. It does not audit an interface's accessibility.

## Validate and contribute

No application framework or npm dependencies are required. With Node.js 18+ and Python 3:

```sh
node --test tests/design-skill.test.mjs
python3 scripts/package-design-skill.py
python3 scripts/verify-design-skill-archive.py
```

The tests check retrieval, filtering, rights/evidence fields, catalog integrity, CLI behavior, contrast calculations, and reference links. Archive verification extracts the actual download into a clean folder and runs both tools. The ZIP is reproducible and ships with a [checksum](https://github.com/aiden-guan/form-design/releases/latest/download/form-design.zip.sha256).

Automated package checks do not prove subjective design quality. [Behavioral evaluation scenarios](evals/form-design.md) describe realistic tasks for further testing; they are not presented as completed model evaluations. Results depend on the model, brief, assets, and execution tools. Report a concrete prompt, artifact, and observed problem when suggesting an improvement.

This repository is independently usable. The bundled metadata is a published snapshot; its source hashes record provenance and are not dependencies on another checkout. To refresh it, provide an appropriately attributed public-reference snapshot with the same schema, update the manifest and counts, and validate the resulting archive.

## License and attribution

FORM's original instructions, summaries, examples, and tooling are [MIT licensed](LICENSE). Third-party references retain their own rights and licenses. Read [NOTICE.md](NOTICE.md) and inspect the original terms before copying code, artwork, or media. Creator media, fonts, full essays, private projects, and source bundles are not included.
