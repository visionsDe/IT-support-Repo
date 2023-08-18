import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Grid, Skeleton } from "@mui/material";
import TargetCards from "./targetCards/TargetCards";
import TargetDescription from "./targetDescription/TargetDescription";
import "./ShowTargets.scss";
import { useRef } from "react";
import MenuList from "../recognitionAssets/CustomSelectList";
import MultiSelect, { createFilter } from "react-select";
import employee1 from "../../commonAssets/images/employee1.jpg";
import { setTeamsTargetList } from "./reducer/showTargetReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  utilsRecognitionGetTargetCardList,
  utilsRecognitionDeleteTargetCardItem,
  utilsRecognitionAddEmployeeTargetCardItem,
  utilsRecognitionUpdateValuesTargetCardItem,
  utilsConvertGraphImageToBlob
} from "../utils";
import "./targetCards/TargetCards.scss";
import { useSnackbar } from "notistack";
import moment from "moment";
import recognitionSendRequestAction, { recognitionGetRequestAction } from "../actions/recognitionRequestAction";

import { setGraphProfileUrl } from "../../engagement/reducer/graphProfileUrl";
import { useLocation } from "react-router-dom";

function ShowTargets({ updateCardListEvent, targetListLoading }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const { employeeList } = useSelector((state) => state.recognitionDashboard);
  const [getEmployeeList, setEmployeeList] = useState([]);
  const { graphProfileUrl } = useSelector((state) => state.graphProfileUrl);

  const ref = useRef(null);


  const handleShow = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [managerRole, setManagerRole] = useState("");

  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [getTargetDescriptionID, setTargetDescriptionID] = useState(null);

  const [newTargetID, setNewTargetID] = useState(null);
  const dispatch = useDispatch();


  const { teamsTargetList } = useSelector((state) => state.targetCardList);
  const updateEmployeeList = async () => {
    if (pathname == '/recognition/manager-dashboard') {
      let downlineGet = await recognitionGetRequestAction('mgr/downline');
      if (downlineGet) {
        setEmployeeList(downlineGet)
      }
    }
  }
  useEffect(() => {
    updateCardListEvent();
    updateEmployeeList();
  }, []);

  const storeGraphImage = async (data, oldProfiles = null) => {
    let copyGraphProfile = oldProfiles != null ? [...oldProfiles] : [...graphProfileUrl];
    let filterEmployeeId = copyGraphProfile.map(item => item.employee_id);
    let recordForGraphCall = data.filter(item => filterEmployeeId.indexOf(item.employee_id) == -1);
    let graphAPICall = await utilsConvertGraphImageToBlob(recordForGraphCall);
    let mergedRecords = [...copyGraphProfile, ...graphAPICall];
    await dispatch(setGraphProfileUrl(mergedRecords));
    return mergedRecords;
  }
  const updateTeamsTargetListImage = async () => {
    storeGraphImage(
      teamsTargetList?.map(item => item?.assigned_employees)?.flat(1)?.map((item) => {
        return {
          "employee_id": item.employee_id,
          "name": item.full_name,
          "ms_username": item.ms_username
        }
      }),
      graphProfileUrl
    );
  }
  useEffect(() => {
    // setTargetList(teamsTargetList)
    updateTeamsTargetListImage();
  }, [teamsTargetList])

  const addNewEmployeeToTargetList = async (employee_id, item) => {
    try {
      let payload = {
        employee_ids: [employee_id],
        name: item?.name,
        description: item?.description,
        points: item?.points,
        due_date: moment(item?.due_date).format("DD-MM-YYYY"),
      };
      let addNewEmployee = await utilsRecognitionAddEmployeeTargetCardItem(
        payload,
        item?.target_id
      );
      if (addNewEmployee.status.toLowerCase() !== "") {
        let variant = "success";
        enqueueSnackbar("Target employee added", { variant });
        updateCardListEvent();
        updateTeamsTargetListImage();
      } else {
        let variant = "error";
        enqueueSnackbar("Error: employee not added", { variant });
      }
    } catch (error) { }
  };

  const updateNewValueToTarget = async (data) => {
    let payload = {
      name: data?.name,
      description: data?.description,
      points: data?.points,
      due_date: moment(data?.due_date).format("DD-MM-YYYY"),
    };
    let sendUpdatedTarget = await utilsRecognitionUpdateValuesTargetCardItem(
      data?.target_id,
      payload
    );
    if (sendUpdatedTarget) {
      let variant = "success";
      enqueueSnackbar("Target Updated", { variant });
      updateCardListEvent();
    }
  };

  const deleteTeamsTargetList = async (data) => {
    try {
      let deleteTargetRecord = await utilsRecognitionDeleteTargetCardItem(data);
      if (deleteTargetRecord && deleteTargetRecord?.status.toLowerCase() !== "") {
        let variant = "success";
        enqueueSnackbar("Target Deleted", { variant });
        updateCardListEvent();
      } else {
        let variant = "error";
        enqueueSnackbar("Error: Target not delete", { variant });
      }
    } catch (error) {
      let variant = "error";
      enqueueSnackbar("Error: " + error?.message, { variant });
    }
  };

  const handleTargetCommentSubmission = async (data, target_id) => {
    let payload = {
      "comment": data?.comment
    }
    let submitTargetComment = await recognitionSendRequestAction(`recmodule/targetcomment/${target_id}`, payload, 'true');
    if (submitTargetComment) {
      let variant = "success";
      enqueueSnackbar("Target comment submitted", { variant });
      setNewTargetID({ ...data, "comment_id": submitTargetComment?.comment_id })
    } else {
      let variant = "error";
      enqueueSnackbar("Target comment not submitted", { variant });
    }
  }
  const handleSetProgressSubmit = async (target_id, value) => {
    let submitTargetProgress = await recognitionSendRequestAction(`recmodule/targetprogress/${target_id}/${value}`);
    if (submitTargetProgress?.status?.toLowerCase() == 'ok') {
      let variant = "success";
      enqueueSnackbar("Target progress submitted", { variant });
    } else {
      let variant = "error";
      enqueueSnackbar("Target progress not submitted", { variant });
    }
    updateCardListEvent();
    handleTargetCommentHistoryGetEvent(target_id);
  }
  const handleTargetApproveEvent = async (employee_id, target_id) => {
    let payload = {
      "employee_id": employee_id
    }
    let submitTargetApproveStatus = await recognitionSendRequestAction(`recmodule/targetapprove/${target_id}`, payload);
    if (submitTargetApproveStatus?.status?.toLowerCase() == 'ok') {
      let variant = "success";
      enqueueSnackbar("Target approved", { variant });
    } else if (submitTargetApproveStatus?.status?.toLowerCase() == 'error') {
      let variant = "error";
      enqueueSnackbar("Error : " + submitTargetApproveStatus?.comment, { variant });
    } else {
      let variant = "error";
      enqueueSnackbar("Target not approved ", { variant });
    }
    updateCardListEvent();
  }

  const handleTargetCommentHistoryGetEvent = async (data) => {
    let targetCommentHistory = await recognitionGetRequestAction(`recmodule/targetcomments/${data}`);
    let getComment = [];
    if (targetCommentHistory) {
      getComment = targetCommentHistory[0]?.comments;
    }
    let targetCommentList = teamsTargetList?.map(item => { return item?.target_id == data ? { ...item, "comments": getComment } : { ...item } })
    dispatch(setTeamsTargetList(targetCommentList));
  }

  const handleCommentUpdateSubmitEvent = async (comment, comment_id, target_id) => {
    let payload = { "comment": comment }
    let targetCommentUpdate = await recognitionSendRequestAction(`recmodule/targetcommentupdate/${target_id}/${comment_id}`, payload);
    let getComment = [];
    let variant = "";
    let returnMessage = "";
    let previousComment = teamsTargetList?.find(item => item?.target_id == target_id)?.comments;
    if (targetCommentUpdate?.status?.toLowerCase() == 'ok') {
      getComment = previousComment?.map(item => { return item?.comment_id == comment_id ? { ...item, "comment": comment } : { ...item } });
      variant = "success";
      returnMessage = "Comment updated";
    } else {
      getComment = previousComment;
      variant = "error";
      returnMessage = "Error: Comment not saved";
      let targetCommentList = teamsTargetList?.map(item => { return item?.target_id == target_id ? { ...item, "comments": getComment } : { ...item } });
      dispatch(setTeamsTargetList(targetCommentList));
    }
    enqueueSnackbar(returnMessage, { variant });
  }

  const deleteTeamsTargetEmployee = async (employee_id, target_id) => {
    let deleteAssignedEmployee = await recognitionSendRequestAction(`recmodule/targetemployeeremove/${target_id}/${employee_id}`);
    if (deleteAssignedEmployee?.Status?.toLowerCase() == 'ok') {
      let variant = "success";
      enqueueSnackbar("Employee removed", { variant });
    } else if (deleteAssignedEmployee?.Status?.toLowerCase() == 'error') {
      let variant = "error";
      enqueueSnackbar("Error : " + deleteAssignedEmployee?.comment, { variant });
    } else {
      let variant = "error";
      enqueueSnackbar("Employee not removed ", { variant });
    }
    updateCardListEvent();
  }
  const handleRemoveSelectedComment = async (target_id, comment_id) => {
    let removeSelectedComment = await recognitionSendRequestAction(`recmodule/targetcommentremove/${target_id}/${comment_id}`);
    let variant = "";
    let message = "";
    if (removeSelectedComment?.status?.toLowerCase() == 'ok') {
      variant = "success";
      message = "Comment removed";
    } else if (removeSelectedComment?.status?.toLowerCase() == 'error') {
      variant = "error";
      message = "Error : Comment not removed";
    } else {
      variant = "error";
      message = "Employee not removed ";
    }

    enqueueSnackbar(message, { variant });
  }
  return (
    <Stack className="recognitionTabContent">
      <Grid
        className="selectEmployeeWrap"
        container
        spacing={0}
        columns={12}
        sx={{ alignItems: "end", margin: "0px" }}
      >
        <div className="topInfoWrap">
          <div className="titleWrap">
            <Typography component="h2" className="tabMainTitle">
              {pathname == '/recognition/manager-dashboard' ? "Your Teams' Targets" : 'Your Targets'}
            </Typography>
            <Typography className="font18">
              {
                pathname == '/recognition/manager-dashboard' ?
                  "Choose an employee below to view or edit their targets."
                  :
                  'Choose a target below to view details or change your progress level.'
              }
            </Typography>
          </div>
          <div className="selectWrap">
            {pathname == '/recognition/manager-dashboard' && <MultiSelect
              name="employee"
              classNamePrefix="cMultiSelect"
              value={employeeFilter}
              // menuIsOpen={true}
              onChange={(element) => {
                setEmployeeFilter(element);
              }}
              placeholder="Select"
              options={getEmployeeList.map((item) => {
                return { value: item?.employee_id, label: item?.name };
              })}
              isClearable={true}
              isMulti={false}
              components={{ MenuList }}
            />}
          </div>
        </div>
        <Box className="st-leftWrap">
          {teamsTargetList !== null && teamsTargetList?.length > 0 ? (
            <TargetCards
              show={handleShow}
              loading={targetListLoading}
              cardList={teamsTargetList}
              assigned_employees={employeeList}
              eventAddNewEmployee={(employee_id, item) => {
                addNewEmployeeToTargetList(employee_id, item);
              }}
              eventForUpdateNewValue={(data) => {
                updateNewValueToTarget(data);
              }}
              eventDeleteItemFromList={(employee_id, target_id) => {
                deleteTeamsTargetEmployee(employee_id, target_id);
              }}
              showSideBar={(element) => {
                handleTargetCommentHistoryGetEvent(element)
                setTargetDescriptionID(element);
              }}
              eventDeleteList={(element) => deleteTeamsTargetList(element)}
              activeDesc={getTargetDescriptionID}
              activeFilter={employeeFilter}
            />
          ) : (
            <div>
              <Stack className={"targetCardList skeleton"}>
                {[1, 2, 3, 4]?.map((data, i) => (
                  <Box key={i} className={"targetCard "}>
                    <Stack
                      className="cardTopInfo"
                      sx={{ minWidth: "200px", minHeight: "350px" }}
                    >
                      <Skeleton sx={{ width: "100%", height: "100%" }} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </div>
          )}
        </Box>
      </Grid>



      <Box className="st-rightWrap" ref={ref}>
        {getTargetDescriptionID !== null &&
          teamsTargetList?.find(
            (item) => item?.target_id === getTargetDescriptionID
          ) !== undefined && (
            <TargetDescription
              data={
                teamsTargetList?.find(
                  (item) => item?.target_id === getTargetDescriptionID
                )
              }
              addNewTargetComment={(data) => handleTargetCommentSubmission(data, getTargetDescriptionID)}
              updateTargetComment={(comment, comment_id, target_id) => handleCommentUpdateSubmitEvent(comment, comment_id, target_id)}
              updatedTargetCommentID={newTargetID}
              handleProgressSubmitEvent={(value) => {
                handleSetProgressSubmit(getTargetDescriptionID, value);
              }}
              handleTargetSubmitEvent={
                (employee_id, target_id) => {
                  handleTargetApproveEvent(employee_id, target_id);
                }
              }
              removeCommentEvent={(target_id, comment_id) => handleRemoveSelectedComment(target_id, comment_id)}
              updateSelectedCommentList={(target_id) => { handleTargetCommentHistoryGetEvent(target_id) }}
            />
          )}
      </Box>
    </Stack>
  );
}

export default ShowTargets;
