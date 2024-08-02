import famicom from './assets/logos/Famicom.png';
import gba from './assets/logos/Game_Boy_Advance.png';
import gb from './assets/logos/Game_Boy.png';
import gbc from './assets/logos/Game_Boy_Color.png';
import megaCdEU from './assets/logos/Mega_CD_EU.png';
import megaCdJP from './assets/logos/Mega_CD_JP.png';
import nes from './assets/logos/NES.png';
import n64 from './assets/logos/Nintendo_64.png';
import pce from './assets/logos/PC_Engine.png';
import segaCd from './assets/logos/Sega_CD.png';
import sFamicom from './assets/logos/Super_Famicom.png';
import snesEU from './assets/logos/Super_Nintendo_EU.png';
import snesUS from './assets/logos/Super_Nintendo_US.png';

type Logo = {
  label: string;
  url: string;
}

export const logos: Logo[] = [
  {
    label: 'Famicom',
    url: famicom,
  },
  {
    label: 'Game Boy Advance',
    url: gba,
  },
  {
    label: 'Game Boy Color',
    url: gbc,
  },
  {
    label: 'Game Boy',
    url: gb,
  },
  {
    label: 'Mega CD (Europe)',
    url: megaCdEU,
  },
  {
    label: 'Mega CD (Japan)',
    url: megaCdJP,
  },
  {
    label: 'Nintendo Entertainment System',
    url: nes,
  },
  {
    label: 'Nintendo 64',
    url: n64,
  },
  {
    label: 'PC Engine',
    url: pce,
  },
  {
    label: 'Sega CD',
    url: segaCd,
  },
  {
    label: 'Super Famicom',
    url: sFamicom,
  },
  {
    label: 'Super Nintendo (Europe)',
    url: snesEU,
  },
  {
    label: 'Super Nintendo (US)',
    url: snesUS,
  },
];