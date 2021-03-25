/*eslint-disable react-native/no-inline-styles*/
import {StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import HeaderLeftIconSmall from 'navigation/components/HeaderLeftIconSmall';
import {goBack} from 'navigation/NavigationService';
import React from 'react';
import {ReactNode} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface HeaderProps {
    headerTitle: string;

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

const width = Dimensions.get('screen').width;

const Header = (props: HeaderProps) => {
    const theme = useRedux().getTheme();
    const {
        headerTitle,
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
            <View style={styles.headerTitleBox}>
                <Text style={[styles.headerTitle, {color: theme.borderColor}]}>
                    {headerTitle}
                </Text>
            </View>

            {/* HEADER RIGHT
                CONTAIN THREE CHILDREN PART, 1->3 WITH FROM LEFT TO RIGHT RESPECT
            */}
            <View style={styles.headerRightBox}>
                {/* ONE */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        {backgroundColor: 'lightgreen'},
                    ]}
                    onPress={headerRight1Mission}>
                    {headerRight1}
                </StyleTouchable>

                {/* TWO */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        {backgroundColor: 'lightblue'},
                    ]}
                    onPress={headerRight2Mission}>
                    {headerRight2}
                </StyleTouchable>

                {/* THREE */}
                <StyleTouchable
                    customStyle={[
                        styles.headerRightElement,
                        {backgroundColor: 'lightpink'},
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
        paddingVertical: '10@vs',
        paddingRight: '10@s',
        paddingLeft: '7@s',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
    },

    headerLeft: {
        paddingRight: '10@s',
        alignSelf: 'center',
    },

    headerTitleBox: {
        maxWidth: width / 1.5,
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
        paddingLeft: '10@s',
    },
    headerRightElement: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Header;
