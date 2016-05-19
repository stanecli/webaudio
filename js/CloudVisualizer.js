(function ($) {

    /**
     * Megjelenít egy forgó ködöt, ami pulzálva tűnik elő hangerősségre. Egy frekvenciához van rendelve.
     * options.freq-t használja fel a hangerősséghez
     */
    WAT.CloudVisualizer = Class.create(WAT.Visualizer, {

        /**
         * @param $super
         * @param options paraméterek. Lásd szülő classok
         */
        initialize: function ($super, options) {
            this.queue = new createjs.LoadQueue();
            this.queue.loadManifest([
                {src: 'img/pad_clouds_smooth.png', id: 'pad_clouds'}
            ]);
            this.queue.on("complete", function () {
                $super(options);

                this.freq = options.freq || 0; //alapértelmezett frekvencia
                this.analyser.smoothingTimeConstant = 0.8;

                this.createClouds();
            }, this);
        },

        /**
         * Körök sugarát állítja be minden update-re
         */
        update: function () {
            this.getFreqData();
            var alpha = (this.getFreq(this.freq) - 0.3) * 3;
            this.cloudLeft.alpha = this.cloudRight.alpha = alpha;
            this.cloudLeft.scaleX = this.cloudRight.scaleX = this.cloudLeft.scaleY = this.cloudRight.scaleY = 0.85 + (this.getFreq(this.freq) - 0.5) * 0.25;
            //this.cloudLeft.x = this.width / 2 - alpha * 10;
            //this.cloudRight.x = this.width / 2 + alpha * 10;
            this.stage.update();
        },

        /**
         * Léltrehozza a köröket. (pontosan annyit, ahány frekvencia létezik a playerben)
         */
        createClouds: function () {
            var cloud = new createjs.Bitmap(this.queue.getResult('pad_clouds'));
            cloud.regX = cloud.regY = cloud.getBounds().width / 2;
            cloud.x = cloud.y = this.width / 2;
            cloud.alpha = 0;
            createjs.Tween.get(cloud, {loop: true}).to({rotation: -360}, 2000);
            this.stage.addChild(cloud);
            this.cloudLeft = cloud;

            cloud = new createjs.Bitmap(this.queue.getResult('pad_clouds'));
            cloud.regX = cloud.regY = cloud.getBounds().width / 2;
            cloud.x = cloud.y = this.width / 2;
            cloud.alpha = 0;
            createjs.Tween.get(cloud, {loop: true}).to({rotation: 360}, 2000);
            this.stage.addChild(cloud);
            this.cloudRight = cloud;

        }
    });

})(jQuery);
