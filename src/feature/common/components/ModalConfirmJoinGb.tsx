import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleButton, StyleIcon, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {forwardRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    onConfirm(): void;
    money: string;
}

const ModalConfirmJoinGb = (props: Props, ref: any) => {
    const theme = Redux.getTheme();

    return (
        <Modalize
            ref={ref}
            adjustToContentHeight
            withHandle={false}
            modalStyle={{
                backgroundColor: theme.backgroundColor,
            }}
            childrenStyle={{
                paddingHorizontal: 20,
            }}>
            <StyleIcon
                source={Images.images.squirrelLogin}
                size={50}
                customStyle={styles.icon}
            />
            <StyleText
                i18Text="discovery.titleDeposit"
                customStyle={[styles.textTitle, {color: theme.borderColor}]}
            />
            <StyleText
                i18Text="discovery.theMoneyIs"
                customStyle={[styles.textTitle, {color: theme.textHightLight}]}>
                <StyleText
                    originValue={props.money}
                    customStyle={[
                        styles.textMoney,
                        {color: theme.textHightLight},
                    ]}
                />
            </StyleText>
            <StyleButton
                title="discovery.goToDeposit"
                containerStyle={styles.button}
                onPress={() => props.onConfirm()}
            />
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    icon: {
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    textTitle: {
        fontSize: FONT_SIZE.normal,
        textAlign: 'center',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    textMoney: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    button: {
        marginTop: '20@vs',
        marginBottom: '100@vs',
        paddingVertical: '5@vs',
    },
});

export default forwardRef(ModalConfirmJoinGb);
