import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Divider,
  Avatar,
  Popper,
  IconButton,
  ClickAwayListener,
  List,
  ListItem,
  TextField,
  Skeleton,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import "./TargetCards.scss";
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEllipsis,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import employee1 from "../../../commonAssets/images/employee1.jpg";
import TargetDelete from "../popups/targetDelete";
import AddTeam from "../../popups/AddTeam";
import _ from "lodash";
import { truncateString } from '../../utils';
import moment from "moment";
import dayjs from "dayjs";
import { useSelector } from "react-redux";



export const RenderCarousel = ({ children }) => {
  return (
    <>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 2500,
              min: 1600,
            },
            items: 5,
            partialVisibilityGutter: 40,
          },
          tablet: {
            breakpoint: {
              max: 1400,
              min: 768,
            },
            items: 5,
            partialVisibilityGutter: 30,
          },
          mobileHorizontal: {
            breakpoint: {
              max: 768,
              min: 576,
            },
            items: 5,
            partialVisibilityGutter: 30,
          },
          mobile: {
            breakpoint: {
              max: 576,
              min: 0,
            },
            items: 5,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {children}
      </Carousel>
    </>
  );
};

export const RenderEditableText = ({ setClassName, children }) => {
  return (
    <>
      {React.Children.map(children, (child, key) =>
        React.cloneElement(child, { className: setClassName, key })
      )}
    </>
  );
};

const TargetCards = (props) => {
  const [edit, setEdit] = React.useState(null);
  const [getCardList, setCardList] = React.useState(props.activeFilter != null ? props.cardList : []);
  const [getUpdatedCardList, setUpdatedCardList] = React.useState({});
  const { userInfo } = useSelector(state => state.recognitionDashboard);
  const { graphProfileUrl } = useSelector(state => state.graphProfileUrl)
  const [getGraphProfileURLS,setGraphProfileURL] = React.useState([]);
  React.useEffect(()=>{
    if(graphProfileUrl != null && graphProfileUrl?.length > 0){
      setGraphProfileURL(graphProfileUrl);
    }
  },[graphProfileUrl])
  React.useEffect(()=>{
    if(props.activeFilter != null){
      let filteredRecord = props.cardList?.filter(item => item?.assigned_employees?.find(employee => employee?.employee_id == props?.activeFilter?.value))
      setCardList([...filteredRecord]);
    }
    else{
      setCardList([...props.cardList])
    }
    
  },[props.cardList, props.activeFilter])




  const updateCardList = async (itemId = null) => {
    let itemID = itemId !== null ? itemId : edit;
    if (_.isEmpty(getUpdatedCardList) === false) {
      props.eventForUpdateNewValue(getUpdatedCardList);
    }



    setEdit(null);
  }
  const handleEmpRemove = async (employee_id,target_id) => {
    let cardCopy = [...getCardList];
    let updatedCardList = cardCopy?.map(item => item?.target_id == target_id ? ({...item, "assigned_employees": item?.assigned_employees?.filter(employee => employee.employee_id != employee_id)}) : item);
    setCardList(updatedCardList)
    props.eventDeleteItemFromList(employee_id,target_id)
  
  }
  const handleViewDetails = (data) => {
    props.showSideBar(data)
  }
  const stringAvatar = (name) => {
    if(!!name && name != undefined){
    return {children : name.split(",").reverse().map(item=>item.trim().slice(0,1)).join("")}
  }else{
    return {children : 'N/A'}
  }
  }
  const renderProfileAvatar = (data) => {
    return(
      data?.src != null ?
      <Avatar
          sx={{ width: "40px", height: "40px" }}
          className={`${data?.colorPalette}`} 
          alt={data?.name} 
          src={data?.src}
      /> :
      <Avatar 
        className={`${data?.colorPalette}`} {...stringAvatar(data?.name != undefined ? data?.name : data?.name)} 
      />
    )
  }
  return (
    <>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          if (edit != null) {
            updateCardList();
          }
        }}
      >  
        <Stack
          className={
            "targetCardList " + (getCardList?.length > 6 ? "scrollable" : "")
          }

          // onClick={() => {
          //   if (edit != null) {
          //     updateCardList();
          //   }
          // }}

        >
          <span className="customOverlay"
          onClick={() => {
            if (edit != null) {
              updateCardList();
            }
          }}
          ></span>
          { 
            getCardList?.map((data, indexKey) => (
              
      <RenderSingleTarget 
        data={data}
        key={indexKey}
        userInfo={userInfo}
        edit={edit}
        setEdit={setEdit}
        getGraphProfileURLS={getGraphProfileURLS}
        stringAvatar={stringAvatar}
        eventDeleteList={props.eventDeleteList}
        assigned_employees={props.assigned_employees}
        eventAddNewEmployee={props.eventAddNewEmployee} 
        renderProfileAvatar={renderProfileAvatar}
        handleViewDetails={handleViewDetails}
        setUpdatedCardList={setUpdatedCardList}
        getUpdatedCardList={getUpdatedCardList}
        updateCardList={updateCardList}
        handleEmpRemove={handleEmpRemove}
        setCardList={setCardList}
      />
          ))
          }
        
          {
            (props.activeFilter != null && getCardList?.length == 0 )&& 
            <Box className={"targetCard "}>
              <Stack className="cardTopInfo">

                  <Box className="empSliderWrap" sx={{ width: '50vw' }}>
                    No data Found
                  </Box>
                </Stack>
            </Box>
          }
        </Stack>
        </ClickAwayListener>
    </>
  );
}

const RenderCardMenu = ({item, itemId, deleteListEvent, assigned_employees, setUpdatedCardList, setEdit, eventAddNewEmployee}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "sortFilter" : undefined;
  const handleDeleteCard = (itemId) => {
    setAnchorEl(null);
    deleteListEvent(itemId);
    setEdit(null);
  }
  return (
    <>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          setAnchorEl(null);
        }}
      >
        <div>
          <button
            aria-describedby={id}
            type="button"
            onClick={(element) => {
              handleClick(element);
            }}
            className={"toggleBtn customPopper" + (anchorEl ? " opened" : "")}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement="bottom"
            disablePortal={false}
            modifiers={[
              {
                name: "flip",
                enabled: true,
                options: {
                  altBoundary: true,
                  rootBoundary: "document",
                  padding: 8,
                },
              },
              {
                name: "preventOverflow",
                enabled: true,
                options: {
                  altAxis: true,
                  altBoundary: true,
                  tether: true,
                  rootBoundary: "document",
                  padding: 8,
                },
              },
              {
                name: "arrow",
                enabled: true,
                options: {
                  element: anchorEl,
                },
              },
            ]}
          >
            <Box className="toggleButtonPopup" data-popper-arrow>
              <List sx={{ padding: "0px" }}>
                <ListItem>
                  <AddTeam 
                    title="Add Employee" 
                    iconBtn={false}
                    assigned_employees={assigned_employees}
                    activeEmpList={item?.assigned_employees}
                    selectEvent={
                      (element)=>{
                        eventAddNewEmployee(element?.employee_id,item)
                      }
                    }
                    />
                </ListItem>
                <ListItem>
                  <Typography
                    className="font14"
                    sx={{ fontWeight: "600" }}
                    onClick={() => {
                      setUpdatedCardList({})
                      setEdit(itemId);
                      setAnchorEl(null);
                    }}
                  >
                    Edit
                  </Typography>
                </ListItem>
                <ListItem>
                  <TargetDelete
                    itemId={item.target_id}
                    triggerEvent={(itemId) => {handleDeleteCard(itemId)}} 
                  />
                </ListItem>
              </List>
            </Box>
          </Popper>
        </div>
      </ClickAwayListener>
    </>
  );
};

const RenderSingleTarget = ({data, updateCardList, userInfo, edit, setEdit, getGraphProfileURLS, stringAvatar, eventDeleteList, assigned_employees, eventAddNewEmployee, renderProfileAvatar, handleViewDetails, setUpdatedCardList, getUpdatedCardList, handleEmpRemove, setCardList}) => {
  return (
    <ClickAwayListener
      // mouseEvent="onMouseDown"
      // touchEvent="onTouchStart"
      onClickAway={() => {
        if (edit != null) {
          // alert('click away event '+edit);
          updateCardList();
        }
      }}
    >
      <>
      <Box
        className={
          "targetCard " + ((data?.due_date != undefined && data?.due_date != null) ? (new Date(data.due_date).getTime() < new Date().getTime() ? "statusDue" : '') : "")
        }
        onClick={() => {
          // alert('click change event box ', edit, data.target_id);
          if (edit !== null && edit !== data.target_id) {updateCardList()}
        }}
      >
        <Stack className="cardTopInfo">
          {data?.create_employee_id === userInfo?.employee_id && 
          <RenderCardMenu 
            item={data}
            itemId={data.target_id}
            updateCardListEvent={
              (element)=>setCardList(element)
            } 
            deleteListEvent={
              (element)=>eventDeleteList(element)
            }
            assigned_employees={assigned_employees}
            setUpdatedCardList={setUpdatedCardList}
            setEdit={setEdit}
            eventAddNewEmployee={eventAddNewEmployee}
            />
          }
          <RenderEditableText
            setClassName={`cardDescription ${edit !== null && edit === data.target_id ? "FieldBig" : ""}`}
          >
            {edit !== null && edit === data.target_id ? (
              <TextField
                multiline
                defaultValue={getUpdatedCardList.description !== undefined ? getUpdatedCardList.description : data.description}
                maxRows={2}
                onChange={(element) => {
                  let record = Object.keys(getUpdatedCardList)?.length > 0 ? {...getUpdatedCardList} : {...data};
                  setUpdatedCardList({ ...record, description: element.target.value })
                }}
              />
            ) : (
              <Typography mb={0}>
                <strong>{truncateString(data.description, 74)}
                </strong>
              </Typography>
            )}
          </RenderEditableText>
          {data?.assigned_employees?.length > 0 && 
            <Divider />
          }
          <Box className="empSliderWrap">
            {data?.assigned_employees?.length > 0 && 
            <Typography sx={{ color: "#707070", fontSize: "15px" }}>
              WHO'S ASSIGNED?
            </Typography>
            }
            <div className="empSlider">
              {data?.assigned_employees?.length !== null &&
                data?.assigned_employees?.length > 0 && (
                  <RenderCarousel>
                    {data?.assigned_employees?.map((item,index) => {
                      return (
                          <Tooltip key={index} title={item?.name} arrow placement="top">
                        <div className={`${getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id)?.src != null ? ' empAvatar ' : ' customAvatar ' }`} key={index} >
                          {(edit !== null && edit === data?.target_id && item.id !== null) && (
                            <IconButton aria-label="close" onClick={()=>handleEmpRemove(item.employee_id, data?.target_id)}>
                              {" "}
                              <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                          )}
                          {((Object.keys(getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id) || {})?.length > 0)) ? 
                          renderProfileAvatar(getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id))
                          :
                          <Avatar {...stringAvatar(item?.full_name)} />
                          }
                        </div>
                        </Tooltip>
                      );
                    })
                    }
                  </RenderCarousel>
                )}
            </div>
          </Box>
          <Divider />
          <RenderEditableText
            setClassName={`dateRewardWrap ${edit !== null && edit === data?.target_id ? "FieldBig" : ""}`}
          >
            <Grid container spacing={0} columns={12} my={2} px={2}>
              <Grid item xs={6}>

                {edit !== null && edit === data?.target_id ? (
                  <Typography mb={0}>
                    DUE DATE:
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDatePicker
                        className="cDatePicker"
                        name="targetDueDate"
                        defaultValue={getUpdatedCardList?.due_date !== undefined ? dayjs(getUpdatedCardList.due_date) : dayjs(data.due_date)}
                        onChange={(element) =>
                          {
                            let record = Object.keys(getUpdatedCardList)?.length > 0 ? {...getUpdatedCardList} : {...data}
                            setUpdatedCardList({ ...record, due_date: new Date(element) })
                          }
                        }
                        placeholder="Select"
                      />
                    </LocalizationProvider>
                  </Typography>

                ) : (
                  <Typography
                    mb={0}
                    className={((data?.due_date != undefined && data?.due_date != null) ? (new Date(data.due_date).getTime() < new Date().getTime() ? "due" : '') : "")}
                  >
                    DUE DATE:
                    <br />
                    <span>{(data?.due_date != null && data.due_date != "") ? moment(data.due_date).format('DD/MM/yyyy') : 'N/A'}</span>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>

                {edit !== null && edit === data?.target_id ? (
                  <Typography mb={0}>
                    REWARD:
                    <br />
                    <TextField
                      className="cardFieldSmall"
                      defaultValue={(getUpdatedCardList?.points !== undefined && getUpdatedCardList?.points !== null) ? getUpdatedCardList.points : data.points}
                      onChange={(element) => {
                        let record = Object.keys(getUpdatedCardList)?.length > 0 ? {...getUpdatedCardList} : {...data}
                        setUpdatedCardList({ ...record, points: element.target.value })
                      }}
                    />
                  </Typography>

                ) : (
                  <Typography mb={0}>
                    REWARD:
                    <br />
                    <span>{data.points}</span>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </RenderEditableText>
        </Stack>
        <Button 
          fullWidth 
          variant="contained" 
          className="viewDetails" 
          onClick={()=>{
            handleViewDetails(data?.target_id)
          }
        }
        >
          <FontAwesomeIcon icon={faCircleInfo} />
          VIEW DETAILS
        </Button>
      </Box>
      </>
    </ClickAwayListener>
  )
}

export default TargetCards;
