// Aceita o link copiado do Spotify ("Compartilhar > Copiar link") e devolve
// { type, id } ou null. Funciona com:
//   https://open.spotify.com/playlist/ID?si=...
//   https://open.spotify.com/intl-pt/playlist/ID
//   spotify:playlist:ID



const SPOTIFY_RE =
    /(?:open\.spotify\.com\/(?:embed\/)?(?:intl-[a-z-]+\/)?|spotify:)(playlist|album|artist|track|show|episode)[/:]([A-Za-z0-9]{22})/;

    export function parseSpotifyLink(text) {
        const match = text.trim().match(SPOTIFY_RE);
        return match ? { type: match[1], id: match[2]} : null;
    }

   // theme=0 deixa o player escuro, combinando com os temas do app.

   export function embedUrl({type, id}) {
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`; 
}


