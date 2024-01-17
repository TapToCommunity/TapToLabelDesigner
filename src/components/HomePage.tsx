import bgUrl from '../assets/bg.png';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="somePadding">
      <h1>
        A Label printer for the{' '}
        <a href="https://github.com/wizzomafizzo/tapto">TapTo</a> system
      </h1>
      <h2>How does it work?</h2>
      <h3>
        You can drag and drop images from your local disk, or add them clicking{' '}
        <a href="https://github.com/wizzomafizzo/tapto">here</a>. Then pick up a
        template and customize the colors, finally download a pdf with the
        labels ready to printed and cut and put on your NFC cards
      </h3>
      <img className="tapToImg" src={bgUrl} />
      <h2>
        Made with ❤️ by <a href="https://github.com/asturur">Andrea Bogazzi</a>
      </h2>
    </div>
  );
};
