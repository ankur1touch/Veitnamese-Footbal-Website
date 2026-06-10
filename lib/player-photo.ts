/** Api-Sports serves a ~5 KB generic silhouette when no real player photo exists. */
const PLACEHOLDER_MAX_BYTES = 8_000;

const ALLOWED_PHOTO_HOSTS = [
  'media.api-sports.io',
  'images.fotmob.com',
  'img.a.transfermarkt.technology',
  'api.dicebear.com',
  'crests.football-data.org',
];

export async function isPlayerPhotoPlaceholder(url: string): Promise<boolean> {
  if (!url) return true;
  return !(await isValidPlayerPhoto(url));
}

async function isValidPlayerPhoto(url: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'BanThangVN/1.0',
      Accept: 'image/*',
    };
    if (url.includes('fotmob.com')) {
      headers.Referer = 'https://www.fotmob.com/';
    }

    const res = await fetch(url, { method: 'GET', headers, cache: 'force-cache' });
    if (!res.ok) return false;

    const len = Number(res.headers.get('content-length') ?? 0);
    if (len > 0) return len > PLACEHOLDER_MAX_BYTES;

    const buf = await res.arrayBuffer();
    return buf.byteLength > PLACEHOLDER_MAX_BYTES;
  } catch {
    return false;
  }
}

export function playerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function initialsAvatarGradient(name: string): string {
  const palettes = [
    ['#D32F2F', '#B71C1C'],
    ['#1565C0', '#0D47A1'],
    ['#2E7D32', '#1B5E20'],
    ['#6A1B9A', '#4A148C'],
    ['#EF6C00', '#E65100'],
    ['#00838F', '#006064'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const [from, to] = palettes[Math.abs(hash) % palettes.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

/** Generated profile-style avatar when APIs only return generic silhouettes. */
export function generatedPlayerAvatarUrl(playerId: number | string, name: string): string {
  const seed = encodeURIComponent(`${playerId}-${name}`);
  return `https://api.dicebear.com/7.x/personas/png?seed=${seed}&backgroundColor=b71c1c,f9a825,0d1b2a&radius=50&size=256`;
}

export function isAllowedPhotoUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return ALLOWED_PHOTO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

interface ResolvePhotoInput {
  id: number;
  name: string;
  photo?: string;
  teamName?: string;
}

/** Pick the best display photo: real API image, or a generated profile avatar. */
export async function resolvePlayerPhotoUrl(input: ResolvePhotoInput): Promise<string> {
  const { id, name, photo, teamName } = input;

  if (photo && (await isValidPlayerPhoto(photo))) {
    return photo;
  }

  const fotmobUrl = await tryFotmobPhoto(name, teamName);
  if (fotmobUrl && (await isValidPlayerPhoto(fotmobUrl))) {
    return fotmobUrl;
  }

  return generatedPlayerAvatarUrl(id, name);
}

async function tryFotmobPhoto(name: string, teamName?: string): Promise<string | undefined> {
  try {
    const term = encodeURIComponent(name);
    const res = await fetch(
      `https://www.fotmob.com/api/data/search/suggest?hits=5&lang=en&term=${term}`,
      {
        headers: { 'User-Agent': 'BanThangVN/1.0' },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as Array<{
      suggestions?: Array<{ type?: string; id?: string; name?: string; teamName?: string }>;
    }>;
    for (const group of data) {
      for (const s of group.suggestions ?? []) {
        if (s.type !== 'player' || !s.id) continue;
        if (teamName && s.teamName && !s.teamName.toLowerCase().includes(teamName.split(' ')[0].toLowerCase())) {
          continue;
        }
        return `https://images.fotmob.com/image_resources/playerimages/${s.id}.png`;
      }
    }
  } catch {
    /* optional source */
  }
  return undefined;
}
