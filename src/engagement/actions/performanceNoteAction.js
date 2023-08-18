import { addPerformanceNoteApi } from '../service/userChatListService'

export const addPerformanceNoteAction = async (url , payload) => {
    const response = await addPerformanceNoteApi(url ,payload);
    return response;
}

