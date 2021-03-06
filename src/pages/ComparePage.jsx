import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Container,
  Grid,
  Paper,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grow,
} from "@mui/material";
import { PaddingY } from "../components/Spacing";
import { SuccessButton } from "../utils/utils";
import "./ComparePage.scss";
import { useState } from "react";

function ComparePage() {
  const navigate = useNavigate();
  const { sharedUsername } = useParams();
  const [cookies, setCookie] = useCookies(["username"]);

  const [username, setUsername] = useState(cookies.username);
  const [validity, setValidity] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [checked, setChecked] = useState(true);

  const handleClick = () => {
    if (username.length > 0) {
      if (checked) {
        let expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        setCookie("username", username, { path: "/", expiryDate });
      }

      if (sharedUsername) {
        navigate(`/compare/${username}/${sharedUsername}`);
      } else {
        navigate(`/compare/${username}`);
      }
    } else {
      setHelperText("Username cannot be blank");
      setValidity(false);
    }
  };

  const handleChecked = event => {
    setChecked(event.target.checked);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className="grid"
    >
      <Grid item xs={11} sm={8} md={6}>
        <Grow in={true} timeout={500}>
          <Paper elevation={5} align="center" className="username-box">
            <PaddingY padding={"3vh"} />
            <img src="/chesstats_navbar_logo.png" alt="logo" className="logo" />
            {cookies.username ? (
              <>
                <p>Confirm your previous username or enter a new username!</p>
              </>
            ) : (
              <>
                <h2>Welcome to Chesstats!</h2>
                <p>
                  We noticed that we do not have your chess.com data. Please
                  input your chess.com username below to start comparing!
                </p>
              </>
            )}
            <PaddingY padding={"1vh"} />
            <Container maxWidth="md">
              <Grid container columnSpacing={1}>
                <Grid item xs={0} sm={1} />
                <Grid item xs={8} sm={8}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    error={!validity}
                    helperText={helperText}
                    defaultValue={username}
                    onChange={event => setUsername(event.target.value)}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={checked} onChange={handleChecked} />
                      }
                      label="Remember username"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={3} sm={2}>
                  <SuccessButton
                    sx={{ padding: "15px", width: "100%" }}
                    onClick={handleClick}
                  >
                    {cookies.username ? "Confirm" : "Submit"}
                  </SuccessButton>
                </Grid>
                <Grid item xs={0} sm={1} />
              </Grid>
            </Container>
            <PaddingY padding={"5vh"} />
          </Paper>
        </Grow>
      </Grid>
    </Grid>
  );
}

export default ComparePage;
