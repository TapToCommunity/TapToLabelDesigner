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

interface ApiGameEntry {
  id: number;
  game_title: string;
  platform: GamePlatform;
  players: number;
  overview: string;
  coop: string;
}

interface GameEntry {
  id: number;
  gameTitle: string;
  platform: GamePlatform;
  players: number;
  overview: string;
  coop: string;
}

type GameListData = {
  games: GameEntry[];
  moreLink?: string;
};

async function fetchGameList(query: string): Promise<GameListData> {
  const url = new URL(
    GAMESDB_ENDPOINT,
    'https://deploy-preview-18--tapto-designer.netlify.app',
    // `${window.location.protocol}//${window.location.hostname}`,
  );
  url.searchParams.append('name', query);
  url.searchParams.append('fields', 'platform,players,overview,coop');
  // url.searchParams.append('include', 'platform,boxart');
  return (
    fetch(url, {
      mode: 'cors',
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res) => res.json() as Promise<any>)
      .then(({ data, pages, code }) => {
        if (code === 200) {
          return {
            games: (data.games as ApiGameEntry[]).map<GameEntry>(
              ({
                game_title: gameTitle,
                platform,
                players,
                coop,
                overview,
                id,
              }: ApiGameEntry) => ({
                gameTitle,
                platform,
                id,
                coop,
                players,
                overview,
              }),
            ),
            moreLink: pages.next
              ? pages.next.replace('https://api.thegamesdb.net/', '')
              : undefined,
          };
        } else {
          return {
            games: [] as GameEntry[],
          };
        }
      })
      .catch((err) => {
        console.error(err);
        return {
          games: [] as GameEntry[],
        };
      })
  );
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
  const [gameEntries, setGameEntries] = useState<GameEntry[]>([]);
  const [moreLink, setMoreLink] = useState<string>('');
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
    fetchGameList(searchQuery).then(({ games, moreLink }) => {
      setGameEntries([...gameEntries, ...games]);
      if (moreLink) {
        setMoreLink(moreLink);
      }
    });
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
          <div className="searchResultsContainer verticalStack">
            {gameEntries.map((gameEntry) => (
              <Typography variant="h6">{gameEntry.gameTitle}</Typography>
            ))}
            {moreLink}
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
