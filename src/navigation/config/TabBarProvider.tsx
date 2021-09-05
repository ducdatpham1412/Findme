import React, {createContext, useContext, useState} from 'react';

export const TabBarContext = createContext<any>(0);

const TabBarProvider = ({children}: any) => {
    const [showTabBar, setShowTabBar] = useState(true);
    // set disable is only use for press MessButton
    const [disableTabBar, setDisableTabBar] = useState(false);

    return (
        <TabBarContext.Provider
            value={{
                showTabBar,
                setShowTabBar,
                disableTabBar,
                setDisableTabBar,
            }}>
            {children}
        </TabBarContext.Provider>
    );
};

interface TabBarType {
    showTabBar: boolean;
    setShowTabBar: any;
    disableTabBar: boolean;
    setDisableTabBar: any;
}
export const useTabBar = (): TabBarType => useContext(TabBarContext);

export default TabBarProvider;
