import Typography from '@mui/material/Typography';
import { templateType, templates } from '../cardsTemplates';
import './Carousel.css';
import { useAppDataContext } from '../contexts/appData';

const TemplatesCarousel = () => {
  const { setTemplate } = useAppDataContext();

  const items = Object.entries(templates)
    .map<templateType & { key: string }>(([key, value]) => ({
      ...value,
      key,
    }))
    .filter(
      (tData) =>
        (!!tData.overlay || !!tData.background) && !tData.key.includes('blank'),
    );

  return (
    <>
      <Typography variant="h3" color="primary">
        Choose a template to get started from the {items.length} available
      </Typography>
      <div className="carousel-container">
        <div className="carousel-scroll">
          {items.map((tData) => (
            <div
              className="carouselItem-externals"
              onDragStart={(e) => {
                e.preventDefault();
                return false;
              }}
            >
              <div
                className={`carouselItem ${tData.layout}`}
                key={tData.key}
                onClick={() => {
                  setTemplate(tData);
                }}
              >
                {tData.background && <img src={tData.background.url} />}
                {tData.overlay && <img src={tData.overlay.url} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplatesCarousel;
