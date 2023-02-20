---
title: Operații CRUD folosind REST API cu Angular
description: Operațiile CRUD exemplificate cu Angular în acest tutorial
slugOverride: CRUD folosind REST API cu Angular
eleventyNavigation:
  key: crud.angular.ro
  parent: nav.blog
date: 2023-01-05
author: bogminic
tags:
  - Tutorials
  - Angular
layout: layouts/post.njk
---

Acest tutorial va oferi o introducere privind lucrul cu API-uri REST și Angular, acoperind conceptele și tehnicile cheie necesare pentru construirea aplicațiilor pentru a creea, citi, modifica și șterge (CREATE, READ, UPDATE și DELETE) date pe un server. Pentru a fi mai precis, vom gestiona o listă de câini pe un server. 🐶🐕🐶🐕

# Instalare Nodejs (Optional)

> Săriți acestă sectiune dacă aveți Nodejs instalat pe calculator. 

Pentru a instala Node.js pe Windows, puteți descărca instalatorul de pe [site-ul Node.js](https://nodejs.org/en/download/) și urmați instrucțiunile pentru a instala ultima versiune de Node.js pe sistemul dvs.

Pentru a instala Node.js pe Linux, puteți utiliza un manager de pachete precum apt-get sau yum. De exemplu, pentru a instala Node.js pe Ubuntu folosind apt-get, puteți rula următoarele comenzi:

```bash
sudo apt-get update
sudo apt-get install nodejs
```

Pentru a instala Node.js pe MacOS, puteți utiliza managerul de pachete Homebrew. În primul rând, va trebui să instalați Homebrew executând următoarea comandă:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

După ce Homebrew este instalat, puteți folosi pentru a instala Node.js executând următoarea comandă:

```bash
brew install node
```

După ce Node.js este instalat, puteți verifica instalarea executând comanda node -v, care ar trebui să afișeze versiunea instalată de Node.js. De asemenea, puteți utiliza comanda npm pentru a gestiona pachetele și dependențele pentru proiectele dumneavoastră Node.js.

## Pornirea server-ului de backend

JSON-server este o librarie bazată pe Node.js pentru crearea rapidă a unui server `mock` care poate fi utilizat în scopuri de testare și dezvoltare. Este conceput să fie ușor de utilizat și configurat și oferă o modalitate simplă de a crea un API REST prin definirea datelor într-un fișier db.json.

Pentru a porni un server folosind [JSON Server](https://github.com/typicode/json-server), va trebui să instalați pachetul JSON-server din `npm`. Puteți face acest lucru rulând următoarea comandă:

```bash
npm install -g json-server
```

Creati un fisier `db.json` avand continutul de mai jos:

```json
{
  "dogs": [
    {
      "id": 1,
      "name": "AFFENPINSCHER",
      "img": "https://images.dog.ceo/breeds/affenpinscher/n02110627_8099.jpg"
    },
    {
      "id": 2,
      "name": "AKITA",
      "img": "https://images.dog.ceo//breeds//akita//An_Akita_Inu_resting.jpg"
    },
    {
      "id": 3,
      "name": "CHIHUAHUA",
      "img": "https://images.dog.ceo/breeds/chihuahua/n02085620_7613.jpg"
    },
    {
      "id": 4,
      "name": "LHASA",
      "img": "https://images.dog.ceo/breeds/lhasa/n02098413_7358.jpg"
    },
    {
      "id": 5,
      "name": "HOUND",
      "img": "https://images.dog.ceo/breeds/hound-afghan/n02088094_2626.jpg"
    }
  ]
}
```

Porniti `JSON Server` folosind comanda de mai jos:

```bash
json-server --watch db.json -p 4000
```

Accesand link-ul [http://localhost:4000/dogs/1](http://localhost:4000/dogs/1), veti vedea:

```json
{ "id": 1, "title": "json-server", "author": "typicode" }
```
## Crearea aplicatiei

Creati proiectul folosind interfata de comanda [Angular CLI](https://cli.angular.io/).

```bash
npm install -g @angular/cli
ng new my-dogs
```

```bash
? Do you want to enforce stricter type checking and stricter bundle budgets in the workspace?
  This setting helps improve maintainability and catch bugs ahead of time.
  For more information, see https://angular.io/strict No
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? CSS
```

```bash
cd my
cd my-dogs
ng serve
```

Accesand link-ul [http://localhost:4200](http://localhost:4200), veti vedea aplicatia noastra folosind Angular.

## Adaugarea librariei Material-UI

[Material-UI](https://material.angular.io/guide/getting-started) este libraria de componente de la Google si putem folosi Angular CLI sa o instalam:

```sh
ng add @angular/material
```

Selectam optiunea "YES" la toate intrebarile in timpul instalarii.

```sh
? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink [ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up global Angular Material typography styles? Yes
? Set up browser animations for Angular Material? Yes
```

Observam ca toate dependentele sale s-au salvat in `package.json`.

## Eliminarea codului inutil

Sa inlaturam din componenta nou creata `app.component.html` tot html-ul.

## Aducerea datelor de la server

Cream o noua interfata in directorul `src/app`:

```bash
ng generate interface dog
```

unde o sa punem modelul listei de catei:

```js
  export interface Dog {
    id?: number;
    name: string;
    img: string;
  }
```

Cream un nou serviciu:

```bash
ng generate service `dogs`
```

cu toate metodele noastre CRUD:

```js
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Dog } from './dog';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  constructor(private http: HttpClient) {
  }

  getDogs() {
    return this.http.get('http://localhost:4000/dogs') as Observable<Dog[]>
  }

  addDog(postObject: Dog) {
    return this.http.post('http://localhost:4000/dogs', postObject) as Observable<Dog>
  }

  updateDog(postObject: Dog) {
    return this.http.put(`http://localhost:4000/dogs/${postObject.id}`, postObject) as Observable<Dog>
  }

  deleteDog(id: number) {
    return this.http.delete(`http://localhost:4000/dogs/${id}`) as Observable<{}>
  }
}
```

In componenta noastra avem nevoie de o variabila care sa stocheze aceasta lista:

```js
  ...
  export class AppComponent implements OnInit {
  dogs: Dog[] = [];
  ...
```

Aducem lista de catei cu ajutorul unui request de tip `GET`:

```js
  getDogs() {
    this.dogsService.getDogs().subscribe((response) => {
      this.dogs = response;
    })
  }
```

Apelam functia creata anterior in momentul in care se initializeaza componenta:

```js
  componentDidMount() {
    this.getDogs()
  }
```

## Afisarea listei de catei

Folosim tabelul dat ca exemplu in [Material-UI](https://material.angular.io/components/table/overview) pentru a afisa lista de catei:

```html
<button mat-raised-button class="addButton">Add</button>
<table mat-table [dataSource]="dogs" class="mat-elevation-z8">

  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <ng-container matColumnDef="img">
    <th mat-header-cell *matHeaderCellDef> Image </th>
    <td mat-cell *matCellDef="let element"> <img class="img" [attr.src]="element.img" [attr.alt]="element.name"> </td>
  </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef> Action </th>
      <td mat-cell *matCellDef="let element"> 
        <button class="editButton" mat-raised-button color="primary">Editare</button>
        <button mat-raised-button color="primary">Stergere</button>
      </td>
    </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

Cream o noua variabila in componenta pentru a stoca numele coloanelor:

```js
  ...
  dogs: Dog[] = [];
  displayedColumns: string[] = ['name', 'img', 'actions']
  ...
```

Pentru fiecare catel afisam numele, imaginea si butoanele de actiuni: *Editeaza* si *Sterge*.

## Stilizarea listei de catei

Pentru a imbunatati designul, adaugam stilurile urmatoare in `app.component.css`:

```css
.img {
  height: 150px;
}

table {
  width: 100%;
}

.addButton {
  margin: 10px;
}

.editButton {
  margin-right: 20px;
}
```

## Stergerea unui element din lista de catei

Stergem un element din lista de catei cu ajutorul unui request de tip `DELETE`:

Adaugati in `app.component.ts` metoda de stergere:
```js
  deleteDog(id: number) {
    this.dogsService.deleteDog(id).subscribe(() => {
      this.getDogs()
    });
  }
```

si in `app.component.html` evenimentul pe buton:

```html
  <button mat-raised-button color="primary" (click)="deleteDog(element.id)">Stergere</button>
```

## Adaugarea si editarea unui element din lista de catei

Inseram butonul de *Adaugare* deasupra tabelului:

```html
  <button mat-raised-button class="addButton" (click)="addDog()">Adaugare</button>
  <table mat-table [dataSource]="dogs" class="mat-elevation-z8">
...
```

Functia care va adauga un nou element va deschide o modala cu un formular nepopulat:

```js
  addDog() {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '650px',
      data: { name: '', img: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDogs();
    });
  }
```

Functia care va edita un element va deschide o modala ce va contine detaliile despre catel:

```js
  editDog(dog: Dog) {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '650px',
      data: { ...dog }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDogs();
    });
  }
```

Cream o noua component *form* in directorul `src/app` care va contine inputurile si logica de salvare:

```bash
ng generate component form
```

```html
<div mat-dialog-content class="container">
  <mat-form-field>
    <input matInput [(ngModel)]="data.name" placeholder="Name">
  </mat-form-field>
  <mat-form-field>
    <input matInput [(ngModel)]="data.img" placeholder="Image url">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="closeModal()">Anulare</button>
  <button mat-button cdkFocusInitial (click)="saveDog()">Save</button>
</div>
```

Salvam un element din lista de catei cu ajutorul metodei saveDog si a request-urilor de tip `POST` si `PUT`:

```js
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dog } from '../dog';
import { DogsService } from '../dogs.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    private dogsService: DogsService,
    @Inject(MAT_DIALOG_DATA) public data: Dog
  ) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  saveDog() {
    if (this.data.id) {
      this.dogsService.updateDog(this.data).subscribe(() => {
        this.dialogRef.close();
      })
    }
    else {
      this.dogsService.addDog(this.data).subscribe(() => {
        this.dialogRef.close();
      })
    }

  }
}
```

Stilizam modala:

```css
.container {
  display: flex;
  flex-direction: column;
}

.container > * {
  width: 100%;
}
```