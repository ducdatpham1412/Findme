import {TypePeopleJoinedResponse} from 'api/interface/discovery';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import React, {forwardRef, useCallback} from 'react';
import {Platform, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import {formatFromNow} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import Feather from 'react-native-vector-icons/Feather';
import {appAlert} from 'navigation/NavigationService';
import {apiFollowUser} from 'api/module';
import {apiConfirmUserBought} from 'api/discovery';
import {onGoToProfile} from 'utility/assistant';

const modalHeight = (Metrics.height * 2) / 3;

interface Props {
    postId: string;
    listPaging: any;
}

const ModalPeopleJoined = (props: Props, ref: any) => {
    const {listPaging, postId} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile.id;

    const onPressButton = async (item: TypePeopleJoinedResponse) => {
        const oldList = [...listPaging.list];
        try {
            if (item.relationship === RELATIONSHIP.notFollowing) {
                listPaging.setList(
                    (preValue: Array<TypePeopleJoinedResponse>) => {
                        return preValue.map(value => {
                            if (value.id !== item.id) {
                                return value;
                            }
                            return {
                                ...value,
                                relationship: RELATIONSHIP.following,
                            };
                        });
                    },
                );
                await apiFollowUser(item.creator);
            } else if (item.relationship === RELATIONSHIP.joinedNotBought) {
                listPaging.setList(
                    (preValue: Array<TypePeopleJoinedResponse>) => {
                        return preValue.map(value => {
                            if (value.id !== item.id) {
                                return value;
                            }
                            return {
                                ...value,
                                relationship: RELATIONSHIP.joinedBought,
                            };
                        });
                    },
                );
                await apiConfirmUserBought({
                    post_id: postId,
                    user_id: item.creator,
                });
            }
        } catch (err) {
            appAlert(err);
            listPaging.setList(oldList);
        }
    };

    const RenderItemJoined = useCallback(
        (itemJoined: TypePeopleJoinedResponse) => {
            const name =
                itemJoined.creator === myId
                    ? `(You) ${itemJoined.creatorName}`
                    : itemJoined.creatorName;
            let textButton: I18Normalize = 'common.null';
            let backgroundButton = 'transparent';
            let textColor = 'transparent';

            if (itemJoined.relationship === RELATIONSHIP.notFollowing) {
                textButton = 'profile.screen.follow';
                backgroundButton = theme.backgroundButtonColor;
                textColor = theme.textColor;
            } else if (
                itemJoined.relationship === RELATIONSHIP.joinedNotBought
            ) {
                textButton = 'discovery.confirmBought';
                backgroundButton = theme.backgroundButtonColor;
                textColor = theme.textColor;
            } else if (itemJoined.relationship === RELATIONSHIP.joinedBought) {
                textButton = 'discovery.bought';
                textColor = theme.highlightColor;
            }

            return (
                <View
                    style={[
                        styles.itemJoinedView,
                        {borderBottomColor: theme.holderColorLighter},
                    ]}>
                    <StyleTouchable
                        customStyle={styles.avatarJoined}
                        onPress={() => onGoToProfile(itemJoined.creator)}>
                        <StyleImage
                            source={{uri: itemJoined.creatorAvatar}}
                            customStyle={styles.avatarJoined}
                        />
                    </StyleTouchable>
                    <View style={styles.nameTimeJoinedView}>
                        <StyleText
                            originValue={name}
                            customStyle={[
                                styles.nameJoined,
                                {
                                    color: theme.textHightLight,
                                },
                            ]}
                            numberOfLines={1}
                            onPress={() => onGoToProfile(itemJoined.creator)}
                        />
                        <StyleText
                            originValue={formatFromNow(itemJoined.created)}
                            customStyle={[
                                styles.timeJoined,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonCheckJoined,
                            {backgroundColor: backgroundButton},
                        ]}
                        onPress={() => onPressButton(itemJoined)}>
                        <StyleText
                            i18Text={textButton}
                            customStyle={[
                                styles.textButton,
                                {color: textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            );
        },
        [theme.backgroundColor, postId, myId],
    );

    return (
        <Modalize
            ref={ref}
            withHandle={false}
            modalHeight={modalHeight}
            modalStyle={{
                backgroundColor: 'transparent',
            }}
            overlayStyle={{
                backgroundColor: theme.backgroundOpacity(0.3),
            }}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <View style={styles.headerView}>
                    <StyleText
                        i18Text="discovery.participators"
                        i18Params={{
                            value: listPaging.list.length,
                        }}
                        customStyle={[
                            styles.textHeader,
                            {color: theme.textHightLight},
                        ]}
                    />
                    <StyleTouchable
                        customStyle={styles.iconTurnOffTouch}
                        onPress={() => ref.current?.close()}
                        hitSlop={15}>
                        <Feather
                            name="x"
                            style={[
                                styles.iconTurnOff,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
                <StyleList
                    data={listPaging.list}
                    renderItem={joined => RenderItemJoined(joined.item)}
                    keyExtractor={joined => joined.id}
                    onLoadMore={listPaging.onLoadMore}
                    refreshing={listPaging.refreshing}
                    onRefresh={listPaging.onRefresh}
                />
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: modalHeight,
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    // header
    headerView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '5@vs',
    },
    textHeader: {
        fontSize: FONT_SIZE.normal,
    },
    iconTurnOffTouch: {
        position: 'absolute',
        right: '10@s',
    },
    iconTurnOff: {
        fontSize: '13@ms',
    },
    // item joined
    itemJoinedView: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingVertical: '7.5@vs',
        paddingHorizontal: '10@s',
    },
    avatarJoined: {
        width: '40@s',
        height: '40@s',
        borderRadius: '20@s',
    },
    nameTimeJoinedView: {
        flex: 1,
        paddingHorizontal: '10@s',
    },
    nameJoined: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    timeJoined: {
        fontSize: FONT_SIZE.small,
        marginTop: '3@vs',
    },
    buttonCheckJoined: {
        paddingVertical: '4@vs',
        paddingHorizontal: '15@s',
        borderRadius: '5@ms',
        alignItems: 'center',
    },
    textButton: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
});

export default forwardRef(ModalPeopleJoined);
