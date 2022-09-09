import {TypeGradient} from 'api/interface';
import {
    TypeGetTopReviewerResponse,
    TypeItemTopReviewer,
} from 'api/interface/reputation';
import {apiGetTopReviewers} from 'api/module';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import AvatarBackground from 'feature/profile/components/AvatarBackground';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {onGoToProfile} from 'utility/assistant';

const renderItem = (
    item: TypeItemTopReviewer,
    index: number,
    gradient: TypeGradient,
) => {
    let gradientColor = gradient.talking;
    let isTop = false;
    if (index === 0) {
        gradientColor = gradient.travel;
        isTop = true;
    } else if (index === 1) {
        gradientColor = gradient.technology;
        isTop = true;
    } else if (index === 2) {
        gradientColor = gradient.other;
        isTop = true;
    }

    return (
        <StyleTouchable
            customStyle={styles.itemContainer}
            onPress={() => onGoToProfile(item.creator)}>
            <LinearGradient
                style={styles.gradientBackground}
                colors={gradientColor}
            />
            <StyleImage
                source={{uri: item.creatorAvatar}}
                customStyle={styles.avatar}
            />
            <View style={styles.nameTrustBox}>
                <StyleText
                    originValue={item.creatorName}
                    customStyle={[styles.textName, {color: Theme.common.white}]}
                    numberOfLines={1}
                />
                <StyleText
                    originValue={`${item.reputation} Trust Point`}
                    customStyle={[styles.textNumberTrust]}
                />
            </View>
            <View style={[styles.rightBox, {borderWidth: isTop ? 1 : 0}]}>
                <StyleText
                    originValue={isTop ? index + 1 : ''}
                    customStyle={styles.textTop}
                />
            </View>
        </StyleTouchable>
    );
};

const ReputationScreen = () => {
    const {imageBackground, gradient} = Redux.getResource();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<TypeGetTopReviewerResponse>({
        list: [],
        myIndex: 0,
    });

    const getData = async () => {
        try {
            setIsLoading(true);
            const res = await apiGetTopReviewers();
            setData(res.data);
        } catch (err) {
            appAlert(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={styles.container}>
            <ViewSafeTopPadding />
            <AvatarBackground avatar={imageBackground} />
            <View style={styles.headerView}>
                <StyleText
                    i18Text="reputation.topReviewer"
                    customStyle={styles.textHeader}
                />
            </View>

            <View style={styles.myRankView}>
                <FontAwesome5 name="medal" style={styles.iconMedal} />
                <StyleText
                    i18Text="reputation.yourRank"
                    i18Params={{
                        value: 10,
                    }}
                    customStyle={styles.textRank}
                />
            </View>

            <View style={styles.listView}>
                <StyleList
                    data={data.list}
                    renderItem={({item, index}) =>
                        renderItem(item, index, gradient)
                    }
                    keyExtractor={item => item.id}
                    refreshing={isLoading}
                    onRefresh={getData}
                />
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    headerView: {
        width: '100%',
        paddingVertical: '5@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderBottomColor: Theme.lightTheme.borderColor,
        alignItems: 'center',
    },
    textHeader: {
        fontSize: '17@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    myRankView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '10@vs',
        left: '20@s',
    },
    iconMedal: {
        fontSize: '15@ms',
        color: Theme.darkTheme.highlightColor,
        marginRight: '5@s',
    },
    textRank: {
        fontSize: '12@ms',
        color: Theme.common.white,
    },
    listView: {
        flex: 1,
        paddingHorizontal: '40@s',
    },
    itemContainer: {
        width: '100%',
        borderRadius: '30@ms',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '17@vs',
    },
    gradientBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    avatar: {
        width: '40@s',
        height: '40@s',
        marginLeft: '15@s',
        marginVertical: '5@vs',
        borderRadius: '20@s',
    },
    nameTrustBox: {
        flex: 1,
        paddingHorizontal: '10@s',
    },
    textName: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    textNumberTrust: {
        fontSize: '10@ms',
        marginTop: '5@vs',
        color: Theme.common.white,
    },
    rightBox: {
        marginRight: '15@s',
        width: '30@s',
        height: '30@s',
        borderWidth: '1@ms',
        borderColor: Theme.common.white,
        borderRadius: '15@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTop: {
        fontSize: '13@ms',
        color: Theme.common.textMe,
    },
});

export default ReputationScreen;
