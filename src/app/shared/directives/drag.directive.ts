import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  @HostBinding('draggable')
  public draggable = true;
  @HostBinding('class.over')
  public isIn = false;

  //récupérer l’index de l’élément que nous déplaçons avec le drag
  @Input('index')
  public index!: number;

  /*transmettre l’index de l’élément draggé et l’index de l’élément sur lequel 
  il est droppé à notre composant afin d’effectuer l’interversion de ces éléments. */
  @Output()
  public switch: EventEmitter<{ srcIndex: number; dstIndex: number }> =
    new EventEmitter();

  /*définir des données dragguées au cours d'une opération de drag 
  and drop afin de passer l’index entre les éléments de la liste*/
  @HostListener('dragstart', ['$event'])
  public dragStart($event: DragEvent) {
    $event.dataTransfer?.setData('srcIndex', this.index.toString());
  }

  /*émis lorsque la souris passe au-dessus d’un élément 
  alors que l’utilisateur est en train d’effectuer un drag.*/
  @HostListener('dragenter')
  public dragEnter() {
    this.isIn = true;
  }

  /*enlever la classe à l’élément lorsque nous arrêtons de la survoler en drag*/
  @HostListener('dragleave')
  public dragLeave() {
    this.isIn = false;
  }
  @HostListener('dragover', ['$event'])
  public dropOver($event: Event) {
    $event.preventDefault();
  }

  /*ajouter un listener qui nous permettra de savoir
   sur quel élément nous droppons l’élément draggé */
  @HostListener('drop', ['$event'])
  public drop($event: DragEvent) {
    this.isIn = false;
    this.switch.emit({
      srcIndex: Number($event.dataTransfer?.getData('srcIndex')),
      dstIndex: this.index,
    });
  }

  constructor() {}
}