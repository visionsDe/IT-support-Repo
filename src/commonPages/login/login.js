import React, { useContext } from "react";
import "./login.scss";
import {IconButton ,OutlinedInput ,InputAdornment,FormControl ,TextField ,Button ,Card ,CardHeader ,CardContent ,FormHelperText, Box, CircularProgress} from "@mui/material";
import { grey } from '@mui/material/colors';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginApi, setTeamsIdAction } from "../../service/api";
import { useSnackbar } from 'notistack';
import Cookies from 'universal-cookie';
import Cookie from "js-cookie";
import { LoginFailedPopup, InfoPopup } from "../../commonComponents/modals/modals";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { TeamsUserContext } from "../../index";
import { utilGetEmployeeProfile } from "../../commonComponents/utils";


const Login = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openLoginFailed, setOpenLoginFailed] = useState(false);
  const [openLoginError, setOpenLoginError] = useState(false);
  const appInfo = useContext(TeamsUserContext);
  const [getLoading,setLoading] = useState(false);

  const [timer,setTimer] = useState(0);
  React.useEffect(() => {
    document.title = "Manager IQ | Login";
  }, []);

  React.useEffect(()=>{
    const interval = setInterval(()=>{
      let token = cookies.get('token');
      if(token !== null && token !== "" && token !== undefined){
          window.location.href= '/';
      }
   
      setTimer(timer+1)
    },5000)
    return ()=>clearInterval(interval);
  },[timer])

  const {pathname} = useLocation();
  const cookies = new Cookies();
  const executeLoginCheck = async () => {
    await utilGetEmployeeProfile();
    const user = Cookie.get('role', { secure: true, sameSite:'none' }) != undefined && Cookie.get('role', { secure: true, sameSite:'none' }) != '' ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? 'manager' : 'employee') : false;
    const admin = Cookie.get('admin', { secure: true, sameSite:'none' });
    const authToken = Cookie.get('token', { secure: true, sameSite:'none' });
    if((authToken != undefined || authToken != '') && user != false){
      let redirectPath = null;
      if(admin == false){
        
        if(user === 'manager'){
          redirectPath = appInfo?.page?.id == 'recognition' ? "/recognition/manager-dashboard": "/manager-dashboard";
        }
        else if(user === 'employee'){
            redirectPath = appInfo?.page?.id == 'recognition' ? "/recognition/employee-dashboard": "/employee-dashboard";
        }
        else{
            redirectPath = '/login';
        }
      }else{
        if(user === 'manager'){
          redirectPath = appInfo?.page?.id == 'recognition' ? "/recognition/manager-dashboard": "/admin-dashboard";
        }
        else if(user === 'employee'){
            redirectPath = appInfo?.page?.id == 'recognition' ? "/recognition/employee-dashboard": "/admin-dashboard";
        }
        else{
            redirectPath = '/login';
        }
      }
      window.location.href = redirectPath;
    }
  };
  React.useEffect(() => {
    document.title = "Manager IQ | Login";
  }, []);
  const [values, setValues] = React.useState({});

  const formik = useFormik({
    initialValues: {
      clientId: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      clientId: Yup.string().required("Please enter a valid client ID"),
      username: Yup.string()
        .min(2)
        .max(200)
        .required("Please enter a valid username"),
      password: Yup.string().required("Please enter a valid password"),
    }),
    
    // ============= Form submit =========
    onSubmit: async (data) => {
       let response;
       setLoading(true);
      try{
        response = await LoginApi(data ,data.clientId);
      }catch(err){
       setOpenLoginError(true);
       setLoading(false);
      }
      if(response.status != "ERROR" && response.token != false){
        cookies.set('Client_Id', data.clientId , { secure: true, sameSite:'none' });
        const user = response.manager != undefined ? (response.manager ==  true ? 'manager' : 'employee') : false;
        if(user){
          try {
            if(response.ms_username == null || response.ms_username == ""){
              await cookies.set('token', response.token , { secure: true, sameSite:'none' });
              await cookies.set('role', response.manager , { secure: true, sameSite:'none' });
              await cookies.set('admin', response.admin , { secure: true, sameSite:'none' });
              await cookies.set('profile', JSON.stringify(response) , { secure: true, sameSite:'none' });
              let setTeams = await setTeamsIdAction(`/emp/setteams/${appInfo.user.userPrincipalName}/${appInfo.user.id}` ,data.clientId);
              if(setTeams?.status?.toLowerCase() == 'ok'){
               let reAuthenticate;
                try{
                  reAuthenticate = await LoginApi(data ,data.clientId);
                }catch(err){
                 setOpenLoginError(true);
                }
                if(reAuthenticate.status != "ERROR" && reAuthenticate.token != false){
                  await cookies.set('token', reAuthenticate.token , { secure: true, sameSite:'none' });
                  await cookies.set('role', reAuthenticate.manager , { secure: true, sameSite:'none' });
                  await cookies.set('admin', reAuthenticate.admin , { secure: true, sameSite:'none' });
                  await cookies.set('profile', JSON.stringify(reAuthenticate) , { secure: true, sameSite:'none' });
                }
                executeLoginCheck();
                let variant = 'success';
                enqueueSnackbar('Logged In', {variant});
              }else{
                let variant = 'error';
                enqueueSnackbar('Error: Not running in Teams environment', {variant});
              }
            }
            else{
              if(!!response.ms_username && response.ms_username == appInfo?.user?.userPrincipalName){
                await cookies.set('token', response.token, { secure: true, sameSite:'none' });
                await cookies.set('role', response.manager, { secure: true, sameSite:'none' });
                await cookies.set('admin', response.admin , { secure: true, sameSite:'none' });
                await cookies.set('profile', JSON.stringify(response), { secure: true, sameSite:'none' });
                executeLoginCheck();
                let variant = 'success';
                enqueueSnackbar('Logged In', {variant});
              }
              else{
                setOpenLoginFailed(true);
                setLoading(false);
              }
            }
          } catch (err) {
            setLoading(false);
            if (err ) {
              let variant = 'error';
              enqueueSnackbar('Error: Not running in Teams environment', {variant});
            } else {
              return;
            }
          }
        }
      }else{
        setLoading(false);
        setOpenLoginError(true);
      }
    },
  });

  const handleClickShowPassword = () => {
    setValues({
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Card className="login-wrapper" sx={{position:'relative'}}>
      <div className="login-wrapper-inner">
        <CardHeader title="Login" />
        <CardContent className="login-formwrap">
        
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <label>Client ID</label>
              <TextField
                variant="outlined"
                id="clientId"
                name="clientId"
                error={formik.touched.clientId && formik.errors.clientId}
                placeholder="CID - Sample Text Here"
                value={formik.values.clientId}
                onChange={formik.handleChange}
                helperText={formik.touched.clientId && formik.errors.clientId}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
              <label>Username</label>
              <OutlinedInput
                error={formik.touched.username && formik.errors.username}
                id="username"
                name="username"
                type="text"
                placeholder="info@mail.com"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username ? (
                <FormHelperText error={formik.errors.username}>
                  {formik.errors.username}
                </FormHelperText>
              ) : null}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
              <label>Password</label>
              <OutlinedInput
                error={formik.touched.password && formik.errors.password}
                id="password"
                name="password"
                type={values.showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faLock} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <FormHelperText error={formik.errors.password}>
                  {formik.errors.password}
                </FormHelperText>
              ) : null}
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mt: 5, position:'relative' }}>
              <Button 
                type="submit"
                size="100%"
                variant="contained"
                disabled={getLoading}
                className={`login-btn ${getLoading ? 'disabled_color' : ''}`}
              >
                {getLoading ? 
                  <CircularProgress
                  size={28}
                  sx={{
                    color: grey[500],
                  }}
                />
                : 'Login'} 


              </Button>
            </FormControl>
          </form>
        </CardContent>
      </div>
    {!!openLoginFailed &&
      <InfoPopup
      setOpenLoginFailed = {setOpenLoginFailed}
      openLoginFailed ={openLoginFailed}/>}
    {!!openLoginError &&
      <LoginFailedPopup
      setOpenLoginError = {setOpenLoginError}
      openLoginError ={openLoginError}/>}
    </Card>
  );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
