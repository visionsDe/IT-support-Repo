import React, { useEffect, useState } from "react";
import ChangeTracking from "../components/change-tracking/change-tracking";
import EmployeeProfile from "../components/employee-profile/employee-profile";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Charts from "../components/charts/charts";
import Stack from "@mui/material/Stack";
import PillarIndicators from "../components/pillar-indicators/pillar-indicators";
import TopBar from "../../commonComponents/top-bar/top-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ProfileEngagementPillars from "../components/engagement-pillars/profile-enagagement-pillars";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getIndividualEmployeeProfileAction } from "../actions/engagement";
import { setIndividualEmployeeProfileData } from "../reducer/engagementPillars";
import { useDispatch, useSelector } from "react-redux";
import {TeamsFx, createMicrosoftGraphClient} from "@microsoft/teamsfx";

import { setEmployeeTrendGraph } from "../reducer/trendsGraphList";
import { getTrendGraphAction } from "../actions/trendGraphList";

import { getTrackingAction } from "../actions/changeTrackingList";
import { setChangeTracking } from "../reducer/changeTrackingList";
import { engagementCategoryListAction } from "../actions/engagement";
import moment from "moment";
import * as _ from "lodash";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [profileLoadingStatus, setProfileLoadingStatus] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {individualEmployeeProfileData} = useSelector((state) => state.engagementCategory);
  const { changeTracking } = useSelector(state => state.changeTracking);
  const teamsfx1 = new TeamsFx();
  const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]); 
  useEffect(() => {
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
  const getValueProfile = (element,find) => {
    let result = element?.filter(item => item.engagement_category == find);
    return !!result ? result[0] : {}
  }
  
  const engagementCategoriesSort = (list,data)=>{
    let record = list?.map((item) => {
      let val = getValueProfile(data,item.code);
      let result = {...item ,...val};
      return result;
    })
    return record;
  }
  
  const getSingleProfileDispatch = async () => {
    let list = await engagementCategoryListAction("category/list");
    let value = await getIndividualEmployeeProfileAction('mgr/profile/'+id);
   if(list){
      setProfileLoadingStatus(true);
      let engagementCategories = await engagementCategoriesSort(list,value.categories);
      let FinalProfile = value ? {updateCategories: engagementCategories , ...value} : {updateCategories: engagementCategories}
      dispatch(setIndividualEmployeeProfileData(FinalProfile));
    }
    
  }

  const trendGraphUpdate = async (element) => {
    let url;
    if(element == 'months'){
      url = `mgr/trend/${id}/pulse?type=months`;
    }else if(element == 'years'){
      url = `mgr/trend/${id}/pulse?type=years`;
    }else{
      url = `mgr/trend/${id}/pulse?type=weeks`;
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



  const getUTCTime = (date) => {
    if(!!date){
      var dt = new Date(new Date(date).getTime());
    }else{
      var dt = new Date(new Date().getTime());
      dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
    }
    var utcDate = new Date(dt.getTime());
    return utcDate;
  }

  const getChangeTrackingRecord = async (startDate,endDate,type) => {
   let payload, trackingRecord, getTrackingRecord;
    if(startDate != undefined && endDate != undefined){
      payload = {
        "start_date": startDate,
        "end_date": endDate
      }  
      let record = await getTrackingAction(`mgr/tracking/${id}`, payload);
      if(record){
        if(type == 'old'){
        getTrackingRecord = record.old_records != undefined ? record.old_records : [];
      }else if(type == 'new'){
        getTrackingRecord = record.new_records != undefined ? record.new_records : [];
      }
      if(getTrackingRecord.length > 0){
        trackingRecord = [...changeTracking, ...getTrackingRecord];
        let trackingRecordSort = _.sortBy(trackingRecord, ['score_time'])?.reverse()?.filter(item=>item.code != null);
        dispatch(setChangeTracking(_.uniqBy(trackingRecordSort, 'score_time')))
        }
      if(type == 'old' && getTrackingRecord.length == 0){
        setLoadingStatus(true);
      }
    }
    }
  }
  const [getTrackingTime,setTrackingTime] = useState(0);
  const rerenderChangeTrackingRecords = (type) =>{
    if(changeTracking.length > 0){
     let startDate = changeTracking[0].score_time;
      let endDate = changeTracking[changeTracking.length -1].score_time;
      getChangeTrackingRecord(startDate,endDate,!!type ? 'old' : 'new')
      }else{
      getChangeTrackingRecord(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old');
    }
    }
 
  useEffect(()=>{
   rerenderChangeTrackingRecords()
 },[getTrackingTime])
  useEffect(()=>{
    trendGraphUpdate();
    getSingleProfileDispatch();
    getChangeTrackingRecord(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old');
    const timer = window.setInterval(() => {
      setTrackingTime(prevTime => prevTime + 1);
    }, 60000);
    return ()=> {
      window.clearInterval(timer);
      dispatch(setIndividualEmployeeProfileData(""));
      dispatch(setEmployeeTrendGraph([]))
      dispatch(setChangeTracking([]))
      dispatch(setIndividualEmployeeProfileData([]));
    }
  },[])
  const handlePagination = () =>{
    rerenderChangeTrackingRecords(true)
  }
  return (
    <>
      <div className="rootWrapper">
        <div className="breadcrumb-wrap">
          <h4 onClick={()=> navigate(pathname == `/admin/profile/${id}` ? "/admin-dashboard" : "/manager-dashboard")} className="breadcrumb-title"><FontAwesomeIcon icon={faCircleArrowLeft} />Back to { pathname == `/admin/profile/${id}` ? 'Admin' : 'Manager'} Dashboard</h4>
          <TopBar />
        </div>
        <Container className="rootContainer" >
          
          <Grid>
            <Stack className="topRow" sx={{ display: "grid" }}>
              <Grid item className="topLeft">
                <EmployeeProfile 
                  employeeProfileData={individualEmployeeProfileData} 
                  graphClient={graphClient}
                  loading={profileLoadingStatus}
                  profilePhoto={''}
              />
                {windowSize.innerWidth >= 992 &&
                  <PillarIndicators />
                }                             
              </Grid>
              <Grid item className="topRight">
                <div className="topRight-inner">
                  <Charts handleTrendEvent={(element)=>trendGraphUpdate(element)} />
                  <ChangeTracking 
                  loading={loadingStatus} 
                  hasNextPage={hasNextPage} 
                  error={false} 
                  loadMore={
                      handlePagination
                  }
                  />
                </div>
                {windowSize.innerWidth >= 992 &&
                  <div className="topRight-inner">
                    <ProfileEngagementPillars/>
                    
                  </div>
                }
              </Grid>
            </Stack>
            {windowSize.innerWidth <= 991 &&
              <Stack className="bottomRow">
                {windowSize.innerWidth <= 991 &&
                  <PillarIndicators />
                }
                  <ProfileEngagementPillars/>
               
              </Stack>
            }
          </Grid>
        </Container>
      </div>

    </>
  );
};

export default Profile;
