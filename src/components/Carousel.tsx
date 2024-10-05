import Typography from '@mui/material/Typography';
import { mediaTargetList } from '../printMediaTypes';

import './Carousel.css';
import { useAppDataContext } from '../contexts/appData';
import { useFileAdder } from '../hooks/useFileAdder';
import { templateAuthors } from '../templateAuthors';
import type { templateType } from '../resourcesTypedef';
import { useState, useLayoutEffect, useEffect, memo } from 'react';
import MediaTypeDropdown from './MediaTypeDropdown';
import sob3 from '../assets/art/sampleart.webp';
import { prepareTemplateCarousel } from '../utils/prepareTemplateCarousel';
// import { ThreeDCarousel } from './ThreeDCarousel';

const getTemplateId = (id: string) => `template_replace_${id}`;

const TemplatesCarousel = memo(() => {
  const { setTemplate, availableTemplates } = useAppDataContext();
  const { inputElement, openInputFile } = useFileAdder();
  const [items, setItems] = useState<(templateType & { key: string })[]>([]);

  useLayoutEffect(() => {
    setItems(
      availableTemplates.filter(
        (tData) =>
          (!!tData.overlay || !!tData.background) &&
          !tData.key.includes('blank'),
      ),
    );
  }, [availableTemplates]);

  useEffect(() => {
    prepareTemplateCarousel(items, sob3).then((canvases) => {
      canvases.forEach((canvas, index) => {
        const template = items[index];
        const id = getTemplateId(template.key);
        const div = document.getElementById(id);
        if (div?.firstChild) {
          div.removeChild(div.firstChild);
        }
        if (div) {
          div.appendChild(canvas);
        }
      });
    });
  }, [items]);

  return (
    <>
      {inputElement}
      {/* <ThreeDCarousel onClick={console.log} /> */}
      <Typography variant="h3" color="primary">
        Click a template from the {items.length} availables to get started:
      </Typography>
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <Typography variant="h5" color="secondary">
          Or change the card type to one of the {mediaTargetList.length}{' '}
          available:
        </Typography>
        <MediaTypeDropdown />
      </div>
      <div className="carousel-container">
        <div className="carousel-scroll">
          {items.map((tData) => (
            <div
              className="carouselItem-externals"
              onDragStart={(e) => {
                e.preventDefault();
                return false;
              }}
              key={tData.key}
            >
              <div
                className={`carouselItem ${tData.layout}`}
                id={getTemplateId(tData.key)}
                key={tData.key}
                onClick={() => {
                  setTemplate(tData);
                  openInputFile();
                }}
              ></div>
              <Typography className="carouselCaption">
                {tData.label}
                <br />
                by
                <br />
                {templateAuthors[tData.author].name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
      <Typography variant="p" color="secondary" lineHeight="3">
        * Super outback bloke 3 is not a real game
      </Typography>
    </>
  );
});

export default TemplatesCarousel;
