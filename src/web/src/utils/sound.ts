class Sound {
    private __snd = new Audio('/assets/sound/call-ring.mp3');
    private _sound = {
        isFirst: true,
    };

    private _play = () => {
        this.__snd.currentTime = 0
        var promise = this.__snd.play();
        if (promise !== undefined) {
            promise
                .then((_) => {
                    // Autoplay started!
                })
                .catch((error) => {
                    // Autoplay was prevented.
                    // Show a "Play" button so that user can start playback.
                    //snd.play();
                });
        }
    }

    play =()=> {
        if (this._sound.isFirst) {
            setTimeout( () =>{
                this._play();
            }, 1000);
        } else {
            this._play();
        }
        this._sound.isFirst = false;
    }

    stop = ()=>{
        this.__snd.pause();
    }
}

export default new Sound();