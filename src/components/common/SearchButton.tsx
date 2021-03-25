import useRedux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {Animated, TextInput, TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface SearchButtonProps {
    customStyle?: object;
    keyWordSearch?: string;
    setKeyWordSearch?: any;
    placeholder?: string;
}

const SearchButton = (props: SearchButtonProps) => {
    const {customStyle, keyWordSearch, setKeyWordSearch, placeholder} = props;
    const theme = useRedux().getTheme();

    const searchIcon = (
        <Feather name="search" size={30} color={theme.textColor} />
    );
    const deleteIcon = <Feather name="x" size={30} color={theme.textColor} />;
    /**
     * HANDLING EFFECT
     */
    const opacitySearch = useRef(
        new Animated.Value(theme.opacityValue),
    ).current;
    const [isSearching, setIsSearching] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);
    const focusInput = useRef<any>(null);

    const aim = useRef(new Animated.Value(0)).current;
    aim.addListener(({value}) => setInputWidth(value));

    // type: 'focus' || 'blur'
    const changeOpacity = (type: string) => {
        if (type === 'focus') {
            opacitySearch.setValue(1);
        }
        if (type === 'blur') {
            const x = setTimeout(() => {
                Animated.timing(opacitySearch, {
                    toValue: theme.opacityValue,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => clearTimeout(x));
            }, 3000);
        }
    };

    const stretchInput = () => {
        if (isSearching && !!keyWordSearch) {
            setKeyWordSearch('');
        } else {
            Animated.timing(aim, {
                toValue: isSearching ? 0 : 200,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                if (!isSearching) {
                    focusInput.current.focus();
                } else {
                    focusInput.current.blur();
                }
                setIsSearching(!isSearching);
            });
        }
    };
    /**
     * -------------------------
     */

    return (
        <Animated.View
            style={[
                styles.buttonSearch,
                {
                    backgroundColor: theme.backgroundButtonColor,
                    opacity: opacitySearch,
                },
                customStyle,
            ]}>
            {/* TEXT_INPUT PART */}
            <Animated.View
                style={[styles.textInputAnimatedView, {width: inputWidth}]}>
                <TextInput
                    ref={focusInput}
                    value={keyWordSearch}
                    style={[styles.textInput, {color: theme.textColor}]}
                    returnKeyType="search"
                    placeholder={placeholder}
                    placeholderTextColor={theme.borderColor}
                    onChangeText={value => setKeyWordSearch(value)}
                    onFocus={() => changeOpacity('focus')}
                    onBlur={() => changeOpacity('blur')}
                />
            </Animated.View>

            {/* BUTTON SEARCH OR CLEAR */}
            <Animated.View style={styles.searchOrClearBox}>
                <TouchableOpacity
                    style={styles.buttonSearchOrClear}
                    onPress={stretchInput}>
                    {!isSearching ? searchIcon : deleteIcon}
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    buttonSearch: {
        flexDirection: 'row',
        borderRadius: '30@vs',
    },
    textInputAnimatedView: {
        height: '40@vs',
    },
    textInput: {
        flex: 1,
        fontSize: '17@ms',
        paddingLeft: '15@s',
    },
    searchOrClearBox: {
        width: '40@vs',
        height: '40@vs',
        borderRadius: '30@vs',
    },
    buttonSearchOrClear: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchButton;
