import React, { useEffect, useState } from "react";
import "./employee-grid.scss";
import {Card ,Box ,Grid ,CardHeader ,Skeleton, LinearProgress} from "@mui/material";
import "./../../../main.scss";
import Employee from "../employee/employee";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useInfiniteScroll from 'react-infinite-scroll-hook';
const EmployeeGrid = ({loading,hasNextPage, loadMore, hasAdmin, children, title , error, pageLoader}) => {
  const {ManagerDownlineList} = useSelector((state) => state.engagementCategory);
  const { adminEmployeesCardList } = useSelector((state) => state.adminEmployeesCardList);
  const [getDownlineList,setDownlineList] = useState([]);
  const { pathname } = useLocation();
  const { graphProfileUrl } = useSelector((state) => state.graphProfileUrl);
useEffect(()=>{
  if(pathname === '/manager-dashboard'){
    if(Array.isArray(ManagerDownlineList)){
      setDownlineList(ManagerDownlineList);
    }
  }
},[ManagerDownlineList]);

useEffect(()=>{
  if(pathname === '/admin-dashboard'){
    if(Array.isArray(adminEmployeesCardList)){
      setDownlineList(adminEmployeesCardList);
    }
    
  }
},[adminEmployeesCardList]);




const [cardListLoadRef, { rootRef }] = useInfiniteScroll({
  pageLoader,
  hasNextPage,
  onLoadMore: loadMore,
  disabled: !!error,
  rootMargin: '0px 0px 400px 0px',
});

  return(
  <Card
    className="employee-grid-wrapper"
    sx={{
      boxShadow: "0px 0px 6px rgb(0 0 0 / 10%)",
      borderRadius: "10px",
      textAlign: "center",
      height: "100%",
    }}
  >
        <div >
          {/* <CardHeader title={"Employee Responses: How I feel about my work this week?"} /> */}
          <div className={hasAdmin ? "admin_tab-active" : ""}>
            <CardHeader title={title} />
            <div className="admin_filtersWrap">
              {children}
            </div>
          </div>
          <Grid container columnSpacing={{ xs: 3, sm: 3, lg: 2, xl:3 }} rowSpacing={2} className={`employee-List ${getDownlineList?.length == 0  && 'no-employee'} ${ loading == false && 'loading'}`}>
            {getDownlineList?.length > 0 ?
            getDownlineList?.map((card, index) => {
              const currentWeekPulse = !!card.current_pulse ? card.current_pulse : null;
              const previousWeekPulse = !!card.previous_pulse ? card.previous_pulse : null;
             return (
                <Grid item xs={12} sm={4} md={3} lg={4} xl={3} className="employeeWrap" key={index}>
                  <Box
                    className={
                      (currentWeekPulse <= 5 && currentWeekPulse != null)
                        ? "employeeCard error"
                        : "employeeCard"
                    }
                  >
                    {/* ms - {card?.ms_username} */}
                    <Employee
                      data={{
                        name: card.name,
                        employeeId: card?.employee_id,
                        colorPalette:card?.colorPalette,
                        src: card.src,
                        ms_identifier: card.ms_identifier,
                        ms_username: card.ms_username,
                        settings: {
                          min: 0,
                          step: 1,
                          max: 10,
                          disabled: true,
                          defaultValue: currentWeekPulse,
                          valueLabelDisplay: "on",
                          color:'#fb9527',
                        },
                        lastWeekScore: previousWeekPulse,
                        jobTitle: card.position,
                        currentWeekScore: currentWeekPulse,
                      }}
                      
                    />
                  </Box>
                </Grid>
              );
            }):
            <>
                {
                (loading == false && getDownlineList.length == 0) ? 
                  <div className="notEnoughData ">No Employees</div>
                  : [1,2,3,4,5,6,7,8].map((item,index) => 
                  <Grid item xs={12} sm={4} md={3} lg={4} xl={3} className="employeeWrap" key={index}>
                    <Skeleton variant="rectangular" sx={{ borderRadius: "10px" }} width={"100%"} height={"350px"} />
                  </Grid>
                )
              }
            </>
          }
          {(
            pathname === '/admin-dashboard'
            && pageLoader == true
            && getDownlineList?.length > 1
            && hasNextPage == true
            ) && <Grid item xs={12} sm={12} md={12} lg={12} xl={12} ref={cardListLoadRef} ><LinearProgress /></Grid>}
          </Grid>
        </div>
  </Card>
)
  };

export default EmployeeGrid;
