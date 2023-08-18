import React, { useEffect, useState } from "react";
import "./range-slider.scss";
import Slider from "@mui/material/Slider";
import { useLocation } from "react-router-dom";

const RangeSlider = ({settings,eventTriggered,customClass, clientEventTriggered}) => {
  const location = useLocation();
return (
    <>
   <Slider
        key={(location.pathname == '/manager-dashboard' || location.pathname == '/admin-dashboard') ? Math.random() : settings?.index}
        className={settings.className + ' ' + customClass }
        sx={{
          boxShadow: "0px 2px 2px #00000029",
          padding: "0 !important",
          width: settings.width,
          maxWidth: settings.maxWidth,
          height: settings.height,
          color: settings.color,
          borderRadius: settings.borderRadius,
          background: "#225FA0",
        }}
        onChange={(element,newValue)=>clientEventTriggered(newValue)}
        onChangeCommitted={(element,newValue)=>eventTriggered(newValue)}
        orientation={settings.orientation}
        min={settings.min}
        max={settings.max}
        defaultValue={(settings.defaultValue != null && settings.defaultValue != undefined) ? settings.defaultValue : null}
        valueLabelDisplay={settings.valueLabelDisplay}
        disabled={settings.disabled}
        marks={settings.marks}  
        disableSwap={settings.disableSwap} 
      />
      
    </>
  );
};

export default RangeSlider;
