import {apiGetTopGroupBuying} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert} from 'navigation/NavigationService';
import React, {Component, useEffect, useState} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const {width} = Metrics;
const itemWidth = width * 0.43;
export const spaceHeight = width * 0.45;

interface Props {
    showTopGroupBooking: boolean;
}

const ListUnder = () => {
    const theme = Redux.getTheme();

    const [list, setList] = useState<Array<TypeGroupBuying>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiGetTopGroupBuying();
                setList(res.data);
            } catch (err) {
                appAlert(err);
            }
        };
        getData();
    }, []);

    return (
        <View style={styles.underContainer}>
            <StyleText
                i18Text="discovery.topGroupBooking"
                customStyle={[
                    styles.titleGroupBooking,
                    {color: theme.borderColor},
                ]}
            />
            <StyleList
                data={list}
                renderItem={({item}) => (
                    <ItemGroupBuying
                        item={item}
                        setList={setList}
                        containerStyle={styles.itemView}
                        detailGroupTarget={DISCOVERY_ROUTE.detailGroupBuying}
                        syncWidth={itemWidth}
                        isHorizontal={false}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                refreshing={false}
                directionalLockEnabled
            />
            <StyleText
                i18Text="discovery.discovery"
                customStyle={[
                    styles.titleDiscovery,
                    {color: theme.borderColor},
                ]}
            />
        </View>
    );
};

class ListTopGroupBuying extends Component<Props> {
    opacity = new Animated.Value(1);

    state = {
        animateBanner: true,
    };

    setOpacity(value: number) {
        this.opacity.setValue(value);
        if (value === 0) {
            this.setState({
                animateBanner: false,
            });
        } else if (value === 1) {
            this.setState({
                animateBanner: true,
            });
        }
    }

    render() {
        return (
            <>
                <View style={styles.container} />
                {this.props.showTopGroupBooking && <ListUnder />}
            </>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: spaceHeight,
    },
    underContainer: {
        width: '100%',
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    titleGroupBooking: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        left: '10@s',
        marginTop: '10@vs',
        marginBottom: '15@vs',
    },
    titleDiscovery: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        left: '10@s',
        marginTop: '20@vs',
    },
    itemView: {
        marginLeft: width * 0.03,
        marginRight: '10@s',
        marginTop: 0,
    },
});

export default ListTopGroupBuying;
