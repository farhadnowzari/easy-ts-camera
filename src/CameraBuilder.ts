import Camera from "./Camera";
import MediaConstraints from "./MediaConstraints";

export default class CameraBuilder {
    public canvas: HTMLCanvasElement;
    public mediaConstraints: MediaConstraints;
    public video: HTMLVideoElement;
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
     * Invoke the camera permission and return the camera
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