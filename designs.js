$( document ).ready(function() {
    let root = new Root();
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

    $( "#colorPicker" ).change((e) => {
        root.setColor(e.target.value);
    });

    $( "#passiveCanvas" ).click((e) => {
        root.drawPix(e.offsetX, e.offsetY);
    });

    $( "#getIt" ).click(function() {
        root.downloadImage();
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
        this.activeColor = "#000000";

        this.buildEmptyPixGrid();
    }

    setPixDimension(newVerticalPix, newHorizontalPix) {
        this.verticalPix = parseInt(newVerticalPix);
        this.horizontalPix = parseInt(newHorizontalPix);

        this.buildEmptyPixGrid();
        this.resizeCanvas();
    }

    setStage() {
        $( "#canvasWrap" ).css({"width":this.horizontalPix * this.div, "height":this.verticalPix * this.div});

        this.activeCanvas.width = this.horizontalPix * this.div;
        this.activeCanvas.height = this.verticalPix * this.div;

        this.passiveCanvas.width = this.horizontalPix * this.div;
        this.passiveCanvas.height = this.verticalPix * this.div;
    }

    setColor(colorHash) {
        this.activeColor = colorHash;
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
        this.drawPixGrid();
    }

    clearStage() {
        this.activeCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
        this.passiveCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
    }

    buildEmptyPixGrid() {

        this.pixGrid = [];

        for(let i = 0; i < this.horizontalPix; i++) {
            this.pixGrid.push(new Array(this.verticalPix).fill(null));
        }
    }

    drawLine(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    drawRect(ctx, x, y, color) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.fillRect(x * this.div, y * this.div, this.div, this.div);
        ctx.stroke();
        ctx.restore();
    }

    drawPix(mouseX, mouseY) {
        let divHorizontal = Math.floor(mouseX/this.div);
        let divVertical = Math.floor(mouseY/this.div);
        this.drawRect(this.activeCtx, divHorizontal, divVertical, this.activeColor);
        this.pixGrid[divHorizontal][divVertical] = this.activeColor;
    }

    drawPixGrid() {
        for(let i = 0; i < this.horizontalPix; i++) {
            for(let j = 0; j < this.verticalPix; j++) {
                if(this.pixGrid[i][j] !== null) {
                    this.drawRect(this.activeCtx, i, j, this.pixGrid[i][j]);
                }
            }
        }
    }

    drawGrid(ctx) {

        for(let i = 0; i <= this.horizontalPix*this.div; i++) {
            this.drawLine(this.passiveCtx, i*this.div, 0, i*this.div, this.verticalPix*this.div);
        }

        for(let i = 0; i <= this.verticalPix*this.div; i++) {
            this.drawLine(this.passiveCtx, 0, i*this.div, this.horizontalPix*this.div, i*this.div);
        }
    }

    fillWithColor() {

    }

    downloadImage() {
        let link = document.createElement('a');
        link.download = "YourPixelArt.png";
        link.href = this.activeCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
        link.click();
    }
}
