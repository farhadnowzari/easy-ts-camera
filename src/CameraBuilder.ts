import Camera from "./Camera";
import MediaConstraints from "./MediaConstraints";
import Statics from "./Statics";

export default class CameraBuilder {
    public canvas: HTMLCanvasElement;
    public mediaConstraints: MediaConstraints;
    public video: HTMLVideoElement;
    
    public get isIOS(): boolean {
        return window.navigator.userAgent.indexOf("Mac") !== -1;
    }

    public cameraStreamListener: (MediaStream) => void | null = null;

    public constructor(mediaConstraints: MediaConstraints) {
        this.mediaConstraints = mediaConstraints;
    }
    /**
     * If the front camera is available it will try to start with the front camera
     */
    public static initWithUserCamera(): CameraBuilder {
        const instance = new CameraBuilder(MediaConstraints.userCameraConstraints());
        return instance;
    }
    /**
     * If the environment camera is available it will try to start with env camera
     */
    public static initWithBackCamera(): CameraBuilder {
        const instance = new CameraBuilder(MediaConstraints.envCameraConstraints());
        return instance;
    }


    /**
     * By passing this the function will be called every time the stream changes for any reason.
     */
    public withCameraStreamListener(cameraStreamListener: (MediaStream) => void): CameraBuilder {
        this.cameraStreamListener = cameraStreamListener;
        return this;
    }

    /**
     * It will try to stream the UltraHD resolution from the camera.
     */
    public pick4KResolution(): CameraBuilder {
        if(this.mediaConstraints.video.aspectRatio > 1 || !this.isIOS) {
            this.mediaConstraints.video.width = {
                ideal: 3840,
                max: 4096,
                min: 1280
            };
            this.mediaConstraints.video.height = {
                ideal: 2140,
                max: 2160,
                min: 720
            };
        } else {
            this.mediaConstraints.video.width = {
                ideal: 2140,
                max: 2160,
                min: 720
            };
            this.mediaConstraints.video.height = {
                ideal: 3840,
                max: 4096,
                min: 1280
            };
        }
        return this;
    }

    /**
     * It will try to stream the FullHD resolution from the camera.
     */
    public pickFullHDResolution(): CameraBuilder {
        if(this.mediaConstraints.video.aspectRatio > 1 || !this.isIOS) {
            this.mediaConstraints.video.width = {
                ideal: 1920,
                max: 1920,
                min: 1280
            };
            this.mediaConstraints.video.height = {
                ideal: 1080,
                max: 1080,
                min: 720
            };
        } else {
            this.mediaConstraints.video.width = {
                ideal: 1080,
                max: 1080,
                min: 720
            };
            this.mediaConstraints.video.height = {
                ideal: 1920,
                max: 1920,
                min: 1280
            };
        }
        return this;
    }

    public clearCachedStream(): CameraBuilder {
        Statics.stream = null;
        return this;
    }

    /**
     * 
     * @param video The HtmlVideoElement which streams the camera
     * @returns {CameraBuilder}
     */
    public streamFrom(video: HTMLVideoElement): CameraBuilder {
        this.video = video;
        return this;
    }
    /**
     * 
     * @param canvas The HtmlCanvasElement which the Camera object will draw the snapped picture on.
     * @returns 
     */
    public drawInto(canvas: HTMLCanvasElement): CameraBuilder {
        this.canvas = canvas;
        return this;
    }

    /**
     * Invoke the camera permission and return a Camera object
     */
    public getCameraAsync(): Promise<Camera> {
        return new Promise<Camera>(async (resolve, reject) => {
            try {
                await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
                resolve(new Camera(this));
            } catch (error) {
                console.error('GetCameraAsync', error);
                reject(error);
            }
        });
    }
}