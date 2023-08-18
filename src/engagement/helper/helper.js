import Cookie from "js-cookie";
import { engagementCategoryCommentsAction, engagementCategoryListAction, engagementCategoryScoreAction } from "../actions/engagement";
import { setEngagementCategory } from "../reducer/engagementPillars";
export const AuthGuard = ({type}) =>{
    return Cookie.get('token', { secure: true, sameSite:'none' }) != undefined ? (type == 'manager' ? (Cookie.get('role', { secure: true, sameSite:'none' }) ==  true ? true : false) : true ) : false;
}
export default AuthGuard;


const getLatestValue = (element, find) => {
    if (element.length > 0) {
      let record = element.filter((type) => find != null && type.engagement_category == find);
      if (record.length > 0) {
        let latest = record.map(function(item) { return item.update_time; }).sort().reverse()[0];
        let result = record.find((item) => item.update_time == latest);
        return result;
      }
    }
    return {};
  };
  const getValue = (element,find) => {
    let result = element?.filter(item => item.engagement_category == find)
    return !!result ? result[0] : {}
  }
  

export const updateEngagement = async (dispatch) =>{
    const engagementCategoriesSort = (list,score,comment)=>{
        let record = list?.map((item) => {
          return {...item,comments: getValue(comment,item.code), 
            score: getLatestValue(score,item.code)
          }
        })
        return record;
      }
      
      // == ======== Dispatch Function for Engagement Category List == =======
        let list = await engagementCategoryListAction("category/list");
        let score = await engagementCategoryScoreAction("emp/score");
        let comment = await engagementCategoryCommentsAction("emp/comment");
        if(score){
          let engagementCategories = await engagementCategoriesSort(list,score,comment);
          dispatch(setEngagementCategory(engagementCategories))
        }
}


export const getUTCTime = (date) => {
  let dt;
  if(!!date){
    dt = new Date(new Date(date).getTime());
  }else{
    dt = new Date(new Date().getTime());
    dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
  }
  // var offset = -300; // Timezone offset for EST in minutes.
  var utcDate = new Date(dt.getTime());
  return utcDate;
}

export const colorPalette = [
  {name:'paletteColor1',code:'#CBE8D9'},
  {name:'paletteColor2',code:'#F0D1D1'},
  {name:'paletteColor3',code:'#FCE8BE'},
  {name:'paletteColor4',code:'#CFE9FC'}
];

