import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import bgUrl from '../assets/homebg.jpg';
import logoUrl from '../assets/log.svg';
import { SmallDropZone } from './SmallDropZone';
import './HomePage.css';

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
            <SmallDropZone className="dropzoneExtra" />
          </div>
        </div>
      </div>
      <div className="intro">
        <div className="textLayout">
          <Typography variant="h3" color="primary">
            What’s TapTo?
          </Typography>
          <Typography>
            TapTo is an open source system for launching games and custom
            actions using physical objects. It's a great way to make launching
            games more accessible and add some fun to your gaming setup!
          </Typography>
          <Typography component="ul">
            <li>The project includes everything necessary to get running.</li>
            <li>All hardware required is inexpensive and readily available.</li>
            <li>
              It currently supports the MiSTer FPGA platform, with more planned.
            </li>
          </Typography>
          <Typography className="links">
            <Link href="https://github.com/wizzomafizzo/tapto/releases">
              Download
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/vendors.md">
              Vendors
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/community.md">
              Community Projects
            </Link>{' '}
            | <Link href="https://discord.com/invite/jNdWq52rBP">Discord</Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/developers.md">
              Developer Guide
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/wizzomafizzo/tapto/blob/main/docs/api.md">
              API
            </Link>
          </Typography>
        </div>
      </div>
      <div className="content">
        <div className="textLayout">
          <Typography variant="h3">What do you need labels for?</Typography>
          <Typography>Labels will make your card cool</Typography>
        </div>
        <Typography variant="h3">
          Made with ❤️ by{' '}
          <a href="https://github.com/asturur">Andrea Bogazzi</a>
          <br />
          Designed by <a href="https://timwilsie.com/">Tim Wilsie</a>
        </Typography>
      </div>
    </div>
  );
};
