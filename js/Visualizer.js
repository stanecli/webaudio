(function ($) {

    /**
     * Vizualizációk ősosztálya. Beköt egy audio playert, és létrehoz egy stage-et (canvas-t), ahol a vizualizációk futnak)
     */
    WAT.Visualizer = Class.create({

        /**
         * @param options paraméterek
         * @param {WAT.AudioPlayer} options.player Audio player komponens. Innen veszi a frekvenciatartománybeli adatokat.
         * @param {number} options.division osztás - ennyivel osztjuk le a frequencyBinCount-ot, ha kevesebb kört szeretnénk kapni
         * @param {number} options.width canvas szélesség
         * @param {number} options.height canvas magasság
         * @param {string} options.sound hang id
         * @param {string} options.fft analyser fftSize
         * @param {number} options.freq választott kiemelt frekvenciasáv (bármilyen célra)
         * @param {number} options.clip százalékosan levágja a magas frekvenciákat a spektrumból, mivel általában 10kHz felett már teljesen némák a hangsávok
         * @param {number} options.offset egész számban megadott eltolása a spektrumnak pozitív irányba. így a clip és offsettel együtt meg tudunk adni egy intervallumot, amit vizualizálunk
         */
        initialize: function (options) {
            if (!options.player instanceof WAT.AudioPlayer) {
                console.error('A "player" argumentum típusa WAT.AudioPlayer kell legyen!');
            }

            var analyser = options.player.analysers[options.sound];
            analyser.fftSize = options.fft || analyser.fftSize;
            this.analyser = analyser;

            this.freq = options.freq; //választott kiemelt frekvenciasáv (bármilyen célra)
            this.division = options.division || 1; //osztás
            this.offset = options.offset || 0; //ennyivel toljuk balra a spektrumot
            this.count = Math.floor(this.analyser.frequencyBinCount / this.division * (options.clip || 0.74)); //frekvenciák száma (körök /csíkok száma)
            this.width = options.width || $(window).width();
            this.height = options.height || $(window).height();
            this.createStage(options.width, options.height);

            var self = this;
            createjs.Ticker.on("tick", function () {
                self.update();
            });
        },

        /**
         * Betölti és visszaadja a legutóbbi fft adatokat
         * @returns {Uint8Array|*} frekvencia adatok tömbje
         */
        getFreqData: function () {
            var bufferLength = this.analyser.frequencyBinCount;
            this.freqData = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(this.freqData);
            return this.freqData;
        },

        /**
         * Visszaadja a megadott indexhez tartozó frekvencia amplitúdóját. Az érték 0..1 közötti lesz.
         * Beleszámítja az osztást és az eltolást is.
         * @param index a lekérendő frekvencia indexe a spektrumban
         */
        getFreq: function (index) {
            return this.freqData[index * this.division + this.offset] / 255;
        },

        /**
         * Létrehoz egy megadott méretű canvast. Méretek hiányában teljes képernyős canvast hoz létre.
         */
        createStage: function () {
            var canvas = $('<canvas/>').attr({
                width: this.width,
                height: this.height
            });

            //konténer
            var wrapper = $('<div/>').addClass('visualizer-center');
            wrapper.append(canvas);

            //betesszük a domba
            $('#circle-visualizers').append(wrapper);

            //init stage
            this.stage = new createjs.Stage(canvas[0]);
        },

        /**
         * Minden requestAnimationFrame-ben lefut
         */
        update: function () {
            //gyerekben overrideolni
        }

    })

})(jQuery);