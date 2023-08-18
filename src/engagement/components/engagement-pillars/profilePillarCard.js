import React, { useState } from "react";
import { Box, Card, Button, CardContent, CardActions, Typography, Stack, Skeleton, IconButton, ClickAwayListener } from "@mui/material";
import RangeSlider from "../range-slider/range-slider";
import InfoIcon from "@mui/icons-material/Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import * as _ from "lodash";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { EmployeeComment } from "../../../commonComponents/modals/modals";

export const ProfilePillarCard = ({ data,index,activeTooltip, tooltipEvent }) => {
    const [open, setOpen] = useState("");

    const handleTooltipClose = () => {
        tooltipEvent(null);
    };

    const HTMLContent = (values) => {
        return (
            <>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <Card sx={{ borderRadius: "10px" }} >
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
                            <Typography sx={{ color: "#000",}}> {values.content}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </ClickAwayListener>
            </>
        );
    };

    const LightTooltip = styled(({ className, ...props }) => (
            <Tooltip {...props} classes={{ popper: className+" tooltipArrow" ,arrow: "tooltipArrow"}} placement="top" />
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
                        sx={{ height: 258, justifyContent: "center", mt: "30px" }}
                        spacing={1}
                        direction="row"
                        className={((data?.target != undefined && data?.target != null) ? data?.target : 1) == ((data?.score != undefined && data?.score != null) ? data?.score : 1) ? "equalPillarSliders" : ""}
                    >
                        {
                            data == '' || data == undefined ? <Skeleton  sx={{ transform: "none", justifyContent: "center",  mt: "-30px" }} width={50} height={288} /> :
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
                                            defaultValue: data?.target,
                                            valueLabelDisplay: "on",
                                            orientation: "vertical",
                                            marks: true,
                                            disableSwap: true,
                                            className: "targetRange",
                                            disabled: true,
                                            index:index
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
                                            defaultValue: data?.score,
                                            valueLabelDisplay: "on",
                                            orientation: "vertical",
                                            marks: true,
                                            disableSwap: true,
                                            disabled: true,
                                            className: "currentRange",
                                            index:index
                                        }}
                                    />
                                </>
                        }


                    </Stack>
                    <Typography>1</Typography>
                </CardContent>
                
                {
                    data == '' || data == undefined ? <Skeleton sx={{ transform: "none" }} width={"100%"} height={42} /> :
                    <CardActions sx={{ padding: 0 }} className={(data?.comment && data?.comment != null) ? "" : "disabled"} >
                        {(data?.comment && data?.comment != null) ? 
                        <EmployeeComment pulse_comment={{
                            id: 1,
                            comment: data.comment,
                            comment_time: data.comment_time,
                            category: data.name,
                            target_comment: data.target_comment,
                            
                            }} data={{
                            btnText: "Comment",
                            
                        }} 
                        triggerClickEvent={()=>{}}
                        /> :
                            <Typography
                                className="commentButton"
                                sx={{
                                    minHeight: "42px",
                                    width: "100%",
                                    fontSize: "15px",
                                    color: "#000",
                                    borderRadius: "0",
                                    textTransform: "capitalize",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor:'pointer'
                                }}
                            >
                                <svg
                                    height="20pt"
                                    viewBox="-21 -47 682.66669 682"
                                    width="20pt"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0" />
                                    <path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0" />
                                    <path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0" />
                                    <path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0" />
                                </svg>
                                Comment
                            </Typography>}
                       
                    </CardActions>
                    }

            </Card>
            {
               data == '' || data == undefined ? <Skeleton sx={{ transform: "none", margin:"10px auto 0px" }} width={"90%"} height={30} /> :
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
                            open={activeTooltip == index ? true : false}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={<HTMLContent title={data?.name} content={data?.info_mgr} />}
                            arrow
                        >
                            <IconButton
                                className="toolTipIcon"
                                aria-label="Info"
                                onMouseOver={()=>tooltipEvent(index)}
                                sx={{ color: "#707070", py: "0px",px: "0px", mb: "5px" }}
                            >
                                <InfoIcon  sx={{
                                    fontSize: "0.8rem",
                                }}
                                />
                            </IconButton>
                        </LightTooltip>

                    </span>
                    
                </Typography>
            }
        </Box>
    );
}
