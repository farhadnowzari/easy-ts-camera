# Easy typescript camera
**Version** 1.1.2

This package helps you to add camera support to your web application easily and support front and rear camera out of the box.

```
npm install easy-ts-camera
```
This package is created based on `easy-js-camera` with some improvements and typescript support.

<a href="https://github.com/farhadnowzari/easy-js-camera" target="_blank">easy-js-camera link</a>

# Usage
Add your video and canvas as follow,
```html
<video autoplay playsinline></video>
<canvas></canvas>
```
Import the Camera class as follow,
```typescript
import ETC from 'easy-ts-camera';
```
To be able to access to all Video Inputs you first need to get the permission from the user. <br>
**Note:** On some devices it is not needed to first get the permission but it is better to do that first since on some devices if the permission is not granted it doesn't return all the devices.
```typescript
var video = document.getElementsByTagName('video')[0];
var canvas = document.getElementsByTagName('canvas')[0];
ETC.initWithUserCamera()
    .streamFrom(video)
    .drawInto(canvas)
    .getCameraAsync()
    .then(camera => {
        camera.startAsync()
    })
    .catch(error => {
        // Mostly happens if the user blocks the camera or the media devices are not supported
    });
```
**Note:** In order to make sure that the browser supports MediaDevices you can do as follow.
```typescript
import { CameraUtils } from 'easy-ts-camera';

CameraUtils.isCameraSupported();
```

## Camera object props
* **devices:** Contains an array of available VideoInput devices
* **builder:** An instance of the CameraBuilder class which contains the `HtmlVideoELement` and `HtmlCanvasElement` and also the `MediaConstraints`.
    * **Builder** now has a method to pick `4K` resolution if available by the camera. call `pick4KResolution` before getting the camera.
    * **Builder** also supports the `FullHD` resolution. Please call this method before building camera.

## Methods
* **getDevicesAsync:** Returns a promise which if is successfull will deliver an array of `MediaDeviceInfo` and if not will log an error.
* **snap:** This method will take a picture and will return the canvasElement so you can extract the picture as whatever format you like.
**Note:** by default, this method will `stop` the camera. You can pass the `stop` as boolean to prevent this behavior.
* **snapAsDataUrl:** This method will take a picture and will return it as a dataUrl string.
* **snapAsBlobAsync:** This method will take a picture and will return a promise which on success will deliver a `blob`.
* **startAsync:** This method starts the camera and will return a promise.
* **stop:** This method is responsible for stoping the stream.
* **switchAsync:** This method switches the camera between `front` and `rear`. This method returns a promise. It is better that you disable the switch camera button while it is doing its job because on some phones with `motorized` selfie camera if the user press the button multiple times the camera will hang and will just stickout and no longer works unless he/she restarts the phone. Please **Note** that this method accept a boolean which is called `tryAgain` and it basically tries to access the rear camera. Sometime the rear camera is not accessible and on catch you can do something like below
    ```typescript
    function switchCamera(tryAgain = false) {
        this.camera.switchAsync(tryAgain)
            .catch(() => {
                if(tryAgain) return; // This line prevents loops. Because the tryAgain may also fail
                this.switchCamera(true);
            });
    }
    ```
* **multipleCameras:** This method will check if there are more than one cameras are available. *Useful when you want to show a switchCamera button*