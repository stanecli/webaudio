(function ($) {

    /**
     * Kör alakban jeleníti meg a hangsávokat
     * @type {WAT.CircleBarVisualizer}
     */
    WAT.CircleBarVisualizer = Class.create(WAT.FreqBarVisualizer, {

        /**
         * Létrehoz analyser.frequencyBinCount számú frekvencia csíkot egy pont körül
         */
        createBars: function () {
            this.bars = [];

            var barHeight = 200;
            var r = 100; //eltartás kör sugara
            var barWidth = 2 * r * Math.PI / this.count * 0.7;
            var bar = null;
            var color;
            var container = new createjs.Container();
            container.x = this.width / 2;
            container.y = this.height / 2;

            for (var i = 0; i < this.count; i++) {
                color = i === this.freq ? '#2882FF' : createjs.Graphics.getRGB(255, 255, 255, 0.5);
                bar = new createjs.Shape();
                bar.graphics.beginFill(color).drawRect(0, 0, barWidth, barHeight);
                bar.regY = barHeight;
                bar.regX = barWidth / 2;
                bar.rotation = 360 / this.count * i; //deg
                bar.x = r * Math.sin(bar.rotation * Math.PI / 180);
                bar.y = -r * Math.cos(bar.rotation * Math.PI / 180);
                this.bars.push(bar);
                container.addChild(bar);
            }
            this.stage.addChild(container);

        }
    });

})(jQuery);