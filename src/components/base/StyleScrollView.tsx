import {useTabBar} from 'navigation/config/TabBarProvider';
import React, {ReactNode} from 'react';
import {ScrollViewProps} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

interface StyleScrollViewProps extends ScrollViewProps {
    children?: ReactNode;
}

let offsetY = 0;

const StyleScrollView = (props: StyleScrollViewProps) => {
    const {children} = props;
    const {setShowTabBar} = useTabBar();

    return (
        <ScrollView
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
                const newOffset = nativeEvent.contentOffset.y;
                offsetY < newOffset
                    ? setShowTabBar(false)
                    : setShowTabBar(true);
                offsetY = newOffset;
            }}
            {...props}>
            {children}
        </ScrollView>
    );
};

export default StyleScrollView;
