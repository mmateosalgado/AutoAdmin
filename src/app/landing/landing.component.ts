import { Component } from '@angular/core';
import { HeroSectionComponent } from "./hero-section/hero-section.component";
import { FeaturesSectionComponent } from "./features-section/features-section.component";
import { StatisticsSectionComponent } from "./statistics-section/statistics-section.component";
import { CtaSectionComponent } from "./cta-section/cta-section.component";

@Component({
  selector: 'app-landing',
  imports: [HeroSectionComponent, FeaturesSectionComponent, StatisticsSectionComponent, CtaSectionComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

}
