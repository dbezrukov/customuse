import React, { useEffect } from 'react';

import { View, Button } from 'react-native';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader, loadAsync } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import { Asset } from 'expo-asset';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Texture,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Camera,
} from 'three';

const hoodieModel = Asset.fromModule(
  require('./assets/model/clothes_configurator.gltf')
);

const textureFabricBrown = Asset.fromModule(
  require('./assets/img/fabric-brown.jpg')
);

const textureFabricBlue = Asset.fromModule(
  require('./assets/img/fabric-blue.jpg')
);

const ModelView = () => {
  let timeout: number;

  const [camera, setCamera] = React.useState<Camera | null>(null);
  const [texture, setTexture] = React.useState<Texture | null>(null);

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(1.3, 1.3, 1.3);
    setCamera(camera);

    const scene = new Scene();

    await hoodieModel.downloadAsync();
    await textureFabricBrown.downloadAsync();
    await textureFabricBlue.downloadAsync();

    const texture = new Texture();
    texture.image = textureFabricBlue;
    texture.needsUpdate = true;
    setTexture(texture);

    new GLTFLoader().load(
      hoodieModel.uri,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.type === 'Mesh') {
            child.material = new MeshBasicMaterial({
              map: texture,
            });
          }
        });
        scene.add(model);
      },
      (xhr) => {},
      (error) => {}
    );

    const render = () => {
      timeout = requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return (
    <>
      <OrbitControlsView style={{ flex: 1 }} camera={camera}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </OrbitControlsView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          padding: 20,
        }}
      >
        <Button
          title="Blue"
          onPress={() => {
            texture.image = textureFabricBlue;
            texture.needsUpdate = true;
          }}
        />
        <Button
          title="Brown"
          onPress={() => {
            texture.image = textureFabricBrown;
            texture.needsUpdate = true;
          }}
        />
      </View>
    </>
  );
};

export default ModelView;
