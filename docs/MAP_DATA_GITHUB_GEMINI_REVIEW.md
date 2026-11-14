# GitHub–Gemini contract — approved and implemented

The user's approved decisions are implemented in [MAP_DATA.md](MAP_DATA.md), source [MAP_INSTRUCTIONS.md](MAP_INSTRUCTIONS.md) and generated [MAP_PROMPT.md](MAP_PROMPT.md). This file is a redirect, not a second contract.

- Gemini owns context/location/NPC/quests/knowledge and internally selected materials.
- Story questions contain quotas, minimum NPC count and icon assignments; engine does not evaluate them.
- Fixed canon: positions and existing map interface only; no furniture/detail UI.
- Generated: recipe + whole objects/groups; merge/replace and minimal visual/fallback. No parentId/childId/supportId prompt workflow.
- One standard loader, one published runtime pin, native IDs only.
- Footer removed; zoom bounded 1–4×.
- Existing internal advanced APIs are not deleted or required by the prompt.
