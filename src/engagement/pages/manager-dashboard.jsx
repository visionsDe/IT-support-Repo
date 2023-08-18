import React, { useEffect, useState } from "react";
import EmployeeGrid from "../components/employee-grid/employee-grid";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Notifications from "../components/notifications/notifications";
import TopBar from "../../commonComponents/top-bar/top-bar";
import { getManagerDownlineListAction } from "../actions/engagement";
import { getManagerDownlineList } from "../reducer/engagementPillars";
import { useDispatch, useSelector } from "react-redux";
import {TeamsFx, createMicrosoftGraphClient} from "@microsoft/teamsfx";
import { getManagerNotificationAction } from "../actions/managerNotification";
import { setManagerNotification } from "../reducer/managerNotificationList";
import * as _ from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { colorPalette } from "../helper/helper";
const ManagerDashboard = () => {
  
  const dispatch =  useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { teamsAuthStatus } = useSelector((state) => state.teamsAuthStatus);
  const teamsfx1 = new TeamsFx();
  const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]); 
  const [getManagerListStatus,setManagerListStatus] = useState(false)
  const [getCardListLoading, setCardListLoading] = useState(false);
  const [getGraphProfile,setGraphProfile] = useState([]);
  const [loadingProgressStatus, setLoadingProgressStatus] = useState(false);
  const getBlobImage = async (value) => {
    try{
      let result = await graphClient.api(`users/${value}/photo/$value`).get();
      if(result != ''){
        return URL.createObjectURL(result);
      }
    }catch(err){
      return null
    }
    return null;
  }
  const managerListDispatch = async () => {
    let value = await getManagerDownlineListAction('mgr/downline');
    if(value){
      return value;
    }else{
      let variant = 'error';
      enqueueSnackbar('Error: Session Expired', {variant});
      navigate("/login");
    }
  }

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { managerNotification } = useSelector(state => state.managerNotification);

  const getUTCTime = (date) => {
    if(!!date){
      var dt = new Date(new Date(date).getTime());
    }else{
      var dt = new Date(new Date().getTime());
      dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
    }
    // var offset = -300; // Timezone offset for EST in minutes.
    var utcDate = new Date(dt.getTime());
    return utcDate;
  }


  const getManagerNotification = async (startDate,endDate,type) => {
    try{
      let payload, notificationRecord, getNotificationRecord;
      if(startDate != undefined && endDate != undefined){
        payload = {
          "start_date": startDate,
          "end_date": endDate
        }  
        let record = await getManagerNotificationAction(`mgr/notification`, payload);
        if(type == 'old'){
          getNotificationRecord = record.old_records != undefined ? record.old_records : [];
        }else if(type == 'new'){
          getNotificationRecord = record.new_records != undefined ? record.new_records : [];
        }
        if(getNotificationRecord.length > 0){
          notificationRecord = [...managerNotification, ...getNotificationRecord]
          let updateNotificationRecord = _.sortBy(notificationRecord, ['created_at'])?.reverse();
          setLoadingStatus(true);
          setLoadingProgressStatus(false);
          await dispatch(setManagerNotification(_.uniqBy(updateNotificationRecord, 'created_at')))
        }else{
          setLoadingStatus(true);
          setLoadingProgressStatus(false);
        }
     }
    }catch(err){
      // console.log("Error : "+err.message)
    }
    
  }

  
  const reRenderManagerNotificationRecords = (type) =>{
    if(managerNotification.length > 0){
      let startDate = managerNotification[0].created_at;
      let endDate = managerNotification[managerNotification.length -1].created_at;
      let notificationType = !!type ? 'old' : 'new';
      getManagerNotification(startDate,endDate,notificationType)
    }else{
      getManagerNotification(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old');
    }
  }
  useEffect(()=>{ setLoadingStatus(false);},[managerNotification])
  const handlePagination = (element) =>{
    setLoadingStatus(true);
    setLoadingProgressStatus(true);
    if(teamsAuthStatus ==  false && getManagerListStatus ==  true){
      if(element != 'new'){
        reRenderManagerNotificationRecords(true)
      }else{
        reRenderManagerNotificationRecords();
      }
    }
  }
const teamsStatusAfterExecution = async () => {
  setCardListLoading(true);
    let value = await managerListDispatch();
    if(value && value?.length > 0){
      for(let index in value){
        if(!!value[index].ms_username){
          value[index].src = await getBlobImage(value[index].ms_username);
          value[index].colorPalette = colorPalette[index % colorPalette?.length]?.name
        }
        else{
          value[index].src=null;
          value[index].colorPalette = colorPalette[index % colorPalette?.length]?.name
        }
      }
      await dispatch(getManagerDownlineList(value));
    }

    setManagerListStatus(true)
    setCardListLoading(false)
    getManagerNotification(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old')
}
useEffect(()=>{
  setManagerListStatus(false)
  if(teamsAuthStatus ==  false){
    teamsStatusAfterExecution()
  }
},[teamsAuthStatus])
  return (
    <>
    <div className="rootWrapper">
      <div className="breadcrumb-wrap">
        <TopBar />
      </div>
      <Container maxWidth="auto" className="rootContainer rootManager" sx={{overflowY:'hidden'}}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6} className="bg-white" >
            <EmployeeGrid 
              title="Employee Responses: How I feel about my work this week?"
              loading={getCardListLoading}
              graphProfile={getGraphProfile}
               />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Notifications
             managerList={getManagerListStatus}
             loading={loadingStatus} 
             hasNextPage={hasNextPage} 
             error={hasError} 
             loadMore={handlePagination}
             loadingBarStatus={loadingProgressStatus}
             graphProfile={getGraphProfile}
             />
          </Grid>
        </Grid>
      </Container>
    </div>

    </>
  );
};

export default ManagerDashboard;
