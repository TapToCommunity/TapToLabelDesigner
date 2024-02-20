import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type MouseEvent, useTransition, useEffect } from 'react';
import { useFileDropperContext } from '../contexts/fileDropper';
import { CircularProgress } from '@mui/material';
import { boxShadow } from '../constants';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import './imageSearch.css';

// const SEARCH_ENDPOINT = 'https://tapto.wizzo.dev/steamgriddb/api/search/';
// const IMAGE_ENDPOINT = 'https://tapto.wizzo.dev/steamgriddb/api/image/';
const GAMESDB_SEARCH_ENDPOINT = '/thegamesdb/v1.1/Games/ByGameName';
const GAMESDB_IMAGE_ENDPOINT = '/thegamesdb/v1/Games/Images';
interface ImageSearchResult {
  imageUrl: string;
  thumbnailUrl: string;
}

type PlatformData = {
  alias: string;
  console: string | null;
  icon: string;
  id: number;
  name: string;
  overview: string;
};

interface ApiGameEntry {
  id: number;
  game_title: string;
  platform: number;
  players: number;
  overview?: string;
  coop: string;
  boxart?: string;
}

interface GameEntry {
  id: number;
  gameTitle: string;
  platform: PlatformData;
  players: number;
  overview?: string;
  coop: string;
  boxart: string;
}

type GameListData = {
  games: GameEntry[];
  moreLink?: string;
};

type GameImagesData = {
  images: ImageSearchResult[];
};

let platformsData: Record<string, PlatformData> = {};

async function fetchGameList(query: string): Promise<GameListData> {
  const url = new URL(
    GAMESDB_SEARCH_ENDPOINT,
    'https://deploy-preview-18--tapto-designer.netlify.app',
    // `${window.location.protocol}//${window.location.hostname}`,
  );
  url.searchParams.append('name', query);
  url.searchParams.append('fields', 'platform,players');
  url.searchParams.append('include', 'boxart');
  return (
    fetch(url, {
      mode: 'cors',
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res) => res.json() as Promise<any>)
      .then(({ data, pages, code, include }) => {
        if (code === 200 && data.count > 0) {
          const { base_url, data: boxArts } = include.boxart;
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
                platform: platformsData[platform],
                id,
                coop,
                players,
                overview,
                boxart: `${base_url.medium}${boxArts[id][0].filename}`,
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

async function fetchGameImages(gameId: number): Promise<GameImagesData> {
  const url = new URL(
    GAMESDB_IMAGE_ENDPOINT,
    'https://deploy-preview-18--tapto-designer.netlify.app',
    // `${window.location.protocol}//${window.location.hostname}`,
  );
  url.searchParams.append('games_id', `${gameId}`);
  url.searchParams.append(
    'filter[type]',
    'fanart,banner,boxart,screenshot,clearlogo,titlescreen',
  );
  return (
    fetch(url, {
      mode: 'cors',
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res) => res.json() as Promise<any>)
      .then(({ data, code }) => {
        if (code === 200) {
          const { base_url, images } = data;
          const pictures = images[gameId];
          return {
            images: pictures.map((picture: any) => ({
              imageUrl: `${base_url.original}${picture.filename}`,
              thumbnailUrl: `${base_url.small}${picture.filename}`,
            })),
          };
        } else {
          return {
            images: [] as ImageSearchResult[],
          };
        }
      })
      .catch((err) => {
        console.error(err);
        return {
          images: [] as ImageSearchResult[],
        };
      })
  );
}

async function getImage(cdnUrl: string, previousUrl: string): Promise<File> {
  const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(cdnUrl);
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

  // load the games platform
  useEffect(() => {
    import('../gamesDbPlatforms').then(
      ({ platforms }: { platforms: Record<string, PlatformData> }) => {
        platformsData = platforms;
      },
    );
  }, []);

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
      setSearching(false);
    });
  };

  const switchToGameView = (gameId: number) => {
    fetchGameImages(gameId).then((data: any) => {
      setSearchResults(data.images);
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
          <Typography variant="h3"></Typography>
          {searchResults.length === 0 && (
            <div className="searchResultsContainer horizontalStack">
              {gameEntries.map((gameEntry) => (
                <div className="searchResult" key={gameEntry.id}>
                  <Button>
                    <img
                      src={gameEntry.boxart}
                      onClick={(e) => addImage(e, gameEntry.boxart)}
                      style={{ cursor: 'pointer' }}
                    />
                  </Button>
                  <Button
                    className="verticalStack"
                    onClick={() => switchToGameView(gameEntry.id)}
                  >
                    <Typography variant="h6">{gameEntry.gameTitle}</Typography>
                    <Typography variant="h6">
                      {gameEntry.platform.name}
                    </Typography>
                  </Button>
                </div>
              ))}
              {new Array(gameEntries.length % 4).fill(0).map(() => (
                <div className="searchResult" />
              ))}
              {moreLink && <Button>Load more...</Button>}
            </div>
          )}
          {searchResults.length > 0 && (
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
          )}
        </div>
      </div>
    </Modal>
  );
}
