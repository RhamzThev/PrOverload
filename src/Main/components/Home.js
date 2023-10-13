import React, {useState} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';

import {mainStyles} from '../../../styles';

export default function Home({name, handleFitness, navigation}) {
  return (
    <View style={mainStyles.containerView}>
      <View style={mainStyles.titleView}>
        <Text style={mainStyles.titleText}>Hello, {name}!</Text>
      </View>
      {/* <View style={mainStyles.dataView}>
                <TouchableHighlight
                    style={mainStyles.featureView}
                    activeOpacity={0.5}
                    underlayColor="#DDDDDD"
                    onPress={() => handleFitness(navigation)}>
                    <View>
                        <Text style={mainStyles.featureText}>Fitness</Text>
                    </View>
                </TouchableHighlight>
            </View> */}
    </View>
  );
}
