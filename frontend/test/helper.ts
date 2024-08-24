import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * @description
 * This class helps to conduct template tests, since it provides an easier access to the dom tree.
 */
export class Helper {
  static getNthElement<T extends HTMLElement>(
    fixture: ComponentFixture<any>,
    selector: string,
    nth: number,
  ): T | null {
    if (nth < 1) return null;

    const elements = fixture.debugElement.queryAll(By.css(selector));

    if (elements.length < nth) return null;

    return elements[nth - 1].nativeElement as T;
  }

  static getFirstElement<T extends HTMLElement>(
    fixture: ComponentFixture<any>,
    selector: string,
  ): T | null {
    const element = fixture.debugElement.query(By.css(selector));

    if (!element) return null;

    return element.nativeElement as T;
  }
}
