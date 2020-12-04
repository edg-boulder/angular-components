import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-analog-clock',
  templateUrl: './analog-clock.component.html',
  styleUrls: ['./analog-clock.component.css']
})
export class AnalogClockComponent implements OnInit, OnDestroy, AfterViewInit {
  ctx: any;
  radius = 0;
  interval: any;

  @Input() location = '';
  @Input() size: number;
  @Input() offset = 0;
  @Input() timezone = '';
  
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {
    this.canvas.nativeElement.height = this.size;
    this.canvas.nativeElement.width = this.size;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.radius = this.canvas.nativeElement.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius = this.radius * 0.90;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngAfterViewInit() {
    this.interval = setInterval(() => {
      this.drawClock();
    }, 1000);
  }

  drawClock() {
    this.drawFace(this.ctx, this.radius);
    this.drawNumbers(this.ctx, this.radius);
    this.drawTime(this.ctx, this.radius);
  }

  drawFace(ctx: CanvasRenderingContext2D, size: number) {
    let grad: CanvasGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, size * 0.95, 0, 0, size * 1.05);
    grad.addColorStop(0, 'white');
    grad.addColorStop(0.25, 'lightgray');
    grad.addColorStop(1, 'white');
    ctx.strokeStyle = grad;
    ctx.lineWidth = size * 0.1;
    ctx.stroke();
  }

  drawNumbers(ctx: CanvasRenderingContext2D, size: number) {
    let ang = 0;
    let num = 0;
    ctx.fillStyle = 'black';
    ctx.font = size * 0.15 + 'px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    for (num = 1; num < 13; num++) {
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -size * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, size * 0.85);
      ctx.rotate(-ang);
    }
    ctx.font = size * 0.2 + 'px Arial';
    ctx.fillText(this.location, 0, size / 3);
  }

  drawTime(ctx: CanvasRenderingContext2D, size: number) {
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // hour
    hour = hour % 12;
    hour = ( hour * Math.PI / 6 ) + ( minute * Math.PI / ( 6 * 60 ) ) +
      ( second * Math.PI / ( 360 * 60 ) );
    ctx.strokeStyle = 'black';
    this.drawHand(ctx, hour, size * 0.5, size * 0.06);

    // minute
    minute = ( minute * Math.PI / 30 ) + ( second * Math.PI / ( 30 * 60 ) );
    this.drawHand(ctx, minute, size * 0.7, size * 0.06);

    // second
    second = second * Math.PI / 30;
    this.drawHand(ctx, second, size * 0.9, size * 0.02);
  }

  drawHand(ctx: CanvasRenderingContext2D, pos: number, length: number, width: number) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo( 0, 0 );
        ctx.rotate( pos );
        ctx.lineTo( 0, -length );
        ctx.stroke();
        ctx.rotate( -pos );
  }
}
