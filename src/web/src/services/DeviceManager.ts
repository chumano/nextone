export class DeviceManager {
    getDevices = async (constraints: MediaStreamConstraints) => {
        try {
            const mediaStream = await this.getUserMedia(constraints)

            return mediaStream;
        } catch (err) {
            console.error("DeviceManager.getDeveices error", err);
        }
        return undefined;
    }

    getUserMedia = async (
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


    enumerateDevices = async () => {
        let stream: MediaStream
        try {
            stream = await this.getUserMedia({ audio: true, video: true })
        } catch (err) {
            stream = new MediaStream()
        }

        let devices: MediaDeviceInfo[]
        try {
            devices = await navigator.mediaDevices.enumerateDevices()
        } finally {
            stream.getTracks().forEach(track => track.stop())
        }

        const mappedDevices = devices
            .map(device => ({
                id: device.deviceId,
                type: device.kind,
                name: device.label,
            }))

        return mappedDevices
    }

    getUserMediaFail = (
        constraints: MediaStreamConstraints,
        resolve: () => void,
        reject: (err: Error) => void,
    ) => {
        reject(new Error(
            'No API to retrieve media stream. This can happen if you ' +
            'are using an old browser, or the application is not using HTTPS'))
    }

}