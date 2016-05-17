(function ($) {

    /**
     * Majdnem ugyanaz, mint a CircleVisualizer, csak itt egyedül a legbelső kör van frekvenciához rendelve, a többi kör
     * belülről kifelé pedig a legbelső kör állapotát követi le, 1 frame-nyi késleltetéssel
     * @type {WAT.PulseVisualizer}
     */
    WAT.PulseVisualizer = Class.create(WAT.CircleVisualizer, {

        /**
         * Beállítja a visualizer méretét
         * @param $super
         * @param options paraméterek. lásd: Szülő classok
         */
        initialize: function ($super, options) {
            $super(options);

            this.freq = options.freq || Math.floor(this.count / 3); //alapértelmezett frekvencia
        },

        /**
         * Körök sugarát állítja be minden update-re
         */
        update: function () {
            this.getFreqData();
            var currentCircle, nextCircle;

            var movement = this.maxMovement * this.getFreq(0);
            currentCircle = this.circles[0];
            currentCircle.movement = movement;
            currentCircle.circleCommand.radius = currentCircle.radius + movement;
            for (var i = this.count - 1; i > 0; i--) {
                currentCircle = this.circles[i];
                nextCircle = this.circles[i - 1];
                currentCircle.circleCommand.radius = currentCircle.radius + this.circles[i - 1].movement;
                currentCircle.movement = this.circles[i - 1].movement;
            }
            this.stage.update();
        }

    });

})(jQuery);
