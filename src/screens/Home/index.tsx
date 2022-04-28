import React from 'react';
import {View} from 'react-native';

import Map from 'components/Map';

const Home = () => {
    return (
        <View>
            <Map showCluster={true} />
        </View>
    );
};

export default Home;
