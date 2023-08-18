import React, { useEffect, useState } from "react";
import MultiSelect ,{ createFilter } from 'react-select';
import { useFormik } from 'formik';
import EmployeeGrid from "../components/employee-grid/employee-grid";
import {Container,Autocomplete,Grid,TextField, Button} from "@mui/material";
import Notifications from "../components/notifications/notifications";
import TopBar from "../../commonComponents/top-bar/top-bar";
import { getManagerDownlineListAction } from "../actions/engagement";
import { getManagerDownlineList } from "../reducer/engagementPillars";
import { setAdminEmployeesCardList } from "../reducer/adminEmployeesList";
import { useDispatch, useSelector } from "react-redux";
import {TeamsFx, createMicrosoftGraphClient} from "@microsoft/teamsfx";
import { getManagerNotificationAction } from "../actions/managerNotification";
import { setAdminNotification } from "../reducer/adminNotificationList";
import { setGraphProfileUrl } from "../reducer/graphProfileUrl";
import * as _ from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import SortFilter from "../sort/Sort";
import PulseFilter from "../pulseFilter/pulseFilter";
import { Formik } from "formik";
import Select, { components, ControlProps } from 'react-select';
import './admin-dashboard.scss';
import { colorPalette } from "../helper/helper";

import { adminDashboardFilterByAction, adminDashboardEmployeeListAction, employeeCardFilterListAction, adminDashboardEmployeeGetAction } from "../actions/adminDashboard";

const filterByData = [
  {"name":"Manager","value":"managers/1"},
  {"name":"Position","value":"position"},
  {"name":"Department","value":"department"},
  {"name":"Division","value":"division"},
  {"name":"Location","value":"location"}
];
const sortDataList = [
  {"name":"Pulse Rating (newest to oldest)","value":"pulse_time/desc"},
  {"name":"Pulse Rating (oldest to newest)","value":"pulse_time/asc"},
  {"name":"Employee Name (A-Z)","value":"name/asc"},
  {"name":"Employee Name (Z-A)","value":"name/desc"},
  {"name":"Pulse Rating (lowest to highest)","value":"pulse/asc"},
  {"name":"Pulse Rating (highest to lowest)","value":"pulse/desc"}
];



const AdminDashboard = () => {
  const dispatch =  useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { teamsAuthStatus } = useSelector((state) => state.teamsAuthStatus);
  const teamsfx1 = new TeamsFx();
  const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]); 
  const [getAdminListStatus,setAdminListStatus] = useState(false)
  const [getGraphProfile,setGraphProfile] = React.useState([]);
  const { graphProfileUrl } = useSelector((state) => state.graphProfileUrl);
  const [age, setAge] = React.useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [notificationHasNextPage, setNotificationHasNextPage] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [getNotificationMsUser, setNotificationMsUser] = useState([]);
  const [getCardListMsUser, setCardListMsUser] = useState([]);
  const [getLocalBlobState, setLocalBlobState] = useState([]);
  const { adminNotification } = useSelector(state => state.adminNotification);
  const [filterByLoadingStatus,setFilterByLoadingStatus] = useState(false);
  const [getEmployeeCardLoadingStatus,setEmployeeCardLoadingStatus] = useState(false);
  const [employeeListLoadingStatus,setEmployeeListLoadingStatus] = useState(false);
  const [getFilterByList,setFilterByList] = useState([]);
  const [getSelectedFilter, setSelectedFilter] = useState({});
  const [getEmployeeCardList, setEmployeeCardList] = useState([]);
  const [getSelectedSortBy, setSelectedSortBy] = useState("pulse_time/desc");
  const [getEmployeeList, setEmployeeList] = useState([]);
  const [getSelectedEmployeeItem, setSelectedEmployeeItem] = useState("");
  const [cardHasNextPage, setCardHasNextPage] = useState(true);
  const [hasCardError, setHasCardError] = useState(false);
  const [getCardPageLoadingStatus, setCardPageLoadingStatus] = useState(false);
  const { adminEmployeesCardList } = useSelector((state) => state.adminEmployeesCardList);
  const [getActiveType,setActiveType] = useState(null)
  const [getActiveTypeFilter,setActiveTypeFilter] = useState(null)
  const [getFilterPayload,setFilterPayload] = useState([]);
  const [getSelectedEmployee, setSelectedEmployee] = useState("");
  const [selectEmployee, setSelectEmployee] = useState({ value: "", label: "All Employees" });
  const [getClearFilterEvent,setClearFilterEvent] = useState(false);
  const [loadingProgressStatus, setLoadingProgressStatus] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const getBlobImage = async (value) => {
    try{
      let result = await graphClient.api(`users/${value}/photo/$value`).get();
      if(result != ''){
        return URL.createObjectURL(result);
      }else{
        return null
      }
    }catch(err){
      return null
    }
  }
  const listDispatch = async (element,page,payload = [], selectedSortBy = null) => {
    try{
      let sort = selectedSortBy != null ? selectedSortBy : getSelectedSortBy;
      let value = await employeeCardFilterListAction(`admin/filter/${element}/${sort}/${page}`,payload);
      if(value && Array.isArray(value)){
        return value;
      }else if(value){
        // let variant = 'error';
        // enqueueSnackbar('Error: Response error : '+value, {variant});
        return [];
      }
      else{
        let variant = 'error';
        enqueueSnackbar('Error: Session Expired', {variant});
        navigate("/login");
      }
    }catch(error){
      let variant = 'error';
      enqueueSnackbar('Error: Response error : '+error.message, {variant});
      return [];
    }
  }

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

  const convertGraphImageToBlob = async (items) => {
    let values = items?.map(async (item,index) => {
    let indexColor = index % colorPalette?.length;
    let sourceImage = (item?.ms_username != undefined && item?.ms_username != "" && item?.ms_username != null) ?  await getBlobImage(item?.ms_username) : null;
      return {...item, "src" : sourceImage,"colorPalette":colorPalette[indexColor]?.name}
    });
      return Promise.all(values);
  }
  

  const storeGraphImage = async (data, oldProfiles = null) => {
    let copyGraphProfile = oldProfiles != null ? [...oldProfiles] : [...getGraphProfile];
    let filterEmployeeId = copyGraphProfile.map(item => item.employee_id);
    let recordForGraphCall = data.filter(item => filterEmployeeId.indexOf(item.employee_id) == -1);
    let graphAPICall = await convertGraphImageToBlob(recordForGraphCall);
    let mergedRecords = [...copyGraphProfile,...graphAPICall];
    await dispatch(setGraphProfileUrl(mergedRecords));
    return mergedRecords;
  }

  useEffect(() => {
    if(graphProfileUrl != null && graphProfileUrl?.length > 0){
      setGraphProfile([...graphProfileUrl])
    }
  },[graphProfileUrl]);

  const getAdminNotification = async (startDate,endDate,type, oldGraphProfile = null) => {
    try{
      let payload, notificationRecord, getNotificationRecord;
      if(startDate != undefined && endDate != undefined){
        payload = {
          "start_date": startDate,
          "end_date": endDate
        }  
        let record = await getManagerNotificationAction(`admin/notification`, payload);
        if(type == 'old'){
          getNotificationRecord = record.old_records != undefined ? record.old_records : [];
        }else if(type == 'new'){
          getNotificationRecord = record.new_records != undefined ? record.new_records : [];
        }
        if(getNotificationRecord.length > 0){
          notificationRecord = [...adminNotification, ...getNotificationRecord]
          let notificationRecordUpdate = _.sortBy(notificationRecord, ['created_at'])?.reverse();
          let uniqueNotificationRecord = _.uniqBy(notificationRecordUpdate, 'created_at');
            // =========== Update getNotificationMsUser State start ===========
            let unique = {};
            // let getAllUserInfo = uniqueNotificationRecord?.map(item => item?.user_info)?.filter(item=>item?.user_info?.ms_username != '')?.filter(obj => !unique[obj.ms_username] && (unique[obj.ms_username] = true));
            let getAllUserInfo = uniqueNotificationRecord?.map(item => item?.user_info)?.filter(object => !unique[object.ms_username] && (unique[object.ms_username] = true));
            let updatedUserInfo = getAllUserInfo?.map((item) => {return {"employee_id":item.employee_id,"name":item.name,"ms_username":item.ms_username}});
            // setNotificationMsUser(updatedUserInfo);
           
            
            // =========== Update getNotificationMsUser State end ===========
          setLoadingStatus(false);
          setLoadingProgressStatus(false);
          await dispatch(setAdminNotification(uniqueNotificationRecord))

          let reduxData = await storeGraphImage(updatedUserInfo, oldGraphProfile);
        }
     }
    //  setLoadingStatus(false);
    //  return Promise.all(true);
    }catch(err){
      // console.log("Error : "+err.message)
    }
  }

  // console.log('pagination loading status ', loadingStatus ? 'true' : 'false')
  // useEffect(()=>{
  //   setLoadingStatus(false);
  //   return setLoadingStatus(true);
  // },[])
  const reRenderAdminNotificationRecords = (type) =>{
    if(adminNotification.length > 0){
      
      let startDate = adminNotification[0].created_at;
      let endDate = adminNotification[adminNotification.length -1].created_at;
      let notificationType = !!type ? 'old' : 'new';
      getAdminNotification(startDate,endDate,notificationType)
      // setLoadingStatus(false);
    }else{
      // setLoadingStatus(true);
      getAdminNotification(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old');
      // setLoadingStatus(false);
    }
  }

  // useEffect(()=>{ setLoadingStatus(false);},[adminNotification]);

  const handlePagination = (type) =>{
    // console.log('pagination running ', type);
    setLoadingStatus(true);
    setLoadingProgressStatus(true);
    if(teamsAuthStatus ==  false && getAdminListStatus ==  true){
      if(type != 'new'){
        reRenderAdminNotificationRecords(true);
      }else{
        reRenderAdminNotificationRecords();
      }
    }
  }
const teamsStatusAfterExecution = async (type,page, payload = null, selectedSortBy = null) => {
  if(type != null){
    let graphProfiles = [];
    setEmployeeCardLoadingStatus(true);
    setCardPageLoadingStatus(true);
    let getPayload = payload != null ? payload : getFilterPayload;
    let cardListRecord = await listDispatch(type,page,getPayload, selectedSortBy);
    if(cardListRecord && cardListRecord?.length > 0){
      let updateRecords = [];
      if(adminEmployeesCardList?.length > 0){
        if(page == 1 && setFilterPayload?.length > 0){
          updateRecords = cardListRecord;
        }else{
          updateRecords = [...adminEmployeesCardList, ...cardListRecord];
        }
      }else{
        updateRecords = cardListRecord;
      }      
      await dispatch(setAdminEmployeesCardList(updateRecords));  
      // =========== Update getCardListMsUser State start ===========
      
        let unique = {};
        // let getFilteredDownlineList = updateRecords?.filter(item=>item.ms_username != '')?.filter(obj => !unique[obj.ms_username] && (unique[obj.ms_username] = true));
        let getFilteredDownlineList = updateRecords?.filter(object => !unique[object.employee_id] && (unique[object.employee_id] = true));
        let updatedDownlineList = getFilteredDownlineList?.map((item) => {return {"employee_id":item.employee_id,"name":item.name,"ms_username":item.ms_username}});
        setCardListMsUser(updatedDownlineList);
        
        graphProfiles = await storeGraphImage(updatedDownlineList);
        if(((updateRecords?.length) % 8) === 0){
          setCardHasNextPage(true);
          setCardPageLoadingStatus(true);
        }else{
          setCardHasNextPage(false);
          setCardPageLoadingStatus(false);
        }
    }else{
      if(page == 1){
        await dispatch(setAdminEmployeesCardList([]));
      }
      // await dispatch(setAdminEmployeesCardList([]));
      if(page == 1 && getFilterPayload?.length > 0){
       
        setCardHasNextPage(false);
        setCardPageLoadingStatus(false);
        setEmployeeCardLoadingStatus(false);
      }else{
          setCardHasNextPage(false);
          setCardPageLoadingStatus(false);
          setEmployeeCardLoadingStatus(false);
      }
     
    }
    setAdminListStatus(true);
    if(type == 'none' && page == 1){
      getAdminNotification(moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),moment(getUTCTime()).format('YYYY-MM-DD HH:mm:ss'),'old', graphProfiles)
    }
  }
  return true;
}

const updateEmployeeListDropDown = async () => {
  setEmployeeListLoadingStatus(true);
    let getEmployeeListData = await adminDashboardEmployeeListAction('admin/employees');
    if(getEmployeeListData?.length > 0){
      setEmployeeList(getEmployeeListData)
    }
  setEmployeeListLoadingStatus(false);
}

const reloadGraphPhotos = async () => {
  let copyGraphProfile = [...getGraphProfile];
    let recordForGraphCall = copyGraphProfile?.filter(object => object?.src == undefined || object?.src == null);
    let existingGraphImage = copyGraphProfile?.filter(object => object?.src != null);
    let graphAPICall = await convertGraphImageToBlob(recordForGraphCall);
    let mergedRecords = [...existingGraphImage,...graphAPICall];
    dispatch(setGraphProfileUrl(mergedRecords))
    return true;
}
useEffect(()=>{
  setAdminListStatus(false);
  if(teamsAuthStatus ==  false && adminEmployeesCardList?.length == 0 && Object.keys(getSelectedFilter || {})?.length == 0){
    teamsStatusAfterExecution('none',1);
    updateEmployeeListDropDown();
    reloadGraphPhotos();
  }else if(teamsAuthStatus ==  false){
    updateEmployeeListDropDown();
    reloadGraphPhotos();
  }
},[teamsAuthStatus])

useEffect(()=>{
  
    setAdminListStatus(false);
    teamsStatusAfterExecution('none',1);
    updateEmployeeListDropDown();
    return ()=>{
      dispatch(setAdminEmployeesCardList([]));
    }
},[])



  const handleFilterByRecord = async (element) => {
    setFilterByLoadingStatus(true);
    // setActiveType(element);
    // setActiveType(null);
    // setSelectedFilter({});
    // setSelectedSortBy("pulse_time/desc")
    
    let filterByList = [];
    let valueCheck = filterByData?.find(item=>item.value == element);
    if(Object.keys(valueCheck || {})?.length > 0){
      filterByList = await adminDashboardFilterByAction(`admin/options/${element}`);
      if(filterByList?.length > 0){
        setFilterByList(filterByList)
      }
    }else{
      setFilterByList([])
    }   
    setFilterByLoadingStatus(false);
    return filterByList;
  }
  const handleSelectFilterBy = async (type = null,element) => {
    // console.log('get select type ', getActiveType)
    let payload = Object.keys(element)?.filter(key => element[key] == true);
    setFilterPayload(payload);
    if(getSelectedEmployee == ""){
      // console.log('getActiveType ', getActiveType)
      let typeGet = type != null ? (type === 'managers/1' ? 'downline' : type) : (getActiveType === 'managers/1' ? 'downline' : getActiveType)
      teamsStatusAfterExecution(payload.length > 0 ? typeGet : 'none',1,payload);
    }
  }
  const handleCardPagination = async () => {
    if(getSelectedEmployee == ""){
      let pageNumber = Math.floor(adminEmployeesCardList?.length / 8);
      let pageType = getActiveType != null && getActiveType != '' ? (getActiveType === 'managers/1' ? 'downline' : getActiveType) : 'none';
      // console.log('pageType ', pageType, getActiveType)
      // let pageType = getActiveType != null && getActiveType != '' && getFilterPayload?.length > 0 ? (getActiveType === 'managers/1' ? 'downline' : getActiveType) : 'none';
      await teamsStatusAfterExecution(pageType,pageNumber+1);
    }
    
  }

  const handleClearAllFilter = async () => {
    try{
      // setEmployeeCardLoadingStatus(true);
      await dispatch(setAdminEmployeesCardList([]));
      setSelectEmployee({ value: "", label: "All Employees" });
      setSelectedEmployee("");
      setActiveType(null);
      setClearFilterEvent(true);

      setSelectedSortBy("pulse_time/desc")
      
      await teamsStatusAfterExecution('none',1, null, "pulse_time/desc");
      setClearFilterEvent(false);
      // setEmployeeCardLoadingStatus(false);
    }catch(error){
      
    }
  }
  const handleSelectEmployeeEvent = async (element) => {
    try{
      if(element != null && element?.value != undefined && element.value != ""){
        setEmployeeCardLoadingStatus(true);
        let getRecord = await adminDashboardEmployeeGetAction(`admin/card/${element?.value}`);
        await dispatch(setAdminEmployeesCardList([getRecord]));
        // =========== Update getCardListMsUser State start ===========
        let unique = {};
        // let getFilteredDownlineList = [getRecord]?.filter(item=>item.ms_username != '')?.filter(obj => !unique[obj.ms_username] && (unique[obj.ms_username] = true));
        let getFilteredDownlineList = [getRecord]?.filter(object => !unique[object.employee_id] && (unique[object.employee_id] = true));
        let updatedDownlineList = getFilteredDownlineList?.map((item) => {return {"employee_id":item.employee_id,"name":item.name,"ms_username":item.ms_username}});
        setCardListMsUser(updatedDownlineList);
        let reduxData = await storeGraphImage(updatedDownlineList);
        setEmployeeCardLoadingStatus(false);
        setCardHasNextPage(false);
        setCardPageLoadingStatus(false);
        setSelectedEmployee(element?.value);
      }else{
        setSelectedEmployee("");
        let pageType = getActiveType != null && getActiveType != '' ? (getActiveType === 'managers/1' ? 'downline' : getActiveType) : 'none';
        teamsStatusAfterExecution(pageType,1);
      }
    }
    catch(error){
      let variant = 'error';
      enqueueSnackbar(`Error: ${error.message}`, {variant});
    }
  }

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
              title={`Weekly Pulse Responses:`}
              hasAdmin="true" 
              loading={getEmployeeCardLoadingStatus}
              pageLoader={getCardPageLoadingStatus}
              hasNextPage={cardHasNextPage} 
              error={hasCardError} 
              loadMore={handleCardPagination}
            >
            <Button  
              variant="text" 
              sx={{marginTop:"10px", maxWidth:"155px"}} 
              className='btn-text clear'
              onClick={handleClearAllFilter}
            >
              Clear
            </Button>
            <PulseFilter
              disabledCheck={selectEmployee?.value == "" ? true : false}
              data={filterByData}
              selected={getSelectedFilter}
              // active={getActiveType}
              handleOnChange={(element)=>{
                handleFilterByRecord(element)
              }}
              loading={filterByLoadingStatus}
              filterList={getFilterByList}
              handleFilterChange={(type,element)=>{
                // console.log('type ', type)
                setActiveType(type);
                // console.log('getSelectedEmployee ',getSelectedEmployee)
                if(getSelectedEmployee == ""){
                  dispatch(setAdminEmployeesCardList([]));
                }
                setSelectedFilter({...element});
                handleSelectFilterBy(type,element)
              }}
              clearEvent={getClearFilterEvent}
            />
            <SortFilter 
              disabledCheck={selectEmployee?.value == "" ? true : false}
              selected={async (element)=>{
                if(element != null){
                  setSelectedSortBy(element);
                  if(getSelectedEmployee == ""){
                    await dispatch(setAdminEmployeesCardList([]));
                    teamsStatusAfterExecution(Object.keys(getFilterPayload)?.length > 0 ? (getActiveType === 'managers/1' ? 'downline' : getActiveType) : 'none',1,null,element);
                  }
                }
              }} 
              data={sortDataList}
              defaultSelect={getSelectedSortBy}
            />
              <Select
                disabled={employeeListLoadingStatus}
                value={selectEmployee}
                // defaultValue={selectEmployee}
                isSearchable
                options={
                  [{ value: "", label: "All Employees" },...getEmployeeList.map((item) => {
                    // return { value: item.employee_id, label: item.name.split(',').reverse().join(', ') }
                    return { value: item.employee_id, label: item.name }
                  })]
                }
                onChange={(element,value)=>{
                  setSelectEmployee(element)
                  dispatch(setAdminEmployeesCardList([]));
                  handleSelectEmployeeEvent(element);
                }}
                classNamePrefix="cMultiSelect"
              />
            {/* <Autocomplete
            disablePortal
            disabled={employeeListLoadingStatus}
            id="combo-box-demo"
            className="autoCompleteDropdown"
            options={ 
              [{ value: "", label: "All Employees" },...getEmployeeList.map((item) => {
                return { value: item.employee_id, label: item.name }
              })]
            }
            defaultValue={{ value: "", label: "All Employees" }}
            renderInput={(params) => <TextField {...params} label="" />}
            disableClearable={true}
            onChange={(element,value)=>{
              dispatch(setAdminEmployeesCardList([]));
              handleSelectEmployeeEvent(value);
            }}
            ListboxProps={{
              className: "myCustomList"
            }}
          /> */}

        </EmployeeGrid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Notifications
             managerList={getAdminListStatus}
             loading={loadingStatus} 
             hasNextPage={notificationHasNextPage} 
             error={hasError} 
             loadMore={(e)=>handlePagination(e)}
             loadingBarStatus={loadingProgressStatus}
             />
          </Grid>
        </Grid>
      </Container>
    </div>

    </>
  );
};

export default AdminDashboard;
