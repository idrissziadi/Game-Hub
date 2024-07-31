import React, { useState } from 'react';
import { Button, Checkbox, Grid, Paper, Typography } from '@mui/material';
import { quizCategories } from './../assets/data';
import { Howl } from 'howler';

// Import the click sound
const clickSound = new Howl({ src: ['/assets/button.wav'] });

function Quiz() {
  const [start, setStart] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);

  const handleStart = (selectedCategory) => {
    clickSound.play();
    setCategory(selectedCategory);
    setQuestions(quizCategories[selectedCategory]);
    setStart(true);
    setScore(0);
    setActiveIndex(0);
    setQuizCompleted(false);
  };

  const submit = () => {
    clickSound.play();
    const correctAnswers = questions[activeIndex].response;
    const isCorrect = selectedOptions.sort().join() === correctAnswers.sort().join();
    if (isCorrect) {
      setScore(score + 1);
    }
    setSelectedOptions([]);

    if (activeIndex === questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setActiveIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleCheckBoxChange = (item) => {
    const newOptions = selectedOptions.includes(item)
      ? selectedOptions.filter((option) => option !== item)
      : [...selectedOptions, item];
    setSelectedOptions(newOptions);
  };

  const restartQuiz = () => {
    clickSound.play();
    setStart(false);
    setQuizCompleted(false);
    setActiveIndex(0);
    setScore(0);
    setSelectedOptions([]);
  };

  if (!start) {
    return (
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#310000' }}>
        <Grid item md={6} xs={12}>
          <Paper sx={{ borderRadius: '16px', padding: '20px', background: '#731010' }}>
            <Typography variant="h4" textAlign="center" color="primary">Choisissez une catégorie de quiz</Typography>
            <Grid container spacing={2} justifyContent="center" marginTop="20px">
              {Object.keys(quizCategories).map((cat) => (
                <Grid item key={cat}>
                  <Button fullWidth onClick={() => handleStart(cat)} variant="contained" color="primary">{cat}</Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  if (quizCompleted) {
    return (
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#310000' }}>
        <Grid item md={6} xs={12}>
          <Paper sx={{ borderRadius: '16px', padding: '20px', background: '#731010' }}>
            <Typography variant="h4" color="primary">Quiz Terminé!</Typography>
            <Typography variant="h5" color="primary">Votre Score: {score}/{questions.length}</Typography>
            <Button fullWidth onClick={restartQuiz} variant="contained" color="primary">Recommencer</Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#310000' }}>
      <Grid item md={9} xs={12}>
        <Paper sx={{ borderRadius: '16px', padding: '20px', background: '#731010' }}>
          <Grid container>
            <Grid item md={12} xs={12} textAlign={'center'}>
              <Typography variant="h3" color="primary">Quiz App - {category}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="h5" color="primary">Question {activeIndex + 1}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="h5" color="primary">{questions[activeIndex].question}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              {questions[activeIndex].options.map((item, index) => (
                <Grid item key={index} xs={6}>
                  <Checkbox checked={selectedOptions.includes(item)} onChange={() => handleCheckBoxChange(item)} />
                  {item}
                </Grid>
              ))}
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container sx={{ display: 'flex', justifyContent: 'end' }}>
                <Grid item md={1}>
                  <Button fullWidth onClick={submit} disabled={selectedOptions.length === 0} variant="contained" color="primary">Submit</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Quiz;
