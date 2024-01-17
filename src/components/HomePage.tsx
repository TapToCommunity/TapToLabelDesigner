import Typography from '@mui/material/Typography';
import bgUrl from '../assets/homebg.jpg';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="homepage">
      <div className="topBanner" style={{ backgroundImage: `url(${bgUrl})` }}>
        <div className="bannerContent"></div>
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
            <ul>
              <li>The project includes everything necessary to get running.</li>
              <li>
                All hardware required is inexpensive and readily available.
              </li>
              <li>
                It currently supports the MiSTer FPGA platform, with more
                planned.
              </li>
            </ul>
          </Typography>
        </div>
      </div>
      <div className="content">
        <h2>
          Made with ❤️ by{' '}
          <a href="https://github.com/asturur">Andrea Bogazzi</a>
        </h2>
      </div>
    </div>
  );
};
