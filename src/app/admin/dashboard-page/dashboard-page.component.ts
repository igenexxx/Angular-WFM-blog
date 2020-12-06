import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {Post} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts = [];
  searchPost = '';
  subscriptions = new Subscription();

  constructor(
    private postsService: PostsService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.postsService.getAll().subscribe(posts => this.posts = posts)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  remove($event: MouseEvent, id: string) {
    $event.preventDefault();
    this.subscriptions.add(
      this.postsService.remove(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.alert.warning('Пост был удален!');
      })
    );
  }
}
