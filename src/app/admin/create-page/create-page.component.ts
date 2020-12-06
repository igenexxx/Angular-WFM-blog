import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private postsService: PostsService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { author, text, title } = this.form.value;

    const post: Post = {
      author,
      date: new Date(),
      text,
      title,
    };

    this.postsService.create(post)
      .subscribe(() => {
        this.form.reset();
        this.alert.success('Пост был создан');
      });
  }

}
