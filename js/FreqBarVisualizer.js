(function ($) {

    /**
     * Megjelnít egy Winamp stílusú hangsávokat a hozzá kötött audio player alapján. Annyi hangsáv lesz, amennnyi
     * frekvencia be van állítva a playerben. Ezeket mindig kihúzza a beállított vizualizáció szélességére (canvas szélességére).
     * @type {WAT.FreqBarVisualizer}
     */
    WAT.FreqBarVisualizer = Class.create(WAT.Visualizer, {

        /**
         * Létrehozzuk a freq csíkokat
         * @param $super
         * @param player
         */
        initialize: function ($super, options) {
            $super(options);

            this.createBars();
        },

        /**
         * Csíkok méretének beállítása freq adat alapján
         */
        update: function () {
            this.getFreqData();
            var bar = null;
            for (var i = 0; i < this.count; i++) {
                bar = this.bars[i];
                bar.scaleY = this.getFreq(i);
            }
            this.stage.update();
        },

        /**
         * Létrehoz analyser.frequencyBinCount számú frekvencia csíkot
         */
        createBars: function () {
            this.bars = [];

            var barHeight = 200;
            var barWidth = this.width / this.count;
            var bar = null;
            var color;
            for (var i = 0; i < this.count; i++) {
                color = i === this.freq ? '#2882FF' : '#fff';
                bar = new createjs.Shape();
                bar.graphics.beginFill(color).drawRect(0, 0, barWidth, barHeight);
                bar.x = barWidth * i;
                bar.y = barHeight;
                bar.regY = barHeight;
                this.bars.push(bar);
                this.stage.addChild(bar);
            }

        }
    });

})(jQuery);