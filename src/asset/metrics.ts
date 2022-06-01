import {Dimensions} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const {width, height} = Dimensions.get('screen');
const safeTopPadding = StaticSafeAreaInsets.safeAreaInsetsTop;
const safeBottomPadding = StaticSafeAreaInsets.safeAreaInsetsBottom;
const safeLeftPadding = StaticSafeAreaInsets.safeAreaInsetsLeft;
const safeRightPadding = StaticSafeAreaInsets.safeAreaInsetsRight;
const contentSafeTop = safeTopPadding + moderateScale(45); // 45 is height of tab bar up
const tabBarUp = moderateScale(45);

export const Metrics = {
    width,
    height,
    safeTopPadding,
    safeBottomPadding,
    safeLeftPadding,
    safeRightPadding,
    contentSafeTop,
    tabBarUp,
};
