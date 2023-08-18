import recognitionSendRequestAction, { recognitionGetRequestAction, recognitionPutRequestAction } from "./actions/recognitionRequestAction";
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import { colorPalette } from "../engagement/helper/helper";

const teamsfx1 = new TeamsFx();
const graphClient = createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]);
export function truncateString(str,limit) {
    return str?.length > limit ? str.substring(0, limit) + "..." : str;
}

const recognitionUpdateTargetEmployeeList = async (data) => {
  try{
     let result = await data?.map(async(item) => {
    let employeeList = await recognitionGetRequestAction(`recmodule/targetdetail/${item?.target_id}`);
      return {...item, empList:employeeList}
    });
    return Promise.all(result);
  }catch(error){
    
  }
 
}
export const utilsRecognitionGetTargetCardList = async(url) => {
    try{
        let getTargetList = await recognitionGetRequestAction(url);
        return Promise.all(getTargetList);
    }catch(error){

    }
};

export const utilsRecognitionDeleteTargetCardItem = async(itemId = null) => {
    try{
        let getTargetList = await recognitionSendRequestAction(`recmodule/targetdelete/${itemId}`,null,'true');
        return getTargetList;
    }catch(error){
      
    }
};

export const utilsRecognitionDeleteEmployeeTargetCardItem = async(target_id,employee_id) => {
  try{
    let addEmployeeTargetList = await recognitionSendRequestAction(`recmodule/targetdelete/${target_id}`,null,'true');
    return addEmployeeTargetList;
  }catch(error){
   
  }
}
export const utilsRecognitionAddEmployeeTargetCardItem = async(data,target_id) => {
  try{
    let addEmployeeTargetList = await recognitionSendRequestAction(`/recmodule/target/${target_id}`,data,'true');
    return addEmployeeTargetList;
  }catch(error){

  }
}


export const utilsRecognitionUpdateValuesTargetCardItem = async(itemId = null, data) => {
  try{
    let updateValuesTargetList = await recognitionSendRequestAction(`/recmodule/target/${itemId}`,data,'true');
    return updateValuesTargetList;
  }catch(error){

  }
}

export const utilsGetBlobImage = async (value) => {
  try{
    let result = await graphClient.api(`users/${value}/photo/$value`).get();
    if(result != ''){
      return URL.createObjectURL(result);
    }else{
      return null
    }
  }catch(err){
    return null
  }
}

export const utilsConvertGraphImageToBlob = async (items) => {
  let values = items?.map(async (item,index) => {
  let indexColor = index % colorPalette?.length;
  let sourceImage = (item?.ms_username != undefined && item?.ms_username != "" && item?.ms_username != null && item?.src == undefined ) ?  await utilsGetBlobImage(item?.ms_username) : null;
    return {...item, "src" : sourceImage,"colorPalette":colorPalette[indexColor]?.name}
  });
    return Promise.all(values);
}