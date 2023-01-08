import CameraBuilder from "./CameraBuilder";

export default class Camera {
    public devices: Array<MediaDeviceInfo>;
    public builder: CameraBuilder;
    public stream: MediaStream;
    public canvasContext: CanvasRenderingContext2D | null = null;
    public cameraStreamListener: (MediaStream) => void | null;
    constructor(cameraBuilder: CameraBuilder) {
        this.devices = new Array<MediaDeviceInfo>();
        this.builder = cameraBuilder;
        this.canvasContext = this.builder.canvas.getContext('2d');
        this.cameraStreamListener = cameraBuilder.cameraStreamListener;
    }

    public getDevicesAsync(): Promise<Array<MediaDeviceInfo>> {
        return new Promise<Array<MediaDeviceInfo>>(async (resolve, reject) => {
            if (this.devices.length > 0) {
                resolve(this.devices);
                return;
            }
            try {
                let devices = await navigator.mediaDevices.enumerateDevices();
                devices.forEach(device => {
                    if (device.kind && device.kind.toLocaleLowerCase() === 'videoinput')
                        this.devices.push(device);
                });
                resolve(this.devices);
            } catch (error) {
                console.error('GetDevices', error);
                reject(error);
            }
        })
    }

    snap(stop: boolean = true, clearRect: boolean = true): HTMLCanvasElement {
        this.builder.canvas.width = this.builder.video.videoWidth;
        this.builder.canvas.height = this.builder.video.videoHeight;
        if (clearRect)
            this.canvasContext.clearRect(0, 0, this.builder.canvas.width, this.builder.canvas.height);
        this.canvasContext.drawImage(this.builder.video, 0, 0, this.builder.canvas.width, this.builder.canvas.height);
        if (stop)
            this.stop();
        return this.builder.canvas;
    }

    snapAsDataUrl(stop: boolean = true, clearRect: boolean = true): string {
        this.snap(stop, clearRect);
        return this.builder.canvas.toDataURL('image/png');
    }

    snapAsBlobAsync(stop: boolean = true, clearRect: boolean = true): Promise<Blob> {
        this.snap(stop, clearRect);
        return new Promise((resolve) => {
            this.builder.canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png', 1);
        })
    }

    public startAsync(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.getDevicesAsync();
                let stream = await navigator.mediaDevices.getUserMedia(this.builder.mediaConstraints);

                this.builder.video.srcObject = stream;
                this.stream = stream;
                this.cameraStreamListener(this.stream);
                resolve();
            } catch (error) {
                console.error('StartAsync', error);
                reject(error);
            }
        });
    }

    public stop() {
        if (!this.builder.video && !this.builder.video.srcObject) return;
        if (this.builder.video.srcObject instanceof MediaStream) {
            let tracks = (this.builder.video.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        } else {
            let tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        this.builder.video.srcObject = null;
    }

    public switchAsync(tryAgain = false): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            this.builder.mediaConstraints.video.switchFacingMode(tryAgain);
            this.stop();
            try {
                await this.startAsync();
                resolve();
            } catch (error) {
                console.error("SwitchAsync", error);
                reject(error);
            }
        })
    }

    public multipleCameras(): boolean {
        return this.devices.length > 1;
    }
}