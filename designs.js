$( document ).ready(function() {
    var root = new Root();
    root.resizeCanvas();

    $( window ).resize(function() {
        root.resizeCanvas();
    });

    $( "#sizePickerSubmit" ).click(function(e) {
        e.preventDefault();
        let verticalPix = $("#verticalPix").val();
        let horizontalPix = $("#horizontalPix").val();
        root.setPixDimension(verticalPix, horizontalPix);
    });

});

// ROOT CLASS

class Root {
    constructor() {
        this.activeCanvas = $( "#activeCanvas" )[0];
        this.passiveCanvas = $( "#passiveCanvas" )[0];
        this.activeCtx = this.activeCanvas.getContext('2d');
        this.passiveCtx = this.passiveCanvas.getContext('2d');
        this.verticalPix = 12;
        this.horizontalPix = 12;
    }

    setPixDimension(newVerticalPix, newHorizontalPix) {
        this.verticalPix = newVerticalPix;
        this.horizontalPix = newHorizontalPix;
        this.resizeCanvas();
    }

    setStage() {
        $( "#canvasWrap" ).css({"width":this.horizontalPix * this.div, "height":this.verticalPix * this.div});

        this.activeCanvas.width = this.horizontalPix * this.div;
        this.activeCanvas.height = this.verticalPix * this.div;

        this.passiveCanvas.width = this.horizontalPix * this.div;
        this.passiveCanvas.height = this.verticalPix * this.div;
    }

    resizeCanvas() {
        this.clearStage();

        let maxCanvasWidth = 0.9 * $( "#editor" ).width();
        let maxCanvasHeight = 0.9 * $( "#editor" ).height();


        if (this.verticalPix/this.horizontalPix >= maxCanvasHeight/maxCanvasWidth) {
            this.div = maxCanvasHeight/this.verticalPix;
        } else {
            this.div = maxCanvasWidth/this.horizontalPix;
        }

        this.setStage();
        this.drawGrid(this.passiveCtx);
    }

    clearStage() {
        this.activeCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
        this.passiveCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
    }

    drawLine(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    drawGrid(ctx) {

        for(var i = 0; i <= this.horizontalPix*this.div; i++) {
            this.drawLine(this.passiveCtx, i*this.div, 0, i*this.div, this.verticalPix*this.div);
        }

        for(var i = 0; i <= this.verticalPix*this.div; i++) {
            this.drawLine(this.passiveCtx, 0, i*this.div, this.horizontalPix*this.div, i*this.div);
        }
    }
}



// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()

function makeGrid() {

// Your code goes here!

}
