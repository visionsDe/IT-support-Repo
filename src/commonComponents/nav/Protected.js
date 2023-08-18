import React, { useEffect, useContext, useState } from 'react';

import { useTeams } from "msteams-react-base-component";

import { Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import { TeamsUserContext } from '../../index';


const Protected = ({ role }) => {
    let user,auth;
    useEffect(()=>{
        if(Cookie.get('token', { secure: true, sameSite:'none' }) != ""){
            <Navigate to='/login' />
        }
    },[]);
    if(role == "admin"){
        user =  (Cookie.get('admin', { secure: true, sameSite:'none' }) != "" && Cookie.get('admin', { secure: true, sameSite:'none' }) == true) ? 'admin' : false;

        auth = Cookie.get('token', { secure: true, sameSite:'none' }) != "" ? true : false;
    }else{
        user = Cookie.get('role', { secure: true, sameSite:'none' }) != "" ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? 'manager' : 'employee') : false;

        auth = Cookie.get('token', { secure: true, sameSite:'none' }) != "" ? true : false;
    }
   
    
    return(auth ? ( user == role ? <Outlet /> : <Navigate to='/login' /> ) : <Navigate to='/login' />)
}

export const LoginRoute = ({currentUser}) => {
    const appInfo = useContext(TeamsUserContext);
    const { pathname } = useLocation();
    const [{ inTeams, theme }] = useTeams({});
    const [outsideTeams, setOutsideTeams] = useState(false);
    const [count, setCount] = useState(0);
    const user = Cookie.get('role', { secure: true, sameSite:'none' }) != undefined && Cookie.get('role', { secure: true, sameSite:'none' }) != '' ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? 'manager' : 'employee') : false;
    const authToken = Cookie.get('token', { secure: true, sameSite:'none' });

    useEffect(() => {
        if (inTeams != true && inTeams != undefined) {
            setOutsideTeams(true);
        } 
    }, [inTeams]);


        const runRouteCondition = (info) => {
            const user = Cookie.get('role', { secure: true, sameSite:'none' }) != undefined && Cookie.get('role', { secure: true, sameSite:'none' }) != '' ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? 'manager' : 'employee') : false;
            const authToken = Cookie.get('token', { secure: true, sameSite:'none' });
            const admin = Cookie.get('admin', { secure: true, sameSite:'none' });
            let navigationURL;
                if(authToken != undefined && authToken != '' && user != false){
                    if(admin == false){
                        if(user === 'manager'){
                          navigationURL = info == 'recognition' ? "/recognition/manager-dashboard": "/manager-dashboard";
                        }
                        else if(user === 'employee'){
                            navigationURL = info == 'recognition' ? "/recognition/employee-dashboard": "/employee-dashboard";
                        }
                        else{
                            navigationURL = '/login';
                        }
                      }else{
                        if(user === 'manager'){
                          navigationURL = info == 'recognition' ? "/recognition/manager-dashboard": "/admin-dashboard";
                        }
                        else if(user === 'employee'){
                            navigationURL = info == 'recognition' ? "/recognition/employee-dashboard": "/admin-dashboard";
                        }
                        else{
                            navigationURL = '/login';
                        }
                    }
                    return <Navigate to={navigationURL} />
                }
                else{
                    return <Outlet />
                }
        };
        if(outsideTeams){
            return <Navigate to="/error" />
        }
        return appInfo != null && runRouteCondition(appInfo?.page?.id);
    }
export const AuthGuard = () =>{
const appInfo = useContext(TeamsUserContext);
const {pathname} = useLocation();
const [{ inTeams, theme }] = useTeams({});
const [getNavigation, setNavigation] = useState(null);
const [outsideTeams, setOutsideTeams] = useState(false);
let auth = Cookie.get('token', { secure: true, sameSite:'none' });
let role = Cookie.get('role', { secure: true, sameSite:'none' });
useEffect(() => {
    if (inTeams != true && inTeams != undefined) {
        setOutsideTeams(true);
    } 
}, [inTeams]);
if(outsideTeams && ( process.env.NODE_ENV == 'production')){
    return <Navigate to="/error" />
}    
    const runRouteCondition = (info) => {
        const user = Cookie.get('role', { secure: true, sameSite:'none' }) != undefined && Cookie.get('role', { secure: true, sameSite:'none' }) != '' ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? 'manager' : 'employee') : false;
        const authToken = Cookie.get('token', { secure: true, sameSite:'none' });
            if(authToken != undefined && authToken != '' && user != false){
                if(user === 'manager'){
                    return <Outlet />
                }
                else if(user === 'employee'){
                    return <Outlet />
                }
                else{
                    return <Outlet />
                }
            }
            else{
                return <Navigate to='/login' />
            }
    }
    return appInfo != null && runRouteCondition(appInfo?.page?.id);
}
export default Protected;