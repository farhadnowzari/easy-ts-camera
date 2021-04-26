export default class MediaConstraints {
    public video: VideoConstraints;
    public audio: boolean = false;

    public static userCameraConstraints(): MediaConstraints {
        const instance = new MediaConstraints();
        instance.video = new VideoConstraints();
        instance.video.facingMode = 'user';
        return instance;
    }
    public static envCameraConstraints(): MediaConstraints {
        const instance = new MediaConstraints();
        instance.video = new VideoConstraints();
        instance.video.facingMode = 'environment';
        return instance;
    }
}

class VideoConstraints {
    public facingMode: string | object;

    public switchFacingMode(tryAgain = false): void {
        if (this.facingMode === 'user') {
            this.facingMode = 'environment';
        } else if (tryAgain) {
            console.log("SwitschFacingMode: TryAgain");
            this.facingMode = {
                exact: 'environment'
            }
        } else {
            this.facingMode = 'user';
        }
    }
}