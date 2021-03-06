import {
  Button,
  Container,
  Grid,
  Stack,
  Divider,
  Dialog,
  Avatar,
} from "@mui/material";
import { useScreenshot, createFileName } from "use-react-screenshot";
import React, { createRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfilePicture, getStats } from "../utils/apiRequests";
import { NormalButton } from "../utils/utils";
import { PaddingY } from "../components/Spacing";
import ResultsRadarChart from "../components/ResultsRadarChart";
import ResultsBarChart from "../components/ResultsBarChart";
import CopyToClipboard from "../components/CopyToClipboard";
import LoadingAnimation from "../components/LoadingAnimation";
import * as utils from "../utils/utils";

import "./ResultsPage.scss";

function ResultsPage() {
  const ref = createRef(null);
  const { username, otherUsername } = useParams();
  const [timeControl, setTimeControl] = useState("bullet");
  const [apiData, setApiData] = useState({});
  const [graphData, setGraphData] = useState(undefined);
  const [profilePicture, setProfilePicture] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats(username, otherUsername).then(d => setApiData(d));
    getProfilePicture(username, otherUsername).then(d => setProfilePicture(d));
  }, [username, otherUsername]);

  useEffect(() => {
    setGraphData(utils.formatStats(apiData, timeControl));
    if (apiData.currUserData) {
      setLoading(false);
    }
  }, [apiData, timeControl]);

  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });

  const getImage = () => {
    takeScreenShot(ref.current, { useCORS: true });
    setOpen(true);
  };

  const download = (
    image,
    { name = "chesstats_screenshot", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenShot(ref.current, { useCORS: true }).then(download);

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <Container maxWidth="xl">
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            maxWidth="sm"
          >
            <Container align="center" className="dialog-container">
              <PaddingY padding={"2vh"} />
              <h3 style={{ margin: 0 }}>Share your Chesstats!</h3>
              <p>
                Either share by downloading a screenshot, or using the result
                URL
              </p>
              <PaddingY padding={"1vh"} />

              <Stack alignItems="center" spacing={3}>
                {image ? (
                  <img
                    src={image}
                    alt={"ScreenShot"}
                    className="screenshot-img"
                  ></img>
                ) : (
                  <div class="loading-logo">
                    <div className="square-1"></div>
                    <div className="square-2"> </div>
                    <div className="square-3"></div>
                  </div>
                )}
                <NormalButton
                  sx={{ padding: "10px 40px" }}
                  onClick={downloadScreenshot}
                >
                  Download
                </NormalButton>
              </Stack>
              <PaddingY padding={"1vh"} />
              <Divider className="screenshot-divider">or</Divider>
              <PaddingY padding={"1vh"} />
              <CopyToClipboard text={`${window.location.href}`} />
              <PaddingY padding={"2vh"} />
            </Container>
          </Dialog>

          <div ref={ref} className="screenshot-div">
            <Container align="center">
              <h1>Chesstats Results</h1>
            </Container>
            <Grid container rowSpacing={3}>
              <Grid item xs={2} sm={3} md={1}>
                <Stack>
                  <PaddingY padding={"15vh"} />
                  <div className="data-list">
                    <p>Current Rating</p>
                  </div>
                  <div className="data-list">
                    <p>Highest Rating</p>
                  </div>
                  <div className="data-list">
                    <p>Win %</p>
                  </div>
                  <div className="data-list">
                    <p>Total Games</p>
                  </div>
                  <div className="data-list">
                    <p>Tactics Rating</p>
                  </div>
                </Stack>
              </Grid>
              <Grid item xs={5} sm={4} md={3}>
                <ProfileStack
                  apiData={apiData.currUserData}
                  timeControl={timeControl}
                  profilePicture={profilePicture[0]}
                />
              </Grid>
              <Grid
                item
                xs={0}
                sm={0}
                md={4}
                align="center"
                sx={{
                  display: { xs: "none", md: "block" },
                }}
              >
                <div className="chart-container">
                  <ResultsRadarChart
                    users={[apiData.currUserData, apiData.otherUserData]}
                    stats={graphData}
                  />
                </div>
                {Array.from(Array(5).keys()).map(index => {
                  const currStats = graphData ? graphData[0][index] : 0;
                  const otherStats = graphData ? graphData[1][index] : 0;
                  const currLabel = graphData ? graphData[2][index] : 0;
                  const otherLabel = graphData ? graphData[3][index] : 0;
                  return (
                    <div className="bar-container" key={index}>
                      <ResultsBarChart
                        label=""
                        stats={[currStats, otherStats, currLabel, otherLabel]}
                      />
                    </div>
                  );
                })}
              </Grid>
              <Grid item xs={5} sm={4} md={3}>
                <ProfileStack
                  apiData={apiData.otherUserData}
                  timeControl={timeControl}
                  profilePicture={profilePicture[1]}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1}>
                <Stack
                  direction="column"
                  spacing={2}
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <Button
                    variant="outlined"
                    disabled={timeControl === "bullet"}
                    onClick={() => setTimeControl("bullet")}
                  >
                    Bullet
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={timeControl === "blitz"}
                    onClick={() => setTimeControl("blitz")}
                  >
                    Blitz
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={timeControl === "rapid"}
                    onClick={() => setTimeControl("rapid")}
                  >
                    Rapid
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={6} md={4}>
                <h3>Win Probability:</h3>
              </Grid>
              <Grid item xs={6} md={4} align="center">
                <h1>
                  {apiData
                    ? utils.WinProbabilityCalculator(apiData, timeControl)
                    : "0.00"}
                  %
                </h1>
              </Grid>
            </Grid>
          </div>
          <Stack alignItems="center" spacing={2}>
            <NormalButton sx={{ padding: "10px 50px" }} onClick={getImage}>
              Share
            </NormalButton>
          </Stack>
        </Container>
      )}
    </>
  );
}

function ProfileStack({ apiData, timeControl, profilePicture }) {
  return (
    <Stack align="center">
      <Stack sx={{ height: "30vh" }} alignItems="center">
        <Avatar alt="Avatar" src={profilePicture} className="profile-logo" />
        <h2>{apiData ? apiData.username : "loading..."}</h2>
      </Stack>
      <div className="data-list">
        <p>
          {apiData ? apiData[`${timeControl}`]["currentRating"] : "loading..."}
        </p>
      </div>
      <div className="data-list">
        <p>
          {apiData ? apiData[`${timeControl}`]["bestRating"] : "loading..."}
        </p>
      </div>

      <div className="data-list">
        <p>
          {apiData
            ? `${utils.round(
                apiData[`${timeControl}`]["winPercentage"] * 100,
                2
              )}%`
            : "loading..."}
        </p>
      </div>
      <div className="data-list">
        <p>
          {apiData ? apiData[`${timeControl}`]["totalGames"] : "loading..."}
        </p>
      </div>
      <div className="data-list">
        <p>{apiData ? apiData["tactics"] : "loading..."}</p>
      </div>
    </Stack>
  );
}

export default ResultsPage;
