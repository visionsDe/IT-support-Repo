import { trendGraphListAPI } from '../service/trendGraph'
export const getTrendGraphAction = async (url) => {
    const response = await trendGraphListAPI(url);
    return response;
}