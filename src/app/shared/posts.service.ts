import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FbCreateResponse, Post} from './interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => ({
          ...post,
          id: response.name,
          date: new Date(post.date),
        })),
      );
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`).pipe(
      map(response => {
        return Object.entries(response).map(([key, value]: [string, Post]) => {
          return {
            ...value,
            id: key,
            date: new Date(value.date)
          };
        });
      })
    );
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => ({
          ...post,
          date: new Date(post.date),
        })),
      );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  update(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
  }
}
