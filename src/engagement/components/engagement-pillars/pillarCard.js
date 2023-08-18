import React, { useState } from "react";
import { Box, Card, CardContent, CardActions, Typography, Stack, Skeleton, IconButton, ClickAwayListener } from "@mui/material";
import RangeSlider from "../range-slider/range-slider";
import { CommentsList } from "./commentsModal";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import * as _ from "lodash";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";



export const PillarCard = ({ data, triggerComment, index, triggerScoreChangeEvent, activeTooltip, tooltipEvent }) => {
  const { updatedEngagementComment } = useSelector((state) => state.engagementCategory);
  const location = useLocation();
  const [open, setOpen] = useState(null);
  const handleTooltipClose = () => {
    tooltipEvent(null);
  };

  const [getScore, setScore] = useState(data?.score?.score != '' ? data?.score?.score : (data?.score?.score == null ? 1 : null));
  const [getTarget, setTarget] = useState(data?.score?.target != '' ? data?.score?.target : (data?.score?.target == null ? 1 : null));
  const [getComment, setComment] = useState(data?.comments?.comment != '' ? data?.comments?.comment : '');


  const handlePillarChange = (item, dataSet) => {

    if (dataSet != undefined) {

      let copyScore = JSON.parse(JSON.stringify(data));
      if (copyScore.score.engagement_category != undefined) {
        if (item == 'target') {
          copyScore.score.score = copyScore.score.score
          copyScore.score.target = dataSet
        } else if (item == 'score') {
          copyScore.score.target = copyScore.score.target
          copyScore.score.score = dataSet
        }
        if (item == 'target' || item == 'score') {
          triggerScoreChangeEvent(copyScore, item)
        }
      }
    }
  }
  const HTMLContent = (values) => {
    return (
      <>
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Card sx={{ borderRadius: "10px" }} onMouseLeave={() => {
          }}
          >
            <CardContent sx={{ px: "25px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ borderBottom: "1px solid #B2B2B2", mb: "10px" }}
              >
                <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold", mb: "10px", }} >
                  {values.title}
                </Typography>
                <IconButton
                  aria-label="close"
                  sx={{
                    color: "#707070",
                  }}
                  onClick={() => {
                    tooltipEvent(null)
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </Stack>
              <Stack direction="row">
                <Typography
                  sx={{
                    color: "#000",
                  }}
                >
                  {values.content}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </ClickAwayListener>
      </>
    );
  };

  const LightTooltip = styled(({ className, ...props }) => (

    <Tooltip
      {...props}
      classes={{ popper: className + " tooltipArrow", arrow: "tooltipArrow" }}
      placement="top"
    />


  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "transparent",
      padding: "0",
      maxWidth: "490px",
      width: "calc(100% - 20px)",
      marginLeft: "auto",
      marginRight: "auto",
    },
  }));

  const [getEqualSliderClass, setEqualSliderClass] = useState(((getTarget != null ? getTarget : 1) == (getScore != null ? getScore : 1)) ? "equalPillarSliders" : "")
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "100%",
      }}
      className="engagementPillar-sliderBox"
    >
      <Card
        sx={{
          width: "100%",
          boxShadow: "none",
          borderRadius: "10px",
          textAlign: "center",
          border: "1px solid #22A6DE",
        }}
      >

        <CardContent sx={{ py: 1.5 }}>
          <Typography>10</Typography>
          <Stack
            sx={{ height: 258, justifyContent: "center", mt: "30px", position: 'relative' }}
            spacing={1}
            direction="row"
            className={getEqualSliderClass}
          >
            {
              data == '' || data == undefined ? <Skeleton sx={{ transform: "none", justifyContent: "center", mt: "-30px" }} width={50} height={288} /> :
                <>
                  <RangeSlider
                    settings={{
                      height: "100%",
                      width: 40,
                      maxWidth: "40px",
                      min: 1,
                      max: 10,
                      color: "transparent",
                      borderRadius: "6px",
                      defaultValue: data?.score?.target,
                      valueLabelDisplay: "on",
                      orientation: "vertical",
                      marks: true,
                      disableSwap: false,
                      className: "targetRange",
                      index: index
                    }}
                    eventTriggered={(value) => {
                      handlePillarChange('target', value);
                      setTarget(value);
                      data?.score?.score == value ? setEqualSliderClass('equalPillarSliders') : setEqualSliderClass(' ');
                    }}
                    clientEventTriggered={(value) => {
                      data?.score?.score == value ? setEqualSliderClass('equalPillarSliders') : setEqualSliderClass(' ');

                      tooltipEvent(null);

                    }}

                  />
                  <RangeSlider
                    settings={{
                      height: "100%",
                      width: 40,
                      maxWidth: "40px",
                      min: 1,
                      max: 10,
                      color: "transparent",
                      borderRadius: "6px",
                      defaultValue: data?.score?.score,
                      valueLabelDisplay: "on",
                      orientation: "vertical",
                      marks: true,
                      disableSwap: false,
                      className: "currentRange",
                      index: index
                    }}
                    eventTriggered={(value) => {
                      handlePillarChange('score', value);
                      setScore(value);
                      data?.score?.target == value ? setEqualSliderClass('equalPillarSliders') : setEqualSliderClass(' ')
                    }}
                    clientEventTriggered={(value) => {
                      setEqualSliderClass('');
                      tooltipEvent(null);
                    }}
                  />
                </>
            }

          </Stack>
          <Typography>1</Typography>
        </CardContent>

        {
          data == '' || data == undefined ? <Skeleton sx={{ transform: "none" }} width={"100%"} height={42} /> :
            <CardActions sx={{ padding: 0 }} className={(!data?.updatedComments) ? ((data?.comments != undefined && data?.comments?.comment != "") ? "" : (location.pathname == '/employee-dashboard' ? '' : "disabled")) : !data?.updatedComments?.comment ? (location.pathname == '/employee-dashboard' ? '' : "disabled") : ""} >
              <CommentsList
                code={data?.code}
                handleComment={(value) => {
                  triggerComment(value);
                }}
                title={data?.name}

              />
            </CardActions>
        }


      </Card>



      {
        data == '' || data == undefined ? <Skeleton sx={{ transform: "none", margin: "10px auto 0px" }} width={"90%"} height={30} /> :
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontSize: "0.9rem",
              lineHeight: "1.4",
              fontWeight: "bold",
              maxWidth: "115px",
              mx: "auto",
              mt: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >

            <span className="pillarTextName">
              {data?.name}

              <LightTooltip
                placement="top"
                PopperProps={{
                  disablePortal: true,
                }}
                disableFocusListener
                disableHoverListener
                disableTouchListener

                title={<HTMLContent title={data?.name} content={data?.info} />}
                arrow
                open={activeTooltip == index ? true : false}
              >
                <span>
                  <IconButton
                    aria-label="Info"
                    onMouseOver={() => tooltipEvent(index)}
                    sx={{ color: "#707070", py: "0px", px: "0px", mb: "5px" }}
                  >
                    <InfoIcon sx={{
                      fontSize: "0.8rem",
                    }}
                    />
                  </IconButton>
                </span>

              </LightTooltip>
            </span>


          </Typography>

      }

    </Box>
  );

}
