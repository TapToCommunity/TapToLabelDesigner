import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { templateType, templates } from '../cardsTemplates';
import './Carousel.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const items = Object.entries(templates)
  .map<templateType & { key: string }>(([key, value]) => ({
    ...value,
    key,
  }))
  .filter((tData) => !!tData.overlay || !!tData.background);

const TemplatesCarousel = () => {
  return (
    <Carousel
      responsive={responsive}
      swipeable={true}
      draggable={true}
      infinite={true}
      autoPlay={false}
      keyBoardControl={false}
      containerClass="carousel-container"
      itemClass="carouselItemOuter"
    >
      {items.map((tData) => (
        <div key={tData.key} className={`carouselItem ${tData.layout}`}>
          {tData.background && <img src={tData.background.url} />}
          {tData.overlay && <img src={tData.overlay.url} />}
        </div>
      ))}
    </Carousel>
  );
};

export default TemplatesCarousel;
