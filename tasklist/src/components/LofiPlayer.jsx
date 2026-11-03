import { useState } from "react";
import { ChevronDown, Headphones } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { embedUrl, parseSpotifyLink } from "../lib/spotify";

// Mini player de lo-fi: o player oficial do Spotify dentro de um cartão
// que recolhe. Quando recolhido, o iframe continua montado (só escondido),
// então a música não para

export default function LofiPlayer() {
  const [link, setLink] = useLocalStorage("lofi-link", null); // { type, id}
  const [open, setOpen] = useLocalStorage("lofi-open", false);
  const [mounted, setMounted] = useState(open); // só carrega o iframe depois da 1ª abertura
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");


  function toggle(){
    setMounted(true);
    setOpen(!open);
  }

   function save(e) {
    e.preventDefault();
    const parsed = parseSpotifyLink(draft);
    if (!parsed) {
      setError("Cole o link de uma playlist do Spotify (Compartilhar > Copiar link).");
      return;
    }
    setError("");
    setDraft("");
    setLink(parsed);
  }

 return (
    <div className="rounded-xl border border-line bg-raised">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="flex h-9 w-full items-center gap-2.5 px-3 text-left text-[13px] text-muted transition-colors hover:text-ink"
      >
        <Headphones size={15} />
        <span className="flex-1">Lo-fi para focar</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div hidden={!open} className="flex flex-col gap-2 px-2 pb-2">
        {link ? (
          <>
            {mounted && (
              <iframe
                title="Playlist lo-fi (Spotify)"
                src={embedUrl(link)}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl border-0"
              />
            )}
            <button
              onClick={() => setLink(null)}
              className="self-start px-1 text-xs text-muted hover:text-ink hover:underline"
            >
              Trocar playlist
            </button>
          </>
        ) : (
          <form onSubmit={save} className="flex flex-col gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Link da playlist do Spotify"
              aria-label="Link da playlist do Spotify"
              className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none placeholder:text-muted focus:border-accent"
            />
            {error && <p className="px-1 text-xs text-rose-500">{error}</p>}
            <button
              disabled={!draft.trim()}
              className="h-9 rounded-lg bg-accent text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Salvar playlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
  
