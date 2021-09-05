import {Metrics} from 'asset/metrics';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import HeaderLeftIconSmall from 'navigation/components/HeaderLeftIconSmall';
import {goBack} from 'navigation/NavigationService';
import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface HeaderProps {
    headerTitle: string;
    headerTitleMission?(): any;

    headerLeft?: any;
    headerLeftMission?(): any;

    // HEADER RIGHT, NUMBER COUNT FROM LEFT TO RIGHT
    headerRight1?: ReactNode;
    headerRight1Mission?(): any;

    headerRight2?: ReactNode;
    headerRight2Mission?(): any;

    headerRight3?: ReactNode;
    headerRight3Mission?(): any;
}

const Header = (props: HeaderProps) => {
    const theme = Redux.getTheme();
    const {
        headerTitle,
        headerTitleMission,
        headerLeft = <HeaderLeftIconSmall />,
        headerLeftMission,
        headerRight1,
        headerRight1Mission,
        headerRight2,
        headerRight2Mission,
        headerRight3,
        headerRight3Mission,
    } = props;

    return (
        <View
            style={[styles.container, {borderBottomColor: theme.borderColor}]}>
            {/* HEADER LEFT */}
            <StyleTouchable
                customStyle={styles.headerLeft}
                onPress={headerLeftMission || goBack}>
                {headerLeft}
            </StyleTouchable>

            {/* HEADER TITLE */}
            <StyleTouchable
                customStyle={styles.headerTitleBox}
                disable={!headerTitleMission}
                onPress={headerTitleMission}
                disableOpacity={1}>
                <Text style={[styles.headerTitle, {color: theme.borderColor}]}>
                    {headerTitle}
                </Text>
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
        borderBottomWidth: 0.5,
        flexDirection: 'row',
    },

    headerLeft: {
        paddingRight: '10@s',
        alignSelf: 'center',
    },

    headerTitleBox: {
        maxWidth: Metrics.width / 1.5,
        maxHeight: '30@vs',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },

    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: '30@s',
    },
    headerRightElement: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Header;
