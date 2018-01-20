$( document ).ready(() => {
    // Creating object that will handle all drawing operations
    let root = new Root();
    root.resizeCanvas();

    // Event listener for window resizing
    $( window ).resize(() => {
        root.resizeCanvas();
    });

    // Event listener for board size change
    $( "#sizePickerSubmit" ).click((e) => {

        e.preventDefault();
        let verticalPix = $("#verticalPix").val();
        let horizontalPix = $("#horizontalPix").val();

        if(verticalPix > 100 || horizontalPix > 100) {
            alert("Grid dimensions can not be higher than 100.");
        } else {
            root.setPixDimension(verticalPix, horizontalPix);
        }
    });

    // Event listener for changing color
    $( "#colorPicker" ).change((e) => {
        root.setColor(e.target.value);
    });

    // Event listener for coloring rectangle on board
    $( "#passiveCanvas" ).click((e) => {
        root.drawPix(e.offsetX, e.offsetY);
    });

    // Event listener for preview coloring rectangle on board
    $( "#passiveCanvas" ).mousemove((e) => {
        root.drawPreviewPix(e.offsetX, e.offsetY);
    });

    // Event listener for downloading Pixel Art as Image
    $( "#getIt" ).click(() => {
        root.downloadImage();
    });

    // Event listener for filling board with selected color
    $( "#colorFill" ).click(() => {
        root.fillWithColor();
    });
});

// ROOT CLASS

class Root {

    constructor() {
        this.activeCanvas = $( "#activeCanvas" )[0];
        this.passiveCanvas = $( "#passiveCanvas" )[0];
        this.previewCanvas = $( "#previewCanvas" )[0];
        this.activeCtx = this.activeCanvas.getContext('2d');
        this.passiveCtx = this.passiveCanvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.verticalPix = 12;
        this.horizontalPix = 12;
        this.activeColor = "#000";
        this.previewColor = "#ddd";

        this.buildEmptyPixGrid();
    }

    /**
     * Method that is responsible for changing board dimentions.
     * @param newVerticalPix number of rectangles vertically
     * @param newHorizontalPix number of rectangles horizontally
     */
    setPixDimension(newVerticalPix, newHorizontalPix) {
        this.verticalPix = parseInt(newVerticalPix);
        this.horizontalPix = parseInt(newHorizontalPix);

        this.buildEmptyPixGrid();
        this.resizeCanvas();
    }

    /**
     * Method that is responsible for calculating values of attributes for DOM elements as well as dimension of single rectangle on canvas.
     */
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

    /**
     * Method that is responsible for changing attributes of DOM elements that represents board.
     */
    setStage() {
        $( "#canvasWrap" ).css({"width":this.horizontalPix * this.div, "height":this.verticalPix * this.div});

        this.activeCanvas.height = this.verticalPix * this.div;
        this.previewCanvas.height =  this.verticalPix * this.div;
        this.passiveCanvas.height = this.verticalPix * this.div;

        this.activeCanvas.width = this.horizontalPix * this.div;
        this.previewCanvas.width = this.horizontalPix * this.div;
        this.passiveCanvas.width = this.horizontalPix * this.div;
    }

    /**
     * Method that is responsible for drawing grid on canvas.
     * @param ctx canvas context
     */
    drawGrid(ctx) {

        for(let i = 0; i <= this.horizontalPix*this.div; i++) {
            this.drawLine(ctx, i*this.div, 0, i*this.div, this.verticalPix*this.div);
        }

        for(let i = 0; i <= this.verticalPix*this.div; i++) {
            this.drawLine(ctx, 0, i*this.div, this.horizontalPix*this.div, i*this.div);
        }
    }

    /**
     * Method that is responsible for drawing single line on canvas.
     * @param ctx canvas context
     * @param x1 x coordinate of first start point
     * @param y1 y coordinate of first start point
     * @param x2 x coordinate of first end point
     * @param y2 y coordinate of first end point
     */
    drawLine(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Method that is responsible for drawing single rectangle on canvas.
     * @param ctx canvas context
     * @param x x coordinate of top left vertex
     * @param y y coordinate of top left vertex
     * @param color color of rectangle
     */
    drawRect(ctx, x, y, color) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.fillRect(x * this.div, y * this.div, this.div, this.div);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Method that is responsible for creating empty 2D array that will hold information about rectangles color.
     */
    buildEmptyPixGrid() {

        this.pixGrid = [];

        for(let i = 0; i < this.horizontalPix; i++) {
            this.pixGrid.push(new Array(this.verticalPix).fill(null));
        }
    }

    /**
     * Method that is responsible for clearing active canvas.
     */
    clearStage() {
        this.activeCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
        this.passiveCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
    }

    /**
     * Method that is responsible for drawing rectangle in selected place on canvas.
     * @param mouseX x coordinate of mouse on canvas
     * @param mouseY y coordinate of mouse on canvas
     */
    drawPix(mouseX, mouseY) {
        let divHorizontal = Math.floor(mouseX/this.div);
        let divVertical = Math.floor(mouseY/this.div);
        this.drawRect(this.activeCtx, divHorizontal, divVertical, this.activeColor);
        this.pixGrid[divHorizontal][divVertical] = this.activeColor;
    }

    drawPreviewPix(mouseX, mouseY) {
        this.previewCtx.clearRect(0,0, this.horizontalPix * this.div, this.verticalPix * this.div);
        let divHorizontal = Math.floor(mouseX/this.div);
        let divVertical = Math.floor(mouseY/this.div);
        this.drawRect(this.previewCtx, divHorizontal, divVertical, this.previewColor);
    }

    /**
     * Method that is responsible for redrawing whole image on canvas, for example after resizing browser window.
     */
    drawPixGrid() {
        for(let i = 0; i < this.horizontalPix; i++) {
            for(let j = 0; j < this.verticalPix; j++) {
                if(this.pixGrid[i][j] !== null) {
                    this.drawRect(this.activeCtx, i, j, this.pixGrid[i][j]);
                }
            }
        }
    }

    /**
     * Method that change color of every rectangle on canvas.
     */
    fillWithColor() {
        for(let i = 0; i < this.horizontalPix; i++) {
            for(let j = 0; j < this.verticalPix; j++) {
                this.pixGrid[i][j] = this.activeColor;
            }
        }
        this.drawPixGrid();
    }

    /**
     * Method that change active color.
     * @param colorHash hash that represents active color
     */
    setColor(colorHash) {
        this.activeColor = colorHash;
    }

    /**
     * Method that is responsible for downloading image with canvas content.
     */
    downloadImage() {
        let link = document.createElement('a');
        link.download = "YourPixelArt.png";
        link.href = this.activeCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }
}
