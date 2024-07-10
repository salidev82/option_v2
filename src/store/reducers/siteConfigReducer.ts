// siteConfigReducer.js
const initialState = {
    isAutoUpdate: false,
};

const siteConfigReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'TOGGLE_CHECKBOX':
            return {
                ...state,
                isAutoUpdate: !state.isAutoUpdate,
            };
        default:
            return state;
    }
};

export default siteConfigReducer;