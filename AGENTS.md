<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All UI text lives in src/i18n/{pt,en,es}.json via react-i18next; the language is persisted in localStorage plus a cookie so SSR renders the same language (avoids hydration mismatch).
- The "Fale Comigo" companion is fully local (src/lib/companion.ts keyword intents) to keep zero API cost; only "Como Você Está Hoje?" uses the AI gateway.
