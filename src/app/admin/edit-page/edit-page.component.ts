import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostsService} from '../../shared/posts.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMap, tap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submitted = false;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => this.postsService.getById(params.id))
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { title, text } = this.post;

    this.subscription.add(
        this.postsService.update({
        ...this.post,
        text,
        title,
      }).pipe(
        tap(() => this.submitted = true)
      ).subscribe(() => {
        this.submitted = false;
        this.alert.success('Пост был обновлен');
      })
    );
  }
}
