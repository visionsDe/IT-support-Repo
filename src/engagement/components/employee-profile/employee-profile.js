import React, { useEffect, useState } from 'react';
import './employee-profile.scss';
import Employee from "../employee/employee";
import Box from "@mui/material/Box";
import { useLocation  } from 'react-router-dom'
import { useSelector } from 'react-redux';

const EmployeeProfile = ({employeeProfileData ,graphClient ,getDiscussionList ,profilePhoto, loading = null }) => {
const [profileImage , setProfileImage] = useState("");
const[profileLoading , setProfileLoading] = useState(true);
const { teamsAuthStatus } = useSelector((state) => state.teamsAuthStatus);
const location = useLocation()
  const createProfileBlobImage = async (ms_username) => {
    try{
       if(!!ms_username){
        let result = await graphClient.api(`users/${ms_username}/photo/$value`).get();
        let photo = URL.createObjectURL(result);
        setProfileImage(photo);
      }
    }catch(err){
      setProfileImage(null);
    }
   
  }
useEffect(()=> {
  if(!!employeeProfileData?.ms_username){
    createProfileBlobImage(employeeProfileData?.ms_username)
    setProfileLoading(false)
  }
},[employeeProfileData?.ms_username])

useEffect(()=>{
  if(teamsAuthStatus ==  false){
    createProfileBlobImage(employeeProfileData?.ms_username)
  }
},[teamsAuthStatus])

  return (
    <Box 
    className={`employee_card-wrapper ${(!employeeProfileData?.pulse && employeeProfileData?.pulse == undefined || employeeProfileData?.pulse == null ) ? ' value_none ' : (employeeProfileData?.pulse <= 5 ? "error-card" : "")} `}
    >
      <Employee data={{
        name: !!employeeProfileData ? (employeeProfileData?.name != undefined ? employeeProfileData?.name : ''):"",
        src: !!profileImage ? profileImage : profilePhoto,
        profileImageLoading: profileLoading,
        employeeId: employeeProfileData?.employee_id ,
        jobTitle:  employeeProfileData?.position,
        ms_identifier: employeeProfileData?.ms_identifier,
        manager_ms_username: employeeProfileData?.manager_ms_username,
        ms_username: employeeProfileData?.ms_username,
        settings: {
          min: 0,
          step: 1,
          max: 10,
          disabled: true,
          defaultValue: employeeProfileData?.pulse != null ? employeeProfileData?.pulse : null,
          valueLabelDisplay: "on",
        },
        lastWeekScore: employeeProfileData.previous_pulse,
        currentWeekScore: employeeProfileData.pulse,
        pulse_comment:  employeeProfileData?.pulse_comment,
        pulse_comment_read:  location.pathname == `/admin/profile/${employeeProfileData?.employee_id}`? employeeProfileData?.pulse_comment_read_admin : employeeProfileData?.pulse_comment_read,
        pulse_comment_id:  employeeProfileData?.pulse_comment_id,
        pulse_comment_time: employeeProfileData?.pulse_comment_time
      }}
      graphClient={graphClient}
      getDiscussionList={getDiscussionList}
      />
    </Box>
  )
};

export default EmployeeProfile;
