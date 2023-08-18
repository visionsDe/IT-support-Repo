import React, { useEffect, useState } from "react";
import EmployeeProfile from "../components/employee-profile/employee-profile";
import PulseRating from "../components/pulse-rating/pulseRating";
import EngagementPillars from "../components/engagement-pillars/engagement-pillars";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Charts from "../components/charts/charts";
import Stack from "@mui/material/Stack";
import PillarIndicators from "../components/pillar-indicators/pillar-indicators";
import TopBar from "../../commonComponents/top-bar/top-bar";
import { updateEngagement } from '../helper/helper'
import { useSelector, useDispatch } from "react-redux";
import {TeamsFx, createMicrosoftGraphClient} from "@microsoft/teamsfx";


import { setEmployeeTrendGraph } from "../reducer/trendsGraphList";
import { getTrendGraphAction } from "../actions/trendGraphList";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const teamsfx1 = new TeamsFx();
  const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]); 
  const { employeeProfileData } = useSelector((state) => state.engagementCategory);
  const trendGraphUpdate = async (element) => {
    let url;
    if(element == 'months'){
      url = 'emp/trend/pulse?type=months';
    }else if(element == 'years'){
      url = 'emp/trend/pulse?type=years';
    }else{
      url = 'emp/trend/pulse?type=weeks';
    }
   let record = await getTrendGraphAction(url);
   if(record){
    dispatch(setEmployeeTrendGraph(record))
   }
   else{
    let variant = 'error';
    enqueueSnackbar('Error: Session Expired', {variant});
    navigate('/login')
   }
  }

  useEffect(() => {
    trendGraphUpdate();
    
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };

  }, []);
  function getWindowSize() {
    const { innerWidth } = window;
    return { innerWidth };
  }

  const triggerTrendEvent = (element)=>{
    trendGraphUpdate(element);
  }
  return (
    <>
    <div className="rootWrapper">
      <div className="breadcrumb-wrap">
        <TopBar />
      </div>
      <Container maxWidth="auto" className="rootContainer">      
        <Grid>
          <Stack className="topRow" sx={{ display: "grid" }}>
            <Grid item className="topLeft">
              <EmployeeProfile employeeProfileData={employeeProfileData} graphClient={graphClient}
             />
              {windowSize.innerWidth >= 992 &&
                <PillarIndicators />
              }
            </Grid>
            <Grid item className="topRight">
              <div className="topRight-inner">
                <PulseRating />
                <Charts handleTrendEvent={(element)=>triggerTrendEvent(element)} />
              </div>
              {windowSize.innerWidth >= 992 &&
                <div className="topRight-inner">
                  <EngagementPillars />
                </div>
              }
            </Grid>
          </Stack>
          {windowSize.innerWidth <= 991 &&
            <Stack className="bottomRow">
              {windowSize.innerWidth <= 991 &&
                <PillarIndicators />
              }
              <EngagementPillars />
            </Stack>
          }
        </Grid>
      </Container>
    </div>

    </>
  );
};

// EmployeeDashboard.propTypes = {};

// EmployeeDashboard.defaultProps = {};

export default EmployeeDashboard;
