export interface DeviceInfo {
    id: string,
    type: MediaDeviceKind,
    name: string,
}
export class DeviceManager {
    public enumerateDevices = async () => {

        let devices: MediaDeviceInfo[] = [];
        try {
            devices = await navigator.mediaDevices.enumerateDevices()
        } finally {
            //stream.getTracks().forEach(track => track.stop())
        }

        const mappedDevices = devices
            .map(device => ({
                id: device.deviceId,
                type: device.kind,
                name: device.label,
            }))

        return mappedDevices
    }

    public getMediaStream = async (constraints: MediaStreamConstraints) => {
        try {
            const mediaStream = await this.getUserMedia(constraints)

            return mediaStream;
        } catch (err) {
            console.log("DeviceManager.getMediaStream error", err);
        }
        return undefined;
    }

    private getUserMedia = async (
        constraints: MediaStreamConstraints,
    ): Promise<MediaStream> => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constraints)
        }

        const otherNavigator = navigator as any;
        const _getUserMedia: typeof otherNavigator.getUserMedia =
            otherNavigator.getUserMedia ||
            otherNavigator.webkitGetUserMedia ||
            otherNavigator.mozGetUserMedia ||
            this.getUserMediaFail

        return new Promise<MediaStream>((resolve, reject) => {
            _getUserMedia.call(navigator, constraints, resolve, reject)
        })
    }


    

    private getUserMediaFail = (
        constraints: MediaStreamConstraints,
        resolve: () => void,
        reject: (err: Error) => void,
    ) => {
        reject(new Error(
            'No API to retrieve media stream. This can happen if you ' +
            'are using an old browser, or the application is not using HTTPS'))
    }

}