import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../core/header/header.component';
import { StatsCardsComponent } from '../core/stats-cards/stats-cards.component';
import { FiltersBarComponent } from '../core/filters-bar/filters-bar.component';
import { CarListComponent } from '../dashboard/car-list/car-list.component';
import { AddCarModalComponent } from '../modal/add-car-modal/add-car-modal.component';
import { CommonModule } from '@angular/common';
import { EditCarModalComponent } from '../modal/edit-car-modal/edit-car-modal.component';
import { LogoutButtonComponent } from '../core/logout-button/logout-button.component';
import { StatusCarModal } from '../modal/status-car-modal/status-car-modal';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, StatsCardsComponent, FiltersBarComponent, CarListComponent, AddCarModalComponent, CommonModule, EditCarModalComponent, LogoutButtonComponent, StatusCarModal],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  carToEdit: Car | undefined;
  showAddCarModal = false;
  showEditCarModal = false;
  showStatusCarModal = false;
  countData: CountData | null = null;

  openAddCarModal() {
    this.showAddCarModal = true;
  }

  openEditCarModal(Car: Car) {
    this.showEditCarModal = true;
    this.carToEdit = Car;
  }

  openStatusCarModal(Car: Car) {
    this.showStatusCarModal = true;
    this.carToEdit = Car;
  }

  closeAddCarModal() {
    this.showAddCarModal = false;
  }

  closeEditCarModal() {
    this.showEditCarModal = false;
  }

  closeStatusCarModal() {
    this.showStatusCarModal = false;
  }
}
