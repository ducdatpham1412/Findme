import {TypeGroupBuying} from 'api/interface';
import {GROUP_BUYING_STATUS, RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, ratioImageGroupBuying} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import {SharedElement} from 'react-navigation-shared-element';
import {
    formatDayGroupBuying,
    formatFromNow,
    formatLocaleNumber,
} from 'utility/format';
import Entypo from 'react-native-vector-icons/Entypo';
import {onGoToProfile} from 'utility/assistant';

interface Props {
    listPaging: any;
    isInProfileTab: boolean;
}

const ListGroupBuyingJoined = (props: Props) => {
    const {listPaging, isInProfileTab} = props;
    const theme = Redux.getTheme();

    const detailGroupTarget = isInProfileTab
        ? PROFILE_ROUTE.detailGroupBuying
        : ROOT_SCREEN.detailGroupBuying;

    const ButtonCheckJoined = useCallback(
        (item: TypeGroupBuying) => {
            if (item.relationship === RELATIONSHIP.self) {
                return null;
            }
            if (item.status === GROUP_BUYING_STATUS.bought) {
                return (
                    <LinearGradient
                        style={styles.boughtBox}
                        colors={[
                            Theme.common.commentGreen,
                            Theme.common.gradientTabBar2,
                        ]}>
                        <Entypo name="check" style={styles.iconBought} />
                        <StyleText
                            i18Text="discovery.bought"
                            customStyle={styles.textBought}
                        />
                    </LinearGradient>
                );
            }
            if (
                [
                    GROUP_BUYING_STATUS.notJoined,
                    GROUP_BUYING_STATUS.joinedNotBought,
                ].includes(item.status)
            ) {
                const isJoined =
                    item.status === GROUP_BUYING_STATUS.joinedNotBought;
                return (
                    <StyleTouchable
                        customStyle={[
                            styles.joinGroupBuyingBox,
                            {
                                backgroundColor: isJoined
                                    ? theme.highlightColor
                                    : theme.backgroundButtonColor,
                            },
                        ]}
                        onPress={() =>
                            navigate(detailGroupTarget, {
                                item,
                                setList: listPaging.setList,
                            })
                        }>
                        <StyleText
                            i18Text={
                                isJoined
                                    ? 'discovery.joined'
                                    : 'discovery.joinGroupBuying'
                            }
                            customStyle={[
                                styles.textTellJoin,
                                {
                                    color: isJoined
                                        ? theme.backgroundColor
                                        : theme.textHightLight,
                                    fontWeight: isJoined ? 'bold' : 'normal',
                                },
                            ]}
                        />
                    </StyleTouchable>
                );
            }

            return null;
        },
        [theme.holderColor],
    );

    return (
        <View style={styles.container}>
            {listPaging.list.map((item: TypeGroupBuying) => {
                const lastPrice = item.prices[item.prices.length - 1];
                return (
                    <StyleTouchable
                        key={item.id}
                        style={[
                            styles.itemView,
                            {backgroundColor: theme.backgroundColor},
                        ]}
                        onPress={() =>
                            navigate(detailGroupTarget, {
                                item,
                                setList: listPaging.setList,
                            })
                        }>
                        {/* Image preview */}
                        <SharedElement
                            style={styles.imagePreview}
                            id={`item.group_buying.${item.id}`}>
                            <StyleImage
                                source={{uri: item.images[0]}}
                                customStyle={styles.imagePreview}
                            />
                            <View style={styles.linearOverlay}>
                                <LinearGradient
                                    style={[
                                        styles.linearOverlay,
                                        {opacity: 0.7},
                                    ]}
                                    colors={['black', 'transparent']}
                                    start={{x: 0, y: 1}}
                                    end={{x: 0.8, y: 1}}
                                />
                                <StyleTouchable
                                    customStyle={styles.creatorView}
                                    onPress={() => onGoToProfile(item.creator)}>
                                    <StyleIcon
                                        source={{uri: item.creatorAvatar}}
                                        size={30}
                                        customStyle={styles.avatar}
                                    />
                                    <View style={styles.nameCreated}>
                                        <StyleText
                                            originValue={item.creatorName}
                                            numberOfLines={1}
                                            customStyle={styles.textName}
                                        />
                                        <StyleText
                                            originValue={formatFromNow(
                                                item.created,
                                            )}
                                            customStyle={styles.textCreated}
                                        />
                                    </View>
                                </StyleTouchable>
                            </View>

                            <View style={styles.numberPeopleView}>
                                <StyleIcon
                                    source={Images.icons.createGroup}
                                    size={20}
                                    customStyle={styles.iconNumberPeople}
                                />
                                <StyleText
                                    originValue={item.totalJoins}
                                    customStyle={styles.textNumberPeople}
                                />
                            </View>
                        </SharedElement>

                        {/* Content */}
                        <StyleText
                            originValue={item.content}
                            customStyle={[
                                styles.textContent,
                                {color: theme.textHightLight},
                            ]}
                            numberOfLines={1}
                        />
                        <View style={styles.contentView}>
                            <View style={{flex: 1}}>
                                <View style={styles.infoView}>
                                    <StyleIcon
                                        source={Images.icons.deadline}
                                        size={15}
                                    />
                                    <StyleText
                                        originValue={formatDayGroupBuying(
                                            item.deadlineDate,
                                        )}
                                        customStyle={[
                                            styles.textInfo,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                </View>
                                <View style={styles.infoView}>
                                    <StyleIcon
                                        source={Images.icons.dollar}
                                        size={15}
                                    />
                                    <StyleText
                                        originValue={`${lastPrice.number_people}`}
                                        customStyle={[
                                            styles.textInfo,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                    <StyleText
                                        originValue=" - "
                                        customStyle={[
                                            styles.textInfo,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                    <StyleText
                                        originValue={`${formatLocaleNumber(
                                            lastPrice.value,
                                        )}vnd`}
                                        customStyle={[
                                            styles.textInfo,
                                            {color: theme.highlightColor},
                                        ]}
                                    />
                                </View>
                            </View>
                            {ButtonCheckJoined(item)}
                        </View>
                    </StyleTouchable>
                );
            })}
        </View>
    );
};

const {width} = Metrics;
const styles = ScaledSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    itemView: {
        width: width * 0.8,
        marginVertical: '10@vs',
        borderRadius: '5@ms',
    },
    imagePreview: {
        width: '100%',
        height: width * 0.8 * ratioImageGroupBuying,
        borderTopLeftRadius: '5@ms',
        borderTopRightRadius: '5@ms',
    },
    linearOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '5@ms',
        borderTopRightRadius: '5@ms',
    },
    creatorView: {
        position: 'absolute',
        left: '5@s',
        top: '5@s',
        flexDirection: 'row',
    },
    avatar: {
        borderRadius: '30@ms',
    },
    nameCreated: {
        flex: 1,
        maxWidth: '100@s',
        marginLeft: '5@s',
    },
    textName: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    textCreated: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.grayLight,
    },
    numberPeopleView: {
        position: 'absolute',
        bottom: '5@s',
        left: '5@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconNumberPeople: {
        tintColor: Theme.common.white,
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '5@s',
    },
    // content
    contentView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContent: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
        marginVertical: '5@vs',
    },
    infoView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '10@s',
        marginVertical: '5@vs',
        alignItems: 'center',
    },
    textInfo: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        marginLeft: '8@s',
    },
    boughtBox: {
        marginRight: '10@s',
        padding: '5@ms',
        borderRadius: '20@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBought: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
    textBought: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '3@s',
    },
    joinGroupBuyingBox: {
        marginRight: '5@s',
        paddingHorizontal: '10@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    textTellJoin: {
        fontSize: FONT_SIZE.small,
    },
});

export default ListGroupBuyingJoined;
