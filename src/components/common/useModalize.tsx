import {Metrics} from 'asset/metrics';
import {StyleTouchable} from 'components/base';
import ROOT_SCREEN from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {ReactNode, useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface ModalizeProps {
    route: {
        params: {
            children: ReactNode;
        };
    };
}

interface ParamsModalize {
    children?: ReactNode;
}

const Modalize = ({route}: ModalizeProps) => {
    const {children} = route.params;

    const scale = useRef(new Animated.Value(0)).current;
    const translateY = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [Metrics.width / 2, 0],
    });

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    }, []);

    return (
        <StyleTouchable customStyle={styles.container} onPress={goBack}>
            <Animated.View style={[styles.boxIn, {transform: [{translateY}]}]}>
                {children}
            </Animated.View>
        </StyleTouchable>
    );
};

export const useModalize = () => {
    const show = (params?: ParamsModalize) => {
        navigate(ROOT_SCREEN.modalize, {
            children: params?.children,
        });
    };

    const dismiss = () => {
        goBack();
    };

    return {
        show,
        dismiss,
    };
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    boxIn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Modalize;
