/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/article` | `/(tabs)/cart` | `/(tabs)/favorite` | `/(tabs)/home` | `/(tabs)/inbox` | `/(tabs)/personal` | `/(tabs)/profile` | `/ShippingInfo` | `/_sitemap` | `/add-article` | `/add-new-product` | `/article` | `/article-details` | `/cart` | `/chat` | `/favorite` | `/home` | `/inbox` | `/invoices-history` | `/login` | `/order-tracking` | `/other-Info-user-post` | `/payment-method` | `/personal` | `/product-details` | `/profile` | `/search` | `/success` | `/user-post`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
