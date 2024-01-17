import bgUrl from '../assets/homebg.jpg';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="homepage">
      <div className="topBanner" style={{ backgroundImage: `url(${bgUrl})` }}>
        <div className="bannerContent"></div>
      </div>
      <div className="intro"></div>
      <h2>
        Made with ❤️ by <a href="https://github.com/asturur">Andrea Bogazzi</a>
      </h2>
    </div>
  );
};
