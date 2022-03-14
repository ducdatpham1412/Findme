import {Dimensions} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {isIOS} from 'utility/assistant';

const {width, height} = Dimensions.get('screen');
const safeTopPadding = isIOS ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
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
