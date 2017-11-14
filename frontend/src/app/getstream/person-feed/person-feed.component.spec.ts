import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFeedComponent } from './person-feed.component';

describe('PersonFeedComponent', () => {
  let component: PersonFeedComponent;
  let fixture: ComponentFixture<PersonFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
