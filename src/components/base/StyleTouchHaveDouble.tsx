import React, {Component} from 'react';
import {
    PanResponder,
    StyleProp,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

interface Props extends ViewProps {
    delay?: number;
    radius?: number;
    onDoubleClick?(): any;
    onLongPress?(): void;
    delayLongPress?: number;
    onPressOut?(): void;
    customStyle?: StyleProp<ViewStyle>;
}

class StyleTouchHaveDouble extends Component<Props> {
    myPanResponder: any = {};
    timeOut: any;

    prevTouchInfo = {
        prevTouchTimeStamp: 0,
    };

    isDoubleTap = (currentTouchTimeStamp: any) => {
        const {prevTouchTimeStamp} = this.prevTouchInfo;
        const dt = currentTouchTimeStamp - prevTouchTimeStamp;
        const {delay = 210, radius = 20} = this.props;

        return dt < delay;
    };

    handlePanResponderGrant = () => {
        const currentTouchTimeStamp = Date.now();

        if (this.isDoubleTap(currentTouchTimeStamp)) {
            this.props.onDoubleClick?.();
        }

        this.prevTouchInfo = {
            prevTouchTimeStamp: currentTouchTimeStamp,
        };

        const {onLongPress, delayLongPress = 300} = this.props;
        this.timeOut = setTimeout(() => {
            onLongPress?.();
        }, delayLongPress);
    };

    handlePanResponseRelease = () => {
        clearTimeout(this.timeOut);
        this.props.onPressOut?.();
    };

    componentWillMount() {
        this.myPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: this.handlePanResponderGrant,
        });
    }

    render() {
        return (
            <View
                style={this.props.customStyle}
                {...this.props}
                // {...this.myPanResponder.panHandlers}
                onTouchStart={this.handlePanResponderGrant}
                onTouchEnd={this.handlePanResponseRelease}>
                {this.props.children}
            </View>
        );
    }
}

export default StyleTouchHaveDouble;

// import React, {Component} from 'react';
// import {
//     PanResponder,
//     StyleProp,
//     View,
//     ViewProps,
//     ViewStyle,
// } from 'react-native';

// interface Props extends ViewProps {
//     delay?: number;
//     radius?: number;
//     onDoubleClick(): any;
//     customStyle?: StyleProp<ViewStyle>;
// }

// class StyleTouchHaveDouble extends Component<Props> {
//     myPanResponder: any = {};

//     prevTouchInfo = {
//         prevTouchX: 0,
//         prevTouchY: 0,
//         prevTouchTimeStamp: 0,
//     };

//     distance = (x0: number, y0: number, x1: number, y1: number) => {
//         return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
//     };

//     isDoubleTap = (currentTouchTimeStamp: any, {x0, y0}: any) => {
//         const {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
//         const dt = currentTouchTimeStamp - prevTouchTimeStamp;
//         const {delay = 210, radius = 20} = this.props;

//         return (
//             dt < delay && this.distance(prevTouchX, prevTouchY, x0, y0) < radius
//         );
//     };

//     handlePanResponderGrant = (evt: any, gestureState: any) => {
//         const currentTouchTimeStamp = Date.now();

//         if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
//             this.props.onDoubleClick();
//         }

//         this.prevTouchInfo = {
//             prevTouchX: gestureState.x0,
//             prevTouchY: gestureState.y0,
//             prevTouchTimeStamp: currentTouchTimeStamp,
//         };
//     };

//     componentWillMount() {
//         this.myPanResponder = PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderGrant: this.handlePanResponderGrant,
//         });
//     }

//     render() {
//         return (
//             <View
//                 style={this.props.customStyle}
//                 {...this.props}
//                 {...this.myPanResponder.panHandlers}>
//                 {this.props.children}
//             </View>
//         );
//     }
// }

// export default StyleTouchHaveDouble;
