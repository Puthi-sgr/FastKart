import { Routes } from "@angular/router";
import { AuthGuard } from "./../../core/guard/auth.guard";

import { Error404Component } from "./../../components/page/error404/error404.component";

export const content: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../../components/themes/themes.module").then(
        (m) => m.ThemesModule,
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("../../components/auth/auth.module").then((m) => m.AuthModule),
    canActivateChild: [AuthGuard],
  },
  {
    path: "account",
    loadChildren: () =>
      import("../../components/account/account.module").then(
        (m) => m.AccountModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    loadChildren: () =>
      import("../../components/shop/shop.module").then((m) => m.ShopModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("../../components/blog/blog.module").then((m) => m.BlogModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("../../components/page/page.module").then((m) => m.PagesModule),
  },
  {
    path: "**",
    pathMatch: "full",
    component: Error404Component,
  },
];
