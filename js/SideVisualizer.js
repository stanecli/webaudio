(function ($) {

    WAT.Sideisualizer = Class.create(WAT.Visualizer, {

        /**
         * @param $super
         * @param options paraméterek. Lásd szülő classok
         */
        initialize: function ($super, options) {
            this.queue = new createjs.LoadQueue();
            this.queue.loadManifest([
                {src: 'img/bass_arc_tp.png', id: 'bass_arc'}
            ]);
            this.queue.on("complete", function () {
                $super(options);

                this.freq = options.freq || 0; //alapértelmezett frekvencia
                this.analyser.smoothingTimeConstant = 0.8;

                this.createArcs();
            }, this);
        },

        /**
         * Körök sugarát állítja be minden update-re
         */
        update: function () {
            this.getFreqData();
            var commonFreq = this.getFreq(this.freq);
            var alpha;
            var arc;
            for (var i = 0, len = this.arcs.length; i < len; i++) {
                arc = this.arcs[i];
                alpha = (this.getFreq(arc.freq) - 0.3) * 3;
                arc.alpha = alpha;
                arc.x = arc.originalPos + arc.dir * arc.reactFactor * commonFreq * 100;
            }
            this.stage.update();
        },

        /**
         * Létrehoz egy arcot
         * @param {String} [dir='left'] 'left' = bal, 'right' = jobb
         * @param {Number} [margin=0] eltartás az előző arctól
         * @param {Number} [offset=0] hány arc-nyival toljuk el (hanyadik arc az oldalon)
         * @param {Number} [reactFactor=1] mennyire reagáljon az amplitúdóra 1 a default
         */
        createArc: function (dir, offset, margin, reactFactor, freqOffset) {
            var dir = dir === 'left' ? -1 : 1;
            var reactFactor = reactFactor || 1;
            var offset = offset || 0;
            var margin = margin || 0;
            var arc = new createjs.Bitmap(this.queue.getResult('bass_arc'));
            var bounds = arc.getBounds();
            arc.regX = bounds.width / 2;
            arc.regY = bounds.height / 2;
            arc.freq = this.freq + freqOffset;
            arc.dir = dir;
            arc.rotation = 90 * (1 + 1 * dir);
            arc.originalPos = this.width / 2 + dir * (200 + margin + bounds.width * offset);
            arc.reactFactor = reactFactor;
            arc.x = arc.originalPos;
            arc.y = this.height / 2;
            arc.alpha = 0;
            this.stage.addChild(arc);
            this.arcs.push(arc);
        },

        /**
         * Léltrehozza az oldalsó arc-okat
         */
        createArcs: function () {
            this.arcs = [];
            this.createArc('left', 0.5, 20, 1, 0);
            this.createArc('left', 1, 10, 2, 2);
            this.createArc('right', 0.5, 20, 1, 0);
            this.createArc('right', 1, 10, 2, 2);
        }
    });

})(jQuery);
