(function ($) {

    /**
     * Megjenelít egy körökből álló vizualizációt, ahol minden kör egy-egy frekvenciáho van rendelve. A körök sugara
     * követi a hozzátartozó frekvencia amplitúdóját. Tulajdonképpen a hangsávok leképezése körökre.
     * @type {WAT.CircleVisualizer}
     */
    WAT.CircleVisualizer = Class.create(WAT.Visualizer, {

        /**
         * Beállítja a visualizer méretét
         * @param $super
         * @param options paraméterek. Lásd szülő classok
         * @param options.maxMovement körök mozgásának mértéke px-ben
         */
        initialize: function ($super, options) {
            $super(options);

            this.maxMovement = options.maxMovement || 100; //max ennyivel nő meg az egyes körök sugara, 100% amplitúdó esetén

            this.createCircles();
        },

        /**
         * Extra class-t kap a canvas
         * @param $super
         */
        createStage: function ($super) {
            $super();
            $(this.stage.canvas).addClass('circle');
        },

        /**
         * Körök sugarát állítja be minden update-re
         */
        update: function () {
            this.getFreqData();
            var circle = null;

            for (var i = 0; i < this.count; i++) {
                circle = this.circles[i];
                circle.movement = this.maxMovement * this.getFreq(i);
                circle.circleCommand.radius = circle.radius + circle.movement;
                //shake
                //circle.x = Math.random(1, 100) / 10 * this.maxMovement * freqData[i] / 255;
                //circle.y = Math.random(1, 100) / 10 * this.maxMovement * freqData[i] / 255;
            }
            this.stage.update();
        },

        /**
         * Léltrehozza a köröket. (pontosan annyit, ahány frekvencia létezik a playerben)
         */
        createCircles: function () {
            this.circles = [];

            var container = new createjs.Container();
            container.x = this.width / 2;
            container.y = this.height / 2;
            for (var i = 0; i < this.count; i++) {
                var circle = new createjs.Shape();
                //var color = Math.ceil((1 - (this.count - i) / this.count) * 255);
                //var color = 255;
                var color = Math.ceil((1 - 0.5 * i / this.count) * 100);
                var graphics = new createjs.Graphics()
                    .setStrokeStyle(3)
                    .beginStroke(createjs.Graphics.getHSL(16, 100, color));
                var radius = (this.width - this.maxMovement * 2) / this.count / 2 * i;
                circle.circleCommand = graphics.drawCircle(0, 0, radius).command;
                circle.graphics = graphics;
                circle.radius = radius;
                circle.movement = 0;
                circle.x = 0;
                circle.y = 0;
                circle.regX = 0;
                circle.regY = 0;
                this.circles.push(circle);
                container.addChild(circle);
            }
            this.stage.addChild(container);

        }
    });

})(jQuery);
