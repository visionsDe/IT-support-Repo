import {Box,Button,Tab,Container, Grid} from '@mui/material';
import React, { useEffect } from 'react';
import TopBar from '../../commonComponents/top-bar/top-bar';
import {pages, executeDeepLink, app, stageView, shareDeepLink, authentication, teams } from "@microsoft/teams-js";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getEmployeeProfileAction } from '../../engagement/actions/engagement';
export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const checkProfileAuth = async () => {
    let profileAPICall = await getEmployeeProfileAction('emp/profile')
    if(profileAPICall){
      return profileAPICall;
    }else{
      let variant = 'error';
      enqueueSnackbar('Error: Subscription removed', {variant});
      window.location.href = "/login";
    }
  }
  useEffect(()=>{
    checkProfileAuth();
  },[])
    return(
        <>
      <div className="rootWrapper">
      <div className="breadcrumb-wrap">
        <TopBar 
          menuList={
            [
              {'name':'Employee','value':'recognition/employee-dashboard'},
              {'name':'Manager','value':'recognition/manager-dashboard'}
            ]
          }
        />
      </div>
      <Container maxWidth="auto" className="rootContainer">      
        <Grid>
          <div className='recognition-wrap'>
            Employee Dashboard
            <Button onClick={
              async ()=>{
                const baseUrl = `https://${window.location.hostname}/`;
                let context = await app.getContext();
                  executeDeepLink(`https://teams.microsoft.com/l/entity/${process.env.REACT_APP_CLIENT_ID}/engagement?webUrl=${baseUrl}&label=engagement`);
                }
              }>
            Click to change tab
            </Button>
          </div>
        </Grid>
        </Container>
        </div>
      </>
    )
}
