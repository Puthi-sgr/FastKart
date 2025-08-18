import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";

@Component({
  selector: "app-slideshow",
  standalone: true,
  templateUrl: "./slideshow.component.html",
  styleUrls: ["./slideshow.component.css"],
})
export class SlideshowComponent implements OnInit, OnDestroy {
  public images: string[] = [
    "https://lkcamera.com/api/public/storage/2/slide1.jpg",
    "https://lkcamera.com/api/public/storage/2/slide2.jpg",
    "https://lkcamera.com/api/public/storage/2/slide3.jpg",
  ];
  public currentIndex = 0;

  private intervalId?: number;
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Initialize the slideshow
    // Set up an interval to change the slide every 3 seconds
    // Only run this in the browser environment not on the server
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = window.setInterval(() => this.next(), 3000);
    }
  }

  ngOnDestroy(): void {
    // Function is called when the component is destroyed
    // Clear the interval to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  public prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
