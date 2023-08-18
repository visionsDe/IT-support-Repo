import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { getEmployeeProfileAction } from "../engagement/actions/engagement";
const cookies = new Cookies();
export const utilGetEmployeeProfile = async () => {
    let value = await getEmployeeProfileAction('emp/profile');
    if (value) {
        await cookies.set('userProfile', JSON.stringify(value), { secure: true, sameSite: 'none' });
        return Promise.resolve(value);
    }
    return Promise.reject(null);
}

