const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#311B92"
const backColor : string = "#BDBDBD"
const nodes : number = 5
const lines : number = 2
const rFactor : number = 3

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.save()
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }
    static drawVLine(context : CanvasRenderingContext2D, i : number, size : number, scale : number) {
        const sci : number = ScaleUtil.sinify(scale)
        const sf : number = ScaleUtil.divideScale(sci, i, lines)
        context.save()
        DrawingUtil.drawLine(context, 0, 0, size * sf * (1 - 2 * i), -size * sf)
        context.restore()
    }

    static drawVLineToCircle(context : CanvasRenderingContext2D, size : number, scale : number) {
        for (var i = 0; i < lines; i++) {
            DrawingUtil.drawVLine(context, i, size, scale)
        }
        const r : number = size / rFactor
        DrawingUtil.drawCircle(context, 0, 0, (size / rFactor) * scale)
    }

    static drawVTCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / sizeFactor
        context.fillStyle = foreColor
        context.strokeStyle = foreColor
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.lineCap = 'round'
        context.save()
        context.translate(gap * (i + 1), h / 2)
        DrawingUtil.drawVLineToCircle(context, size, scale)
        context.restore()
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
