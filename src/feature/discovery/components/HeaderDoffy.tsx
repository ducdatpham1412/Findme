import Images from 'asset/img/images';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {MAIN_SCREEN} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';

export const headerDoffyHeight = verticalScale(40);

interface Props {
    onPressFilter(): void;
    theme: TypeTheme;
}

export class HeaderDoffy extends Component<Props> {
    render() {
        const {theme, onPressFilter} = this.props;

        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.backgroundColor,
                        borderBottomColor: theme.holderColor,
                    },
                ]}>
                <StyleText originValue="DOFFY" customStyle={styles.doffyText} />
                <View style={styles.toolRightView}>
                    <StyleTouchable
                        onPress={() => navigate(MAIN_SCREEN.reputation)}
                        hitSlop={10}
                        customStyle={styles.messageBox}>
                        <StyleIcon
                            source={Images.icons.reputation}
                            customStyle={styles.iconCategory}
                            size={23}
                        />
                    </StyleTouchable>
                    <StyleTouchable onPress={onPressFilter} hitSlop={10}>
                        <StyleIcon
                            source={Images.icons.category}
                            customStyle={styles.iconCategory}
                            size={18}
                        />
                    </StyleTouchable>
                </View>
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: headerDoffyHeight,
        borderBottomWidth: Platform.select({
            ios: '0@ms',
            android: '0@ms',
        }),
        paddingHorizontal: '20@s',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    doffyText: {
        fontSize: '18@ms',
        fontWeight: 'bold',
        color: Theme.common.gradientTabBar1,
    },
    toolRightView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    messageBox: {
        marginRight: '15@s',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: '10@ms',
    },
    iconCategory: {
        tintColor: Theme.common.gradientTabBar2,
    },
});

export default HeaderDoffy;
