import { configureStore } from "@reduxjs/toolkit";
import { engagementCategorySlice } from "./engagement/reducer/engagementPillars";
import { trendsSlice } from "./engagement/reducer/trendsGraphList";
import { trackingSlice } from "./engagement/reducer/changeTrackingList";
import { managerNotificationSlice } from "./engagement/reducer/managerNotificationList";
import { adminNotificationSlice } from "./engagement/reducer/adminNotificationList";
import { teamsAuthStatusSlice } from "./engagement/reducer/teamsAuthStatusList";
import { teamsLoginStatusSlice } from "./engagement/reducer/teamsLoginStatusList";
import { graphProfileUrlSlice } from "./engagement/reducer/graphProfileUrl";
import { adminEmployeesCardListSlice } from "./engagement/reducer/adminEmployeesList";
export const store = configureStore({
    reducer: {
        engagementCategory : engagementCategorySlice.reducer,
        trendGraphs : trendsSlice.reducer,
        changeTracking : trackingSlice.reducer,
        managerNotification : managerNotificationSlice.reducer,
        adminNotification : adminNotificationSlice.reducer,
        teamsAuthStatus : teamsAuthStatusSlice.reducer,
        teamsAuthClient : teamsAuthStatusSlice.reducer,
        teamsLoginStatus : teamsLoginStatusSlice.reducer,
        engagementCategoryScore : engagementCategorySlice.reducer,
        graphProfileUrl : graphProfileUrlSlice.reducer,
        adminEmployeesCardList : adminEmployeesCardListSlice.reducer
    }
})

export const RootState = store.getState;
export const AppDispatch = store.dispatch;