import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Expense } from '../../store/expense.model';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  standalone: true,
  imports:[CommonModule, ButtonModule]
})
export class ExpenseItemComponent {
  @Input() expense!: Expense;
  @Output() edit = new EventEmitter<Expense>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.expense);
  }

  onDelete() {
    this.delete.emit(this.expense.id);
  }
}
