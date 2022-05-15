import {TypeCreateGroupResponse} from 'api/interface';
import {apiDeleteGroup} from 'api/module';
import Redux from 'hook/useRedux';
import {appAlert, appAlertYesNo, goBack} from 'navigation/NavigationService';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import BubbleGroup from './BubbleGroup';

interface Props {
    listGroups: Array<TypeCreateGroupResponse>;
    setListGroups: Function;
}

const ListMyGroups = (props: Props) => {
    const {listGroups, setListGroups} = props;
    const isModeExp = Redux.getModeExp();

    const onDeleteAGroupFromList = (bubbleId: string) => {
        const agreeDelete = async () => {
            try {
                Redux.setIsLoading(true);
                if (!isModeExp) {
                    await apiDeleteGroup(bubbleId);
                }
                setListGroups((preValue: Array<TypeCreateGroupResponse>) => {
                    return preValue.filter(item => item.id !== bubbleId);
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        };

        appAlertYesNo({
            i18Title: 'profile.screen.confirmDeleteGroup',
            agreeChange: agreeDelete,
            refuseChange: goBack,
            touchOutBack: false,
        });
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    {listGroups.map(item => (
                        <BubbleGroup
                            item={item}
                            onDeleteAGroupFromList={onDeleteAGroupFromList}
                        />
                    ))}
                </View>
            </ScrollView>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        maxHeight: '400@vs',
        alignSelf: 'center',
    },
    body: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});

export default ListMyGroups;
