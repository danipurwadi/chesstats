import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import "./NavigationBar.scss";
import { Container, Stack, Toolbar } from "@mui/material";

function NavigationBar() {
  return (
    <Box className="navigation-box">
      <AppBar position="static" className="navigation-bar">
        <Container maxWidth="xl" className="navigation-bar">
          <Toolbar style={{ minHeight: "30px", height: "100%", padding: 0 }}>
            <a href="/">
              <img
                src="/chesstats_navbar_logo.png"
                alt="logo"
                className="logo"
              />
            </a>
            <Container sx={{ flexGrow: 1 }}></Container>
            <Stack direction="row" spacing={3}>
              <a href="/compare" className="navbar-link">
                <h3>Compare</h3>
              </a>
              <a href="/about" className="navbar-link">
                <h3>About</h3>
              </a>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;
