import {Dimensions} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const {width, height} = Dimensions.get('screen');
const safeTopPadding = StaticSafeAreaInsets.safeAreaInsetsTop;
const safeBottomPadding = StaticSafeAreaInsets.safeAreaInsetsBottom;
const safeLeftPadding = StaticSafeAreaInsets.safeAreaInsetsLeft;
const safeRightPadding = StaticSafeAreaInsets.safeAreaInsetsRight;

export const Metrics = {
    width,
    height,
    safeTopPadding,
    safeBottomPadding,
    safeLeftPadding,
    safeRightPadding,
};
