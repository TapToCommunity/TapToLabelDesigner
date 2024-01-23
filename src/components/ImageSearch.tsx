import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const API_URL = 'https://tapto.wizzo.dev/steamgriddb/api/search/';

interface ImageSearchResult {
  gameName: string;
  imageUrl: string;
  thumbnailUrl: string;
}

async function searchImage(query: string): Promise<ImageSearchResult[]> {
  return fetch(API_URL + encodeURIComponent(query))
    .then((res) => {
      return res.json() as Promise<ImageSearchResult[]>;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

export function ImageSearch(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ImageSearchResult[]>([]);

  return (
    <Modal open={props.open} onClose={() => props.setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxHeight: '90%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          color: 'text.primary',
          overflow: 'scroll',
        }}
      >
        <TextField
          label="Search"
          value={searchQuery}
          size="small"
          onChange={(evt) => setSearchQuery(evt.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            searchImage(searchQuery).then((res) => {
              setSearchResults(res);
            });
          }}
        >
          Search
        </Button>
        <Typography variant="h3">
          {searchResults.length > 0 ? searchResults[0].gameName : 'No Results'}
        </Typography>
        <Grid container spacing={1}>
        {searchResults.map((result) => (
          <Grid item xs={3}>
            <img src={result.thumbnailUrl} />
          </Grid>
        ))}
        </Grid>
        
      </Box>
    </Modal>
  );
}
