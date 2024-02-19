import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type MouseEvent, useTransition } from 'react';
import { useFileDropperContext } from '../contexts/fileDropper';
import { CircularProgress } from '@mui/material';
import { boxShadow } from '../constants';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import './imageSearch.css';

// const SEARCH_ENDPOINT = 'https://tapto.wizzo.dev/steamgriddb/api/search/';
const IMAGE_ENDPOINT = 'https://tapto.wizzo.dev/steamgriddb/api/image/';
const GAMESDB_ENDPOINT = '/thegamesdb/v1.1/Games/ByGameName';

interface ImageSearchResult {
  gameName: string;
  imageUrl: string;
  thumbnailUrl: string;
}

interface GamePlatform {
  id: number;
  icon: number;
}

interface GameEntries {
  id: number;
  gameTitle: string;
  platform: GamePlatform;
  players: number;
  overview: string;
  coop: string;
}

async function fetchGameList(query: string): Promise<GameEntries[]> {
  const url = new URL(
    GAMESDB_ENDPOINT,
    `${window.location.protocol}//${window.location.hostname}`,
  );
  url.searchParams.append('name', query);
  url.searchParams.append('fields', 'platform,players,overview,coop');
  // url.searchParams.append('include', 'platform,boxart');
  console.log(url);
  const fetchGamesDb = fetch(url, {
    mode: 'cors',
  })
    .then((res) => res.json() as Promise<GameEntries[]>)
    .then((data) => console.log(data))
    .catch((err) => {
      console.error(err);
      return [];
    });
  console.log(await fetchGamesDb);
  return [];
}

// async function searchImage(query: string): Promise<ImageSearchResult[]> {
//   return fetch(SEARCH_ENDPOINT + encodeURIComponent(query))
//     .then((res) => {
//       return res.json() as Promise<ImageSearchResult[]>;
//     })
//     .catch((err) => {
//       console.error(err);
//       return [];
//     });
// }

async function getImage(cdnUrl: string, previousUrl: string): Promise<File> {
  const proxyUrl = IMAGE_ENDPOINT + cdnUrl.replace('https://', '');
  return fetch(proxyUrl)
    .then((r) => r.blob())
    .then((blob) => new File([blob], previousUrl, { type: blob.type }));
}

export default function ImageSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { files, setFiles } = useFileDropperContext();

  const [searchQuery, setSearchQuery] = useState<string>('');
  // const [gameEntries, setGameEntries] = useState<GameEntries[]>([]);
  const [searchResults, setSearchResults] = useState<ImageSearchResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const addImage = async (e: MouseEvent<HTMLImageElement>, url: string) => {
    const currentIndex = files.length;
    const target = e.target as HTMLImageElement;
    startTransition(() => {
      setTimeout(() => setOpen(false), 250);
      setFiles([...files, target as HTMLImageElement]);
    });
    getImage(url, target.src).then((file) => {
      files[currentIndex] = file;
      const newFiles = [...files];
      setFiles(newFiles);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    setSearchResults([]);
    fetchGameList(searchQuery);
    // .then((res) => {
    //   setSearching(false);
    //   setSearchResults(res);
    // });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="searchModal">
        <div className="verticalStack">
          <div className="horizontalStack searchHeader">
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
            <TextField
              className="textField"
              size="small"
              autoComplete="off"
              label="Game name"
              value={searchQuery}
              onChange={(evt) => setSearchQuery(evt.target.value)}
              style={{ fontWeight: 400, fontSize: 14 }}
              onKeyDown={(e: any) => e.key === 'Enter' && executeSearch(e)}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                boxShadow,
                fontSize: '0.9375rem',
                textTransform: 'none',
                height: '44px',
              }}
              onClick={executeSearch}
            >
              {searching ? (
                <CircularProgress color="secondary" size={24} />
              ) : (
                <p>Search</p>
              )}
            </Button>
          </div>
          <Typography variant="h3">
            {searchResults.length > 0 ? searchResults[0].gameName : ''}
          </Typography>
          <div className="searchResultsContainer horizontalStack">
            {searchResults.map((result) => (
              <Button className="searchResult" key={result.imageUrl}>
                <img
                  src={result.thumbnailUrl}
                  onClick={(e) => addImage(e, result.imageUrl)}
                  style={{ cursor: 'pointer' }}
                />
              </Button>
            ))}
            {new Array(searchResults.length % 4).fill(0).map(() => (
              <div className="searchResult" />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
