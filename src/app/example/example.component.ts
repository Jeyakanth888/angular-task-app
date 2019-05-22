import { Component, OnInit } from '@angular/core';
import tableDragger from 'table-dragger'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var el = document.getElementById('table');
    var dragger = tableDragger(el, {
      mode: 'row',
      dragHandler: '.handle',
      onlyBody: true,
      animation: 300
    });
    dragger.on('drop', function (from, to) {
      console.log(from);
      console.log(to);
    });
  }

}
