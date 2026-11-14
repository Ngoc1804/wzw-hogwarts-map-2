# /map handoff

Paste the complete English block in [MAP_PROMPT.md](MAP_PROMPT.md) into the story system instruction. Fill the story questions once, binding existing state/NPC/Atlas/quest sources; do not attach separate files or manually combine old prompt fragments. If the story lacks Atlas context, include the relevant text from WZW_MAP2_ATLAS_GEMINI_MIN.md in its location source.

Gemini emits one complete HTML document with filled MAP_DATA; no parentId/childId/supportId or component-edit workflow. Loader URLs are release-managed and kept unchanged during RP. `assets/runtime-release.json` is authoritative, never old historical provenance. Generate through `python tools/rebuild.py`. AI Studio Preview is not certified by local tests or HTTP success.
