import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  private excludedUrls: string[] = ['/api/login', '/api/signup'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request URL is in the excluded URLs list
    const isExcludedUrl = this.excludedUrls.some((url) =>
      req.url.includes(url)
    );

    if (isExcludedUrl) {
      // If the URL is excluded, pass the request without modifying it
      return next.handle(req);
    }

    const token = this.authService.getAuthToken();

    if (token) {
      // Clone the request and add the new header.
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      // Pass the cloned request instead of the original request to the next handle.
      return next.handle(cloned);
    } else {
      // Pass the original request if there is no token.
      return next.handle(req);
    }
  }
}
