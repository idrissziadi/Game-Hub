import React from 'react';
import { Grid, Typography } from '@mui/material';
import DrawerAppBar from '../components/DrawerAppBar';
import image from "../assets/card.png";
import GameCard from '../components/GameCard';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <Grid container direction="column" sx={{ minHeight: '100vh', backgroundColor: theme => theme.palette.background.default }}>
      {/* Header Section */}
      <Grid item>
        <DrawerAppBar title="Game Hub" backgroundColor="#000000" />
      </Grid>

      {/* Content Section */}
      <Grid item xs sx={{ paddingBottom: { xs: '40px', md: '100px' } }}>
        <Grid container sx={{ minHeight: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={9.8}>
            <Grid container spacing={6}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    lineHeight: '36px',
                    fontWeight: 700,
                    color: theme => theme.palette.primary.main,
                    fontFamily: 'Do Hyeon, sans-serif',
                  }}
                >
                  Awesome Games Collection
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <GameCard image={image} title={"Quiz"} subTitle={"Test your knowledge"} route="/Quiz" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <GameCard image={image} title={"Tenzies"} subTitle={"Dice game"} route="/TenziesGame" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <GameCard image={image} title={"Dice Roller"} subTitle={"Roll the dice"} route="/DiceRoller" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <GameCard image={image} title={"Rock Paper Scissor"} subTitle={"Rock Paper Scissor"} route="/RockPaperScissor" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Home;
