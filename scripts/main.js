//const THREE =window.MINDAR.IMAGE.THREE;
import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { mockWithVideo, mockWithImage } from '../libs/camera-mock.js';
import { GLTFLoader } from 'gltfloader';
import { loadGLTF, loadAudio, loadVideo } from 'loadgltf';
import { createChromaMaterial } from 'createchromamaterial';
import { CSS3DObject } from 'css3dobject';
import { Loader } from '../libs/three.js-r132/build/three.module.js';




document.addEventListener("DOMContentLoaded", () => {

  mockWithImage("./AssemblyParts/Assembly/Assembly1.JPG");

  const start = async () => {
    const mindarThree = new MindARThree({                  
      container: document.body,
      imageTargetSrc: './AssemblyParts/Assembly/targets.mind'

    });


    const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;
 
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const myAnchor = mindarThree.addAnchor(0);

    const obj = new CSS3DObject(document.querySelector('#ar-div'));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    const loader = new GLTFLoader();
    let model = new Object();
    let mixer = new Object();

    loader.load('./AssemblyParts/Assembly/Assembly1.glb', (gltf) => {

      //scene.add( gltf.scene );

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object

      model = gltf.scene;
      model.scale.set(0.15, 0.15, 0.15);
      model.position.set(0.5, -0.1, 0.1);

      // gltf.animations
      mixer = new THREE.AnimationMixer(model);

      //////    For animated GLTF Files    //////    
      // const action = mixer.clipAction(gltf.animations[0]);
      // action.play();

      myAnchor.group.add(model);

    });

    myAnchor.onTargetFound = () => {

      console.log("on target found");

      setTimeout(function () {
        document.querySelectorAll('.container div').forEach(function (div) {
          div.classList.add('visible');
        });
      }, 2000); // Set a delay for demonstration purposes

    }

    myAnchor.onTargetLost = () => {
      console.log("on target lost");

      setTimeout(function () {
        document.querySelectorAll('.container div').forEach(function (div) {
          div.classList.remove('visible');
        });
      }, 2000); // Set a delay for demonstration purposes

    }

    const clock = new THREE.Clock();

    await mindarThree.start();

    var isRotating = false;

    let animatedWithoutRotating = function () {
      renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();
        mixer.update(delta);
        renderer.render(scene, camera);
        cssRenderer.render(cssScene, camera);
        isRotating = false;
      });
    };

    let animationControl = function (par) {
      if (par == "rotate") {
        if (!isRotating) {
          renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            model.rotation.set(model.rotation.x, model.rotation.y - delta, 0);
            mixer.update(delta);
            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            isRotating = true;
          });
        } else if (isRotating) {
          model.rotation.set(model.rotation.x, model.rotation.y, 0);
          animatedWithoutRotating();
        }

      } else if (par == "left") {
        model.rotation.set(model.rotation.x, model.rotation.y - 0.1, 0);
        animatedWithoutRotating();
      } else if (par == "right") {
        model.rotation.set(model.rotation.x, model.rotation.y + 0.1, 0);
        animatedWithoutRotating();
      }
      else if (par == "up") {
        model.rotation.set(model.rotation.x - 0.1, model.rotation.y, 0);
        animatedWithoutRotating();
      }
      else if (par == "down") {
        model.rotation.set(model.rotation.x + 0.1, model.rotation.y, 0);
        animatedWithoutRotating();
      }
    };

    animationControl("rotate");

    document.querySelectorAll(".playButton").forEach(z => {
      z.addEventListener("click", () => {

        var functionPar = z.id.split("-")[1];

        console.log(functionPar);

        animationControl(functionPar);

      })
    });
  };

  start();
});




