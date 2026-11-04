# Development record and corrected-output method

The original paired plan below was superseded after the owner rejected the first candidate outputs for failing the unslop criteria. See [amendment.json](amendment.json). Those drafts are retained, not presented as successful results.

The final examples comprise two fresh-context implementations (festival and lending), one maintainer rebuild (reading), and one continued-context implementation (bicycle). They receive task checks, narrow machine-checkable style checks, and full checklist review. This is an iterative acceptance record, not a controlled causal benchmark or a blinded preference study.

## Original plan, retained for transparency

# Paired design pilot method

This pilot compares FORM v1.1.0 with a revision developed after inspecting its outputs. The three development briefs and one unseen holdout were fixed before output review; the [protocol](protocol.json) records conditions, task checks, and anchored review criteria. There is no competitor condition.

## Conditions

Each implementation uses a fresh-context agent, one skill, the same case brief and factual content, the same offline/system-font constraint, and the same available local rendering tools. Each gets one initial implementation plus one rendered self-review/correction pass. Agents inherit the host model/effort setting; an exact provider revision and equal inference-token usage are not independently controlled. No timing or cost comparison follows.

The revised condition is generated in a new isolated folder without access to the current artifact. The three development cases inform the revision; they are not holdouts. The bicycle configurator brief is withheld from revision decisions. All final artifacts, including failures or ties, are retained.

## Evidence layers

- **Required task behavior:** The maintainer operates the saved artifacts against the same brief-level requirements. Selectors may differ by implementation; the expected outcome does not. Report meaningful flows, not assertion volume as quality.
- **Rendered behavior:** A shared capture script uses fresh offline Chromium contexts at 1440×1000 and 390×844, DPR 1, reduced motion, plus a doubled-text stress observation. Captures and page errors are retained. Doubled text is not a claim of actual browser-zoom testing.
- **Visual judgments:** Two fresh-context AI reviewers receive neutrally labeled paired artifacts, their actual captures, the brief, and the fixed rubric. Candidate order is reversed between reviewers. Reviewers do not get skill versions, change rationale, author verdicts, or self-reports. They can prefer either candidate or tie; evidence is required.

The maintainer knows the conditions. Reviewers are not a human user panel and use the same inherited model family; this is not independent population validation. Four single-run pairs cannot establish a general win rate, isolate skill causality from sampling variation, or establish superiority over another tool.

## Why these controls

[Zheng et al., MT-Bench / Chatbot Arena](https://arxiv.org/abs/2306.05685) document position, verbosity, and self-enhancement biases in model judging. Neutral labels, reversed presentation order, and artifact-level evidence are practical controls here, not proof those biases disappear.

[Si et al., Design2Code](https://arxiv.org/abs/2403.03163) combine automatic reference-reconstruction metrics with human evaluation. This pilot instead concerns original briefs with no reference screenshot; its subjective rubric is not a validated perceptual metric or a reproduction of Design2Code.

This method was recorded before reviewing the development outputs. Results and revision decisions are reported separately when the runs finish.
