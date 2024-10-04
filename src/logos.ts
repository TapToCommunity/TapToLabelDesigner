import famicom from './assets/logos/Famicom.png';
import gba from './assets/logos/Game_Boy_Advance.png';
import gb from './assets/logos/Game_Boy.png';
import gbc from './assets/logos/Game_Boy_Color.png';
import genesis from './assets/logos/Genesis.png';
import megaCdEU from './assets/logos/Mega_CD_EU.png';
import megaCdJP from './assets/logos/Mega_CD_JP.png';
import masterSystem from './assets/logos/Master_System.png';
import megadriveEu from './assets/logos/Mega_Drive_EU.png';
import megadriveJP from './assets/logos/Mega_Drive_JP.png';
import msdos from './assets/logos/MS_DOS.png';
import msx from './assets/logos/MSX.png';
import msx2 from './assets/logos/MSX2.png';
import nes from './assets/logos/NES.png';
import n64 from './assets/logos/Nintendo_64.png';
import pce from './assets/logos/PC_Engine.png';
import playstation from './assets/logos/PlayStation.png';
import saturnEUUS from './assets/logos/Saturn_EU_US.png';
import saturnJP from './assets/logos/Saturn_JP.png';
import SufamiTurbo from './assets/logos/Sufami_Turbo.png';
import segaCd from './assets/logos/Sega_CD.png';
import sFamicom from './assets/logos/Super_Famicom.png';
import snesEU from './assets/logos/Super_Nintendo_EU.png';
import snesUS from './assets/logos/Super_Nintendo_US.png';
import { EditType, type EditResource, type ResourceArray } from './resourcesTypedef';


export const logos: ResourceArray[] = [
  {
    label: 'Famicom',
    value: famicom,
  },
  {
    label: 'Game Boy Advance',
    value: gba,
  },
  {
    label: 'Game Boy Color',
    value: gbc,
  },
  {
    label: 'Game Boy',
    value: gb,
  },
  {
    label: 'Genesis',
    value: genesis,
  },
  {
    label: 'Master System',
    value: masterSystem,
  },
  {
    label: 'Mega drive EU',
    value: megadriveEu,
  },
  {
    label: 'Mega drive JP',
    value: megadriveJP,
  },
  {
    label: 'Mega CD (Europe)',
    value: megaCdEU,
  },
  {
    label: 'Mega CD (Japan)',
    value: megaCdJP,
  },
  {
    label: 'MS Dos',
    value: msdos,
  },
  {
    label: 'MSX',
    value: msx,
  },
  {
    label: 'MSX2',
    value: msx2,
  },
  {
    label: 'Nintendo Entertainment System',
    value: nes,
  },
  {
    label: 'Nintendo 64',
    value: n64,
  },
  {
    label: 'PC Engine',
    value: pce,
  },
  {
    label: 'Playstation',
    value: playstation,
  },
  {
    label: 'Sega Saturn',
    value: saturnEUUS,
  },
  {
    label: 'Sega Saturn JP',
    value: saturnJP,
  },
  {
    label: 'Sufami Turbo',
    value: SufamiTurbo,
  },
  {
    label: 'Sega CD',
    value: segaCd,
  },
  {
    label: 'Super Famicom',
    value: sFamicom,
  },
  {
    label: 'Super Nintendo (Europe)',
    value: snesEU,
  },
  {
    label: 'Super Nintendo (US)',
    value: snesUS,
  },
];

export const logoResource: EditResource = {
  data: logos,
  type: EditType.image,
}