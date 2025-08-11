import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, Select } from "@ngxs/store";
import { Observable, Subject, combineLatest } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { ThemeState } from "../../shared/state/theme.state";
import { GetHomePage } from "../../shared/action/theme.action";
import { ThemeOptionService } from "../../shared/services/theme-option.service";
import { GetProducts } from "../../shared/action/product.action";
import { ProductState } from "../../shared/state/product.state";
import { ProductModel } from "../../shared/interface/product.interface";

@Component({
  selector: "app-themes",
  templateUrl: "./themes.component.html",
  styleUrls: ["./themes.component.scss"],
})
export class ThemesComponent implements OnInit, OnDestroy {
  @Select(ThemeState.homePage) homePage$: Observable<string>;
  @Select(ThemeState.activeTheme) activeTheme$: Observable<string>;
  @Select(ProductState.product) product$: Observable<ProductModel>;

  public theme: string;
  public homePage: any;
  public categories: { id: number; name: string }[] = [];
  public selectedCategory: number | null = null;
  public filteredProducts: ProductModel | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private themeOptionService: ThemeOptionService
  ) {}

  ngOnInit(): void {
    document.body.classList.add("home");
    this.loadHomePage();
    this.fetchProductsByCategory("accessories");
    this.selectedCategory = 62;
  }

  ngOnDestroy(): void {
    document.body.classList.remove("home");
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHomePage(): void {
    combineLatest([
      this.route.queryParams.pipe(map((params) => params["theme"])),
      this.activeTheme$,
    ])
      .pipe(
        map(([queryParamTheme, activeTheme]) => queryParamTheme || activeTheme),
        switchMap((themeSetting) => {
          this.themeOptionService.preloader = true;
          this.theme = themeSetting;
          return this.store.dispatch(new GetHomePage(themeSetting));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.homePage = data.theme?.homePage;
        this.categories = data.category?.category?.data || [];
        this.themeOptionService.preloader = false;
      });
  }

  highlightItem = (item: { id: number; slug: string }): void => {
    console.log("Category selected :", item);
    this.selectedCategory = item.id;
    this.fetchProductsByCategory(item.slug);
  };

  private fetchProductsByCategory(category: string): void {
    this.store
      .dispatch(new GetProducts({ category }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.product$.subscribe((product) => {
          console.log("Product data:", product);
          this.filteredProducts = product;
        });
      });
  }
}
