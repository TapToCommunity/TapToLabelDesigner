import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import bgUrl from '../assets/homebg.jpg';
import logoUrl from '../assets/log.svg';
import examplesUrl from '../assets/tapto_cards.jpg';
import { SmallDropZone } from './SmallDropZone';
import { templateAuthors } from '../templateAuthors';

import './HomePage.css';
import { Fragment, lazy } from 'react';

const Carousel = lazy(() => import('./Carousel'));

export const HomePage = () => {
  return (
    <div className="homepage">
      <div className="topBanner" style={{ backgroundImage: `url(${bgUrl})` }}>
        <div className="bannerContent">
          <div className="central">
            <div>
              <img
                style={{ width: '260px', height: 'auto', marginBottom: '18px' }}
                src={logoUrl}
              />
              <Typography variant="h4">LABEL GENERATOR</Typography>
            </div>
            <SmallDropZone />
          </div>
        </div>
      </div>
      <div className="intro">
        <div className="textLayout">
          <Typography variant="h3" color="primary">
            What’s TapTo?
          </Typography>
          <Typography>
            <a href="https://github.com/wizzomafizzo/tapto/">TapTo</a> is an
            open source system for launching games and scripted actions using
            physical objects like NFC cards. It's a great way to make playing
            games more accessible and add some fun to your gaming setup! TapTo
            is currently supported on{' '}
            <a href="https://mister-devel.github.io/MkDocs_MiSTer/">
              MiSTer FPGA
            </a>
            ,{' '}
            <a href="https://github.com/SensoriumEmbedded/TeensyROM/blob/main/docs/NFC_Loader.md">
              Commodore 64 (via Teensy ROM)
            </a>
            , with other platforms coming soon!
          </Typography>
          <Typography>
            Additional hardware is required but the aim is to be affordable and
            easily available. Please join the{' '}
            <a href="https://wizzo.dev/discord">Discord</a> if you need any help
            or want to show off your work!
          </Typography>
          <Typography className="links">
            <Link href="https://github.com/wizzomafizzo/tapto/releases">
              Download TapTo
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/labels.md">
              Printing Labels
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/community.md#cases">
              NFC Reader Cases
            </Link>{' '}
            | <Link href="https://discord.com/invite/jNdWq52rBP">Discord</Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/developers.md">
              Vendors
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/community.md">
              Community Projects
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/api.md">
              API
            </Link>
          </Typography>
        </div>
      </div>
      <div className="choose-template">
        <div className="textLayout">
          <Carousel />
        </div>
      </div>
      <div className="content">
        <div className="textLayout">
          <Typography variant="h3">What's TapTo Designer?</Typography>
          <img style={{ marginBottom: '18px' }} src={examplesUrl} />
          <Typography>
            Having your favorite artwork on your NFC token is the perfect
            finishing touch for your TapTo collection. TapTo Designer
            streamlines this process to accomodate every skill level.
          </Typography>
          <Typography>
            Simply upload your artwork, choose from a variety of TapTo label
            templates, and export in a growing number of print ready formats.
            Not sure where to get artwork? No worries! We have you covered with
            our integrated game search tools.
          </Typography>
        </div>
      </div>
      <div className="credits">
        <div className="textLayout">
          <Typography variant="h3">
            Made with ❤️ by{' '}
            <a href="https://github.com/asturur">Andrea Bogazzi</a>
            <br />
            Designed by <a href="https://timwilsie.com/">Tim Wilsie</a>
            <br />
            Templates provided by{' '}
            {Object.values(templateAuthors).map(({ name, href }, index) => (
              <Fragment key={name}>
                <a key={`auth_${index}`} href={href}>
                  {name}
                </a>
                ,{' '}
              </Fragment>
            ))}
          </Typography>
        </div>
      </div>
    </div>
  );
};
