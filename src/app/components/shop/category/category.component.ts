import { Component } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Route,
  Router,
} from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { Breadcrumb } from "../../../shared/interface/breadcrumb";
import { ProductModel } from "../../../shared/interface/product.interface";
import { ProductState } from "../../../shared/state/product.state";
import { GetProducts } from "../../../shared/action/product.action";
import { CategoryState } from "../../../shared/state/category.state";
import { Category } from "../../../shared/interface/category.interface";
import { SeoService } from "../../../shared/services/seo.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
})
export class CategoryComponent {
  @Select(ProductState.product) product$: Observable<ProductModel>;
  @Select(CategoryState.selectedCategory) category$: Observable<Category>;

  public breadcrumb: Breadcrumb = {
    title: "Category",
    items: [{ label: "", active: false }],
  };
  public layout: string = "collection_category_slider";
  public skeleton: boolean = true;
  public category: Category;
  public filter: Params = {
    page: 1, // Current page number
    paginate: 40, // Display per page,
    status: 1,
    field: "created_at",
    price: "",
    category: "",
    tag: "",
    sort: "asc", // ASC, DSC
    sortBy: "asc",
    rating: "",
    attribute: "",
  };

  public totalItems: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private seoService: SeoService,
  ) {
    this.category$.subscribe((category) => {
      this.category = category;
      this.breadcrumb.title = `Category: ${this.category?.name}`;
      this.breadcrumb.items[0].label = this.category?.name;
    });
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.route.queryParams.subscribe((params) => {
          this.filter = {
            page: params["page"] ? params["page"] : 1,
            paginate: 40,
            status: 1,
            price: params["price"] ? params["price"] : "",
            brand: params["brand"] ? params["brand"] : "",
            category: this.route.snapshot.paramMap.get("slug")
              ? this.route.snapshot.paramMap.get("slug")
              : "",
            tag: params["tag"] ? params["tag"] : "",
            field: params["field"] ? params["field"] : this.filter["field"],
            sortBy: params["sortBy"] ? params["sortBy"] : this.filter["sortBy"],
            rating: params["rating"] ? params["rating"] : "",
            attribute: params["attribute"] ? params["attribute"] : "",
          };
          this.store.dispatch(new GetProducts(this.filter));
        });
      }
    });
  }
}
