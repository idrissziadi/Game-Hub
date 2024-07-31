// src/components/GameCard.js

import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';

// Import the click sound
const clickSound = new Howl({ src: ['/assets/button.wav'] });

const GameCard = ({ image, title, subTitle, route }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    clickSound.play();
    navigate(route);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: theme => theme.palette.background.paper,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontFamily: 'Do Hyeon, sans-serif',
            fontSize: '18px',
            lineHeight: '28px',
            fontWeight: 700,
            color: theme => theme.palette.primary.main,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: 'Do Hyeon, sans-serif',
            fontSize: '14px',
            lineHeight: '22px',
            fontWeight: 400,
          }}
        >
          {subTitle}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={handleNavigation}
          sx={{
            color: theme => theme.palette.primary.main,
            borderColor: theme => theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.main,
              color: '#fff',
            },
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
