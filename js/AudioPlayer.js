/**
 * Hangok lejátszására szolgáló class
 */
WAT.AudioPlayer = Class.create({

    /**
     * Inicializálja a webaudio-t, betölti a hangokat.
     * @param manifest JSON fájl, amiben a loadQueue számára értelmezhető manifest van.
     */
    initialize: function (manifest) {
        //context beállítása
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
        this.audioCtx = createjs.Sound.activePlugin.audioCtx;
        this.sounds = {};
        this.analysers = {};

        //hangok betöltése
        this.loadSounds(manifest);
    },

    /**
     * Ha minden fájl betöltődött..
     */
    onLoadComplete: function () {
        //lejátszás
        console.info('Files loaded!');
        this.play('fx');
    },

    /**
     * Minden hangfájlhoz rendelünk egy analyser-t
     * @param id hang id
     */
    createAnalyser: function (id) {
        var analyser = this.audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.minDecibels = -65;
        analyser.maxDecibels = -20;
        analyser.smoothingTimeConstant = 0.86;

        this.analysers[id] = analyser;
    },

    /**
     * létrehoz egy analyser node-ot és a kimeneti lánc végére köti
     * @param id hang id
     */
    connectToAnalyser: function (id) {
        this.sounds[id].sourceNode.connect(this.analysers[id]);
    },

    /**
     * Átköti a dynamicsCompressorNode-ot a megadott node-ba. (lánc végére fűzi)
     * @param node
     */
    reRouteDynamicsNode: function (node) {
        var dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
        dynamicsNode.disconnect();  // disconnect from destination
        dynamicsNode.connect(node);
    },

    /**
     * Beköt egy filtert a láncba.
     * @param {string} type filter típusa (lowpass | highpass, stb.)
     */
    addFilter: function (type) {
        // Create the filter
        this.filter = this.audioCtx.createBiquadFilter();

        // Create and specify parameters for filter.
        this.filter.type = type; // Low-pass filter. See BiquadFilterNode docs
        this.filter.frequency.value = 400; // Set cutoff to 440 HZ

        //újrakötés
        this.reRouteDynamicsNode(this.filter);
    },

    /**
     * Lejátszik egy hangot.
     * @param {string} id hangfájl azonosító, amit a preload-ban megadtunk
     */
    play: function (id, offset) {
        this.stop(id);
        this.sounds[id] = createjs.Sound.play(id, {offset: offset * 1000 || 0});
        this.connectToAnalyser(id);
    },

    /**
     * Loopolva lejátszik egy hangot.
     * @param {string} id hangfájl azonosító, amit a preload-ban megadtunk
     */
    loop: function (id) {
        this.stop(id);
        this.sounds[id] = createjs.Sound.play(id, {loop: -1});
        this.connectToAnalyser(id);
    },

    /**
     * Megállítja a lejátszott hangot. Ha nincs megadva paraméter, az összes hangot leállítja
     * @param id hang id-ja
     */
    stop: function (id) {
        if (id === undefined) {
            for (var sound in this.sounds) {
                if (this.sounds.hasOwnProperty(sound)) {
                    sound.stop();
                }
            }
        } else {
            if (this.sounds[id]) {
                this.sounds[id].stop();
            }
        }
    },

    /**
     * Betölti a manifestben megadott hangokat. A manifest egy JSON fájl, aminek egy property-je van: "manifest".
     * A property tartalma megegyezik a loadqueue-nek átadható manifest objektummal.
     * @param manifest
     */
    loadSounds: function (manifest) {
        for (var i = 0, len = manifest.length; i < len; i++) {
            this.createAnalyser(manifest[i].id);
        }
        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadManifest(manifest);
        var self = this;
        queue.on("complete", function () {
            self.onLoadComplete();
        }, this);
    }
});