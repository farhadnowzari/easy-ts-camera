import ETC from 'easy-ts-camera';

var video = document.getElementsByTagName('video')[0];
var canvas = document.getElementsByTagName('canvas')[0];

ETC.initWithBackCamera()
    .streamFrom(video)
    .drawInto(canvas)
    .pickFullHDResolution()
    .getCameraAsync()
    .then(async camera => {
        await camera.startAsync();
        window.camera = camera;
    })
    .catch(error => {
        // Mostly happens if the user blocks the camera or the media devices are not supported
    });