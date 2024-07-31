type TemplateAuthors = {
  name: string;
  href: string;
}

export const templateAuthors: Record<string, TemplateAuthors> = {
  ariel: {
    name: 'Ariel Aces',
    href: 'https://www.artisticpixels305.com/',
  },
  andrea: {
    name: 'Andrea Bogazzi',
    href: 'https://github.com/asturur',
  },
  tim: {
    name: 'Tim Wilsie',
    href: 'https://timwilsie.com/',
  },
  animeotaku: {
    name: 'Anime0t4ku',
    href: 'https://github.com/Anime0t4ku/TapToCassetteCovers',
  }
} as const;