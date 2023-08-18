import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { getEmployeeProfileAction } from '../../engagement/actions/engagement';
import { setEmployeeProfileData } from "../../engagement/reducer/engagementPillars";
import { TeamsFx, createMicrosoftGraphClient, TeamsUserCredential } from "@microsoft/teamsfx";
import Cookies from 'universal-cookie';
import { LogoutPopup } from '../../commonComponents/modals/modals';
import { engagementCategoryListAction } from "../../engagement/actions/engagement";
import { setEngagementCategoryList } from "../../engagement/reducer/engagementPillars";
import { setTeamsAuthStatus } from '../../engagement/reducer/teamsAuthStatusList';
import { TeamsFxContext } from '../../Context';
import { TeamsUserContext } from '../../index';

import { useSnackbar } from 'notistack';
export default function TopBar({ id, menuList = null }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const appInfo = React.useContext(TeamsUserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [getTeamsAuth,setTeamsAuth] = React.useState(false);
    const cookies = new Cookies();
    const [openLogoutFailed, setOpenLogoutFailed] = React.useState(false);

    const teamsfx = new TeamsFx();
    const graphClient = createMicrosoftGraphClient(teamsfx, ["User.ReadBasic.All"]);


    let profileCookie = (!!cookies.get("profile", { secure: true, sameSite:'none' })&& cookies.get("profile", { secure: true, sameSite:'none' })!= undefined) ? cookies.get("profile", { secure: true, sameSite:'none' }): ""
    const reAuthentication = async () => {
        try{
            const authConfig = {
                clientId: process.env.REACT_APP_CLIENT_ID,
                initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
            };
            const credential = new TeamsUserCredential(authConfig); 
            await credential.login(["User.ReadBasic.All"]);
            dispatch(setTeamsAuthStatus(false))
        }catch(error){
            // console.warn('Authentication Error : '+error.message)
        }        
    }
    const getEmployeeProfileDispatch = async () => {
        let value = await getEmployeeProfileAction('emp/profile');
        if (value) {
            dispatch(setEmployeeProfileData(value))
            cookies.set('profile', JSON.stringify(value), { secure: true, sameSite: 'none' });
            let profile = await graphClient.api("/me").get();
            if(profile){
                cookies.set('graphClientProfile', JSON.stringify(profile), { secure: true, sameSite: 'none' });
                if ( profile?.userPrincipalName != value?.ms_username) {
                    setOpenLogoutFailed(true);
                }
            }
            else{
                let variant = 'error';
                enqueueSnackbar('Error: Session Expired', {variant});
                navigate("/login");
            }
        }
    }
    const performReAuthentication = async () => {
        if(getTeamsAuth ==  true){
            await reAuthentication();
            dispatch(setTeamsAuthStatus(false))
        }
    }
    React.useEffect(()=>{
        performReAuthentication()
    },[getTeamsAuth])
   const checkAuthentication = async () => {
        try {
            let profile = await graphClient.api("/me").get();
            cookies.set('graphClientProfile', JSON.stringify(profile), { secure: true, sameSite: 'none' });
            if (cookies.get('profile') != "" && appInfo?.user?.userPrincipalName && (cookies.get('profile')?.ms_username != appInfo?.user?.userPrincipalName)) {
                setOpenLogoutFailed(true);
            }
        }
        catch (err) {
            let message = err.message;
            if(message.match('Failed to get access token cache silently, please login first: you need login first before get access token.') && getTeamsAuth ==  false){
                setTeamsAuth(true);
                dispatch(setTeamsAuthStatus(true))
            }
            else{
                setOpenLogoutFailed(true)
            }
        }
    }
    const updateEngagementCategoryList = async () => {
        let list = await engagementCategoryListAction("category/list");
        dispatch(setEngagementCategoryList(list))
      }
    React.useEffect(() => {
        updateEngagementCategoryList()
        if (location.pathname.match("/employee-dashboard") || location.pathname.match("/recognition/employee-dashboard")) {
            getEmployeeProfileDispatch()
        }
            checkAuthentication();
    }, [])


    const activePath = useLocation().pathname;
    const renderExtraMenu = () => {
        return(
            <>
        <li onClick={() => { navigate('/employee-dashboard') }} className={(matchPath('/employee-dashboard', activePath) || (id != undefined && profileCookie?.employee_id == id)) ? 'activeMenu' : ''}>
            Employee
        </li>
        {
            cookies.get('role', { secure: true, sameSite:'none' }) ==  true ? 
            
            <li onClick={() => { navigate('/manager-dashboard') }} className={(matchPath('/manager-dashboard', activePath) || matchPath('/profile/:id', activePath) || (id != undefined && profileCookie.employee_id != id)) ? 'activeMenu' : ''}>
                Manager
            </li>
            :""
        }
        {
            cookies.get('admin', { secure: true, sameSite:'none' }) ==  true ? 
             <li 
             onClick={
                () => { navigate('/admin-dashboard') }
            } 
            className={
                matchPath('/admin-dashboard', activePath) || matchPath('/admin/profile/:id', activePath)
                ? 'activeMenu' : ''
                }
            >
             Administrator
         </li>
         :''
        }
        </>
        )
    }
    return (
        <>
            <div className="right-menu">
                <ul>
                    {
                        menuList !== null ?
                        menuList?.map(
                            (item, index) =>
                            (cookies.get('role', { secure: true, sameSite:'none' }) !=  true && item.name == 'Manager') ?
                            '':
                            <li key={index} onClick={() => { navigate(`/${item.value}`) }} className={(matchPath(`/${item.value}`, activePath) || (id != undefined && profileCookie?.employee_id == id)) ? 'activeMenu' : ''}>
                                    {item.name}
                                </li>
                            )
                            :
                            renderExtraMenu()
                    }
                           
                </ul>
            </div>
            {!!openLogoutFailed &&
            <LogoutPopup
                openLogoutFailed={openLogoutFailed}
                setOpenLogoutFailed={setOpenLogoutFailed}
                navigate={navigate} 
                cookies={cookies}/>
            }
        </>

    );
}
