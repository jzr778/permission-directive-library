# PermissionDirectiveLibrary

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Installation

```bash
npm install permission-directive-library
```

## Setup

Import the module in your app.module.ts:

```typescript
import { PermissionDirectiveLibraryModule } from 'permission-directive-library';
import { UserConfigService } from 'permission-directive-library';

@NgModule({
  imports: [
    // other imports...
    PermissionDirectiveLibraryModule
  ],
  // ...
})
export class AppModule {
  constructor(private userConfigService: UserConfigService) {
    // Configure the user settings
    this.userConfigService.setUserConfig({
      userCode: 'your-user-code',
      systemId: 1,
      webApiUrl: 'http://your-api-url/api',
      // Set global default redirect URL for permission denied
      defaultRedirectUrl: '/your-custom-access-denied'
    });
  }
}
```

## Usage Examples

### Permission Directive

The permission directive can be used to control visibility, disable elements, or make them read-only based on user permissions.

#### Basic Usage:

```html
<!-- Hide element if user doesn't have permission -->
<button [permissionDirective]="{
  visibleConfig: {
    Paths: ['Button/View'],
    matchType: 'AND'
  }
}">View Button</button>

<!-- Disable element if user doesn't have permission -->
<button [permissionDirective]="{
  disabledConfig: {
    Paths: ['Button/Edit'],
    matchType: 'OR'
  }
}">Edit Button</button>

<!-- Make element read-only if user doesn't have permission -->
<input [permissionDirective]="{
  readonlyConfig: {
    Paths: ['Input/Edit']
  }
}" />

<!-- Hide element using display:none if user doesn't have permission -->
<div [permissionDirective]="{
  hiddenConfig: {
    Paths: ['Section/View']
  }
}">Protected content</div>
```

#### Complex Logic:

```html
<!-- Using complex logic expressions -->
<button [permissionDirective]="{
  visibleConfig: {
    Paths: ['Button/View', 'Button/Edit', 'Button/Delete'],
    logic: '(Button/View && Button/Edit) || Button/Delete'
  }
}">Action Button</button>
```

### Route Guard

The library includes a route guard for protecting routes based on permissions.

```typescript
// In your routing module
import { PermissionGuard } from 'permission-directive-library';

const routes: Routes = [
  {
    path: 'protected-page',
    component: ProtectedPageComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: {
        Paths: ['Page/View'],
        matchType: 'AND'
      }
      // Uses global defaultRedirectUrl when permission is denied
    }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: {
        Paths: ['Admin/Access', 'Admin/View'],
        matchType: 'AND'
      },
      // Override global defaultRedirectUrl for this specific route
      redirectUrl: '/admin-access-denied'
    }
  }
];
```

The redirect URL priority is:
1. Route-specific `redirectUrl` in the route data
2. Global `defaultRedirectUrl` from UserConfigService
3. Default fallback '/exception/403/3'

## API Reference

### Directive Config

```typescript
interface DirectiveConfig {
  visibleConfig?: PermissionConfig;  // Controls element visibility (ngIf)
  disabledConfig?: PermissionConfig; // Controls disabled attribute
  hiddenConfig?: PermissionConfig;   // Controls display:none style
  readonlyConfig?: PermissionConfig; // Controls readonly attribute
}

interface PermissionConfig {
  Paths?: string[];                  // Permission paths to check
  CustomParams?: boolean;            // Custom parameter
  matchType?: 'AND' | 'OR';          // How to match multiple paths
  logic?: string;                    // Complex logic expression
}
```

## Code scaffolding

Run `ng generate component component-name --project permission-directive-library` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project permission-directive-library`.
> Note: Don't forget to add `--project permission-directive-library` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build permission-directive-library` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build permission-directive-library`, go to the dist folder `cd dist/permission-directive-library` and run `npm publish`.

## Running unit tests

Run `ng test permission-directive-library` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
