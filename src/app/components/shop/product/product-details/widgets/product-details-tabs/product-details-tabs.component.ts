import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { QuestionAnswersState } from "../../../../../../shared/state/questions-answers.state";
import { ReviewState } from "../../../../../../shared/state/review.state";
import { GetQuestionAnswers } from "../../../../../../shared/action/questions-answers.action";
import { GetReview } from "../../../../../../shared/action/review.action";
import { QnAModel } from "../../../../../../shared/interface/questions-answers.interface";
import { Product } from "../../../../../../shared/interface/product.interface";
import { ReviewModel } from "../../../../../../shared/interface/review.interface";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-product-details-tabs",
  templateUrl: "./product-details-tabs.component.html",
  styleUrls: ["./product-details-tabs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Improves performance
})
export class ProductDetailsTabsComponent {
  @Input() product: Product | null;

  @Select(QuestionAnswersState.questionsAnswers)
  question$: Observable<QnAModel>;
  @Select(ReviewState.review) review$: Observable<ReviewModel>;

  public active = "description";
  public showMore: boolean = false;
  public height: number = 0;
  public width: number = window.innerWidth;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {}

  @ViewChild("description", { static: false }) descriptionElement: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.descriptionElement?.nativeElement) {
        this.height = this.descriptionElement.nativeElement.offsetHeight;
      } else {
        this.height = 0; // Default fallback
      }
      this.width = window.innerWidth;
      this.cdRef.detectChanges();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    let product = changes["product"]?.currentValue;
    if (product) {
      this.store.dispatch(new GetQuestionAnswers({ product_id: product.id }));
      this.store.dispatch(new GetReview({ product_id: product.id }));
    }
  }

  getTrustedHtml(data?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(data!);
  }

  seeMore() {
    this.showMore = !this.showMore;
    this.cdRef.detectChanges();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.width = window.innerWidth;
    this.height = this.descriptionElement?.nativeElement?.offsetHeight || 0;
    this.cdRef.detectChanges();
  }
}
