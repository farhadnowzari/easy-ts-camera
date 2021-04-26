export default class CameraUtils {
    public static isCameraSupported(): boolean {
        return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    }
    
}