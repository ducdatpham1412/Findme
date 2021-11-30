import {Metrics} from 'asset/metrics';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React, {ReactNode} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isIOS} from 'utility/assistant';

interface HeaderProps {
    headerTitle: string;
    headerTitleMission?(): any;

    headerLeft?: any;
    headerLeftMission?(): any;

    // Header right
    // From left to right
    headerRight1?: ReactNode;
    headerRight1Mission?(): any;

    headerRight2?: ReactNode;
    headerRight2Mission?(): any;

    headerRight3?: ReactNode;
    headerRight3Mission?(): any;

    // other props
    containerStyle?: StyleProp<ViewStyle>;
    headerTitleStyle?: StyleProp<TextStyle>;
}

const Header = (props: HeaderProps) => {
    const theme = Redux.getTheme();
    const {
        headerTitle,
        headerTitleMission,
        headerLeftMission,
        headerLeft,
        headerRight1,
        headerRight1Mission,
        headerRight2,
        headerRight2Mission,
        headerRight3,
        headerRight3Mission,
        containerStyle,
        headerTitleStyle,
    } = props;

    return (
        <View
            style={[
                styles.container,
                {borderBottomColor: theme.borderColor},
                containerStyle,
            ]}>
            {/* Header left */}
            <StyleTouchable
                customStyle={styles.headerLeftView}
                onPress={headerLeftMission || goBack}>
                {headerLeft}
                {headerLeft === undefined && (
                    <AntDesign
                        name="left"
                        style={[styles.iconLeft, {color: theme.textColor}]}
                    />
                )}
            </StyleTouchable>

            {/* Header title */}
            <StyleTouchable
                customStyle={styles.headerTitleView}
                disable={!headerTitleMission}
                onPress={headerTitleMission}
                disableOpacity={1}>
                <StyleText
                    i18Text={headerTitle}
                    customStyle={[
                        styles.headerTitle,
                        {color: theme.borderColor},
                        headerTitleStyle,
                    ]}
                    numberOfLines={1}
                />
            </StyleTouchable>

            {/* Header Right
                Contain three children part, 1->3, left -> right respect
            */}
            <View style={styles.headerRightBox}>
                {/* ONE */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        // {backgroundColor: 'lightgreen'},
                    ]}
                    onPress={headerRight1Mission}>
                    {headerRight1}
                </StyleTouchable>

                {/* TWO */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        // {backgroundColor: 'lightblue'},
                    ]}
                    onPress={headerRight2Mission}>
                    {headerRight2}
                </StyleTouchable>

                {/* THREE */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        // {backgroundColor: 'lightpink'},
                    ]}
                    onPress={headerRight3Mission}>
                    {headerRight3}
                </StyleTouchable>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '35@vs',
        // paddingRight: '10@s',
        paddingHorizontal: '7@s',
        borderBottomWidth: isIOS ? 0.25 : 0.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    // icon view
    headerLeftView: {
        height: '100%',
        justifyContent: 'center',
        paddingRight: '10@s',
    },
    iconLeft: {
        fontSize: '20@ms',
    },
    // title view
    headerTitleView: {
        width: Metrics.width / 2.2,
        height: '100%',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },
    // header right view
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    headerRightElement: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Header;
