import Typography from '@mui/material/Typography';
import { mediaTargetList } from '../printMediaTypes';

import './Carousel.css';
import { useAppDataContext } from '../contexts/appData';
import { useFileAdder } from '../hooks/useFileAdder';
import { templateAuthors } from '../templateAuthors';
import type { templateType } from '../resourcesTypedef';
import { useState, useLayoutEffect } from 'react';
import { ThreeDCarousel } from './ThreeDCarousel';

const TemplatesCarousel = () => {
  const { setTemplate, setMediaType, availableTemplates } = useAppDataContext();
  const { inputElement, openInputFile } = useFileAdder();
  const [items, setItems] = useState<(templateType & { key: string })[]>([]);

  useLayoutEffect(() => {
    setItems(
      Object.entries(availableTemplates)
        .map<templateType & { key: string }>(([key, value]) => ({
          ...value,
          key,
        }))
        .filter(
          (tData) =>
            (!!tData.overlay || !!tData.background) &&
            !tData.key.includes('blank'),
        ),
    );
  }, [availableTemplates]);

  return (
    <>
      {inputElement}
      <Typography variant="h3" color="primary">
        Choose the type of label you want to print:
      </Typography>
      <ThreeDCarousel onClick={console.log} />
      <div className="carousel-container">
        <div className="carousel-scroll">
          {mediaTargetList.map((tData) => (
            <div key={tData.label} onClick={() => setMediaType(tData)}>
              {tData.label}
            </div>
          ))}
        </div>
      </div>
      <Typography variant="h3" color="primary">
        Click a template from the {items.length} availables to get started:
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
              key={tData.key}
            >
              <div
                className={`carouselItem ${tData.layout}`}
                key={tData.key}
                onClick={() => {
                  setTemplate(tData);
                  openInputFile();
                }}
              >
                {tData.background && <img src={tData.background.url} />}
                {tData.overlay && <img src={tData.overlay.url} />}
              </div>
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
    </>
  );
};

export default TemplatesCarousel;
