import React, { useEffect, useState } from 'react';
import {Box,Button,Tab,Container, Grid} from '@mui/material';
import { TabContext,TabList,TabPanel } from '@mui/lab';
import YourPoints from './yourPoints/YourPoints';
import YourBadge from './yourBadges/YourBadge';
import './Recognition.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsClapping,faGift,faBullseye, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { setDashboardTab } from "./reducer/recognitionDashboardReducer";
import { useDispatch ,useSelector } from "react-redux";
import ShowTargetsTab from './showTargets/ShowTargets';
import CreateTarget from './showTargets/popups/CreateTarget';
import './recognition-main.scss';
import TopBar from '../commonComponents/top-bar/top-bar';
import { getEmployeeProfileAction } from '../engagement/actions/engagement';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import EmployeeProfile from '../engagement/components/employee-profile/employee-profile';
import Cookies from 'universal-cookie';
import {TeamsFx, createMicrosoftGraphClient} from "@microsoft/teamsfx";
import recognitionSendRequestAction, { recognitionGetRequestAction, recognitionPutRequestAction } from './actions/recognitionRequestAction';
import { setEmployeeList, setManagerList, setBadgeList, setUserInfo } from './reducer/recognitionDashboardReducer';
import moment from 'moment/moment';
import { utilsRecognitionGetTargetCardList } from './utils';
import { setTeamsTargetList } from './showTargets/reducer/showTargetReducer';

export default function Recognition() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const cookie = new Cookies();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { dashboardTab, employeeList, userInfo } = useSelector((state)=>state.recognitionDashboard);
    const teamsfx1 = new TeamsFx();
    const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]); 
    const userProfile = cookie.get('userProfile');

    // ====== Show target get list start ========

    const [targetListLoading, setTargetListLoading] = useState(false);
    const handleUpdateCardList = async () => {
      // dispatch(setTeamsTargetList([]));
      setTargetListLoading(true);
      let targetType = pathname == '/recognition/manager-dashboard' ? 'recmodule/targetlistmgr' : 'recmodule/targetlistemp';
      let getTargetList = await utilsRecognitionGetTargetCardList(targetType);
      setTargetListLoading(false);
      dispatch(setTeamsTargetList(getTargetList));
    };
    useEffect(()=>{return () => dispatch(setTeamsTargetList([]));},[])
    
    // ====== Show target get list end ========


    const checkProfileAuth = async () => {
      let profileAPICall = await getEmployeeProfileAction('emp/profile');
      if(profileAPICall){
        return profileAPICall;
      }else{
        let variant = 'error';
        enqueueSnackbar('Error: Subscription removed', {variant});
        window.location.href = "/login";
      }
    }
    const getEmployeeList = async() => {
      let allEmployeeList = await recognitionGetRequestAction('recmodule/employeeList');
      let employeeListFiltered = await allEmployeeList?.filter(item => item?.is_manager == false);
      let managerListFiltered = await allEmployeeList?.filter(item => item?.is_manager == true);
      dispatch(setEmployeeList(employeeListFiltered));
      dispatch(setManagerList(managerListFiltered));
    }

    const getBadgeList = async () => {
      let allBadgeList = await recognitionGetRequestAction('recmodule/badge');
      if(allBadgeList?.length > 0){
        dispatch(setBadgeList(allBadgeList))
      }
    }
    const updateUserInfo = async () => {
      let currentUserInfo = await recognitionSendRequestAction('recmodule/userinfo');
      if(currentUserInfo){
        dispatch(setUserInfo(currentUserInfo))
      }
    }
    useEffect(()=>{
      checkProfileAuth();
      getEmployeeList();
      getBadgeList();
      updateUserInfo();
    },[])
    const handleChange = (event, newValue) => {
      dispatch(setDashboardTab(newValue))
    };
    const handleTargetFormSubmitAction = async (data) => {
      try{
        let employeeArray = data?.targetAssignEmployee?.map(item => item.value);
        let payload = {
          "employee_ids" : employeeArray,
          "name" : data?.targetName,
          "description" : data?.targetDescription,
          "points" : data?.targetReward?.value,
          "due_date" : moment(data?.targetDueDate).format('DD-MM-YYYY'),
        }
        let sendNewTarget = await recognitionSendRequestAction('recmodule/target',payload);
        if(sendNewTarget){
          let variant = 'success';
          enqueueSnackbar('Target Added', {variant});
          handleUpdateCardList();
        }
      }
      catch(error){
        let variant = 'error';
        enqueueSnackbar('Error: '+error.message, {variant});
      }
    }
    const handleBadgeFormSubmitAction = async(data = null) => {
      if(data){
        let payload = {
          "employee_ids" : data.assignBadgeEmployee?.map(item => item.value),
          "description"  : data?.badgeDescription
        }
        payload["name"] =  data.badgeType === 'createBadge' ?
          data?.badgeName : data?.badgeName?.name;
        let badgeAction = await recognitionSendRequestAction(`recmodule/badge${data.badgeType !== 'createBadge' ? '/'+data?.badgeName?.value : '' }`,payload,'true');
        if(badgeAction){
          let variant = 'success';
          enqueueSnackbar(`Badge ${data.badgeType === 'createBadge' ? 'added' : 'updated'}`, {variant});
          getBadgeList();
        }
      }
    }
    return (
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
            <div className='sidebar-wrap'>
                <EmployeeProfile 
                  employeeProfileData={userProfile} 
                  graphClient={graphClient}
                />
                <Box sx={{display:"flex",flexDirection:"column", justifyContent:"center"}}>
    
                  <YourPoints />
                  {pathname == '/recognition/manager-dashboard' && 
                    <>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        className="btn-border btn-full"
                        disabled={true}
                      >
                        Create New Badge
                      </Button>
                      <CreateTarget formSubmitAction={handleTargetFormSubmitAction} pointsToGive={userInfo?.points_to_give} />
                    </>
                  }
                </Box>

                <YourBadge />
            </div>
            <div className='recognition-right-wrap'>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={dashboardTab} >
                  <TabList onChange={handleChange} variant="scrollable" className='mainTabsHeader' scrollButtons={false}>
                    <Tab disabled={true} label="Company Feed" icon={<FontAwesomeIcon icon={faNewspaper} />} iconPosition="end" value="CompanyFeed" />
                    <Tab disabled={true} label="Give Recognition" icon={<FontAwesomeIcon icon={faHandsClapping} />} iconPosition="end" value="GiveRecognition" />
                    <Tab disabled={true} label="Redeem Points" icon={<FontAwesomeIcon icon={faGift} />} iconPosition="end" value="RedeemPoints" />
                    <Tab label="Show Targets" icon={<FontAwesomeIcon icon={faBullseye} />} iconPosition="end" value="ShowTargets" />
                  </TabList>
                  <TabPanel sx={{ padding: '0' }} value="CompanyFeed">
                      Loading...
                  </TabPanel>
                  <TabPanel sx={{ padding: '0' }} value="GiveRecognition">Loading...</TabPanel>
                  <TabPanel sx={{ padding: '0' }} value="RedeemPoints">Loading...</TabPanel>
                  <TabPanel sx={{ padding: '0' }} value="ShowTargets"><ShowTargetsTab updateCardListEvent={handleUpdateCardList} targetListLoading={targetListLoading} /></TabPanel>
                </TabContext>
              </Box>
            </div>
          </div>
        </Grid>
        </Container>
        </div>
      </>

    );
  }
  