# Install the FORM suite

This archive contains three independent Agent Skills under `skills/`:

- **form-design**: create and implement a coherent visual direction; includes the offline public-reference index and contrast tool.
- **form-unslop**: diagnose generic design and make context-sensitive repairs; includes the separate 19-signal checklist and optional browser inspector.
- **form-explore**: compare directions, typography, and semantic color alternatives; carry selected choices into a coherent system.

Copy the desired complete skill folders from this archive's `skills/` directory into your host's skill directory. Do not copy only `SKILL.md`.

| Host | Personal | Project |
| --- | --- | --- |
| Codex | `~/.agents/skills/` | `.agents/skills/` |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Other Agent Skills hosts | Use the host's skill-folder import | Preserve the full folder structure |

You can also install from the public repository:

```sh
npx skills add aiden-guan/form-design
```

Choose the skills and agent when prompted. The current Skills CLI needs Node.js 22.20+. FORM's own optional CLI tools need Node.js 18+. Written guidance works without a shell. The browser inspector needs an existing permitted browser-evaluation facility; no browser engine is bundled. Remote reference visuals need internet access.

In Codex, invoke `$form-design`, `$form-unslop`, or `$form-explore`; in Claude Code use the corresponding slash command. Review an existing installation before replacing it and restart the host if discovery does not refresh.

Each skill includes its license and attribution notice. Original FORM writing and tooling use MIT; third-party references retain their own rights. The repository contains sourced research, worked examples, and evaluation boundaries: https://github.com/aiden-guan/form-design
