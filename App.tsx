import React, { useState } from 'react';
import { SafeAreaView, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import TabModel from './ModelView';

const renderScene = SceneMap({
  model: TabModel,
});

export default function App() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([{ key: 'model', title: '3d Model' }]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={false}
      />
    </SafeAreaView>
  );
}
