import { Directive, TemplateRef, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[delay]'
})
export class DelayDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  tmp!: number;

  @Input() set delay(time: number) {
    //this.viewContainer.clear();
    setTimeout(() => {
      this.viewContainer.createEmbeddedView(this.templateRef);
    this.GetIdx.emit(time);
    }, time)
    this.addNewItem(time)
  }
  @Output() GetIdx = new EventEmitter<number>();
  addNewItem(value: number) {
  }
}