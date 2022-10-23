import {TypeGetProfileResponse} from 'api/interface';
import {SESSION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {getSessionOfDay} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';

const {safeTopPadding} = Metrics;

interface Props {
    theme: TypeTheme;
    profile: TypeGetProfileResponse;
    onPressFilterIcon(): void;
}

class HeaderDoffy extends Component<Props> {
    opacity = new Animated.Value(0);

    setOpacity(value: number) {
        this.opacity.setValue(value);
    }

    shouldComponentUpdate(nextProps: Props) {
        if (
            nextProps.theme.backgroundColor !== this.props.theme.backgroundColor
        ) {
            return true;
        }
        if (!isEqual(nextProps.profile, this.props.profile)) {
            return true;
        }
        return false;
    }

    render() {
        const {theme, profile} = this.props;
        const session = getSessionOfDay();
        let textSession: I18Normalize = 'discovery.goodMorning';
        if (session === SESSION.afternoon) {
            textSession = 'discovery.goodAfternoon';
        } else if (session === SESSION.evening) {
            textSession = 'discovery.goodEvening';
        }

        return (
            <View style={styles.container}>
                <Animated.View
                    style={{
                        backgroundColor: theme.backgroundColor,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: this.opacity,
                    }}
                />
                <View style={styles.headerView}>
                    <View style={styles.toolLeftView}>
                        <StyleIcon
                            source={{uri: profile.avatar}}
                            size={30}
                            customStyle={styles.avatar}
                        />
                        <View>
                            <StyleText
                                i18Text={textSession}
                                customStyle={[
                                    styles.textHello,
                                    {color: Theme.common.gradientTabBar2},
                                ]}
                                numberOfLines={1}
                            />
                            <StyleText
                                originValue={profile.name}
                                customStyle={styles.doffyText}
                                numberOfLines={1}
                            />
                        </View>
                    </View>

                    <View style={styles.toolRightView}>
                        <StyleTouchable
                            onPress={() => navigate(ROOT_SCREEN.chatRoute)}
                            hitSlop={10}
                            customStyle={[
                                styles.filterBox,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}>
                            <StyleIcon
                                source={Images.icons.chat}
                                customStyle={[
                                    styles.iconCategory,
                                    {tintColor: theme.textHightLight},
                                ]}
                                size={15}
                            />
                        </StyleTouchable>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    imageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
    },
    avatar: {
        borderRadius: '20@ms',
        marginRight: '10@s',
    },
    textHello: {
        fontSize: FONT_SIZE.small,
    },
    doffyText: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.gradientTabBar1,
    },
    toolLeftView: {
        flexDirection: 'row',
        maxWidth: '70%',
        alignItems: 'center',
    },
    toolRightView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    iconCategory: {
        tintColor: Theme.common.gradientTabBar2,
    },
    filterBox: {
        padding: '8@ms',
        borderRadius: '10@ms',
    },
    headerView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: '40@vs',
        justifyContent: 'space-between',
        paddingHorizontal: '15@s',
        marginTop: safeTopPadding,
    },
});

export default HeaderDoffy;
