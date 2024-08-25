---
title: How to CRUD a REST API with Angular and Material UI
description: Learn CRUD operation with a simple tutorial
slugOverride: How to CRUD a REST API with Angular and Material UI
summary: This tutorial guides you through building an Angular app to manage a list of dogs using a REST API. You'll learn to set up a mock server with JSON-server, create an Angular project, integrate Material-UI, and implement CRUD operations to create, read, update, and delete dog entries.
eleventyNavigation:
  key: crud.angular.material
  parent: nav.tutorials
date: 2024-09-05
author: bogminic
picture: "crud-angular-material.jpg"
alt: Modern home office space with the blog title 'How to CRUD a REST API with Angular and Material UI' shown at the top
tags:
  - Tutorials
  - Angular
layout: layouts/post.njk
---

This tutorial will provide an introduction to working with REST APIs and Angular, and will cover the key concepts and techniques needed to build web applications that can `CREATE`, `READ`, `UPDATE`, and `DELETE` data on a server. To be more precise, we will be managing a list of dogs on a server. 🐶🐕🐶🐕



## Install Nodejs (Optional)

> Do this if you don't have Nodejs installed on your local machine. 

To install Node.js on Windows, you can download the installer from the [Node.js website](https://nodejs.org/en/download/) and follow the prompts to install the latest version of Node.js on your system.

To install Node.js on Linux, you can use a package manager such as apt-get or yum. For example, to install Node.js on Ubuntu using apt-get, you can run the following commands:

```bash
sudo apt-get update
sudo apt-get install nodejs
```

To install Node.js on MacOS, you can use the Homebrew package manager. First, you will need to install Homebrew by running the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Once Homebrew is installed, you can use it to install Node.js by running the following command:

```bash
brew install node
```

Once Node.js is installed, you can verify the installation by running the node -v command, which should print the installed version of Node.js. You can also use the npm command to manage packages and dependencies for your Node.js projects.

## Start and configure mock server

JSON-server is a Node.js based tool for quickly creating a mock server that can be used for testing and development purposes. It is designed to be easy to use and set up, and provides a simple way to create a fake REST API by defining the data in a db.json file.

To start a mock server using JSON-server, you will need to install the JSON-server package from npm. You can do this by running the following command:

```bash
npm install -g json-server
```
Once you have installed the JSON-server package, you can create a new file called db.json in the directory where you want to run your mock server. This file will be used to store the data for your mock server.

Next, you can populate the db.json file with some sample data. This can be any JSON data that you want to use for your mock server. For example:

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
Once you have your db.json file set up, you can start the mock server by running the following command:

```bash
json-server --watch db.json -p 4000
```

This will start the mock server on port 4000. You can access the server by visiting http://localhost:4000 in your web browser. The server will automatically reload when you make changes to the db.json file, so you can easily update the data on your mock server as needed.

Visiting the link [http://localhost:4000/dogs/1](http://localhost:4000/dogs/1), you should see:

```json
{ "id": 1, "title": "json-server", "author": "typicode" }
```

## Angular create new project

To create a new Angular project, you will need to have the Angular CLI installed on your system. You can install the [Angular CLI](https://angular.io/cli) by running the following command:


```bash
npm install -g @angular/cli
```

Once the Angular CLI is installed, you can create a new Angular project by running the following command:

```bash
ng new my-dogs
```

```bash
? Do you want to enforce stricter type checking and stricter bundle budgets in the workspace?
  This setting helps improve maintainability and catch bugs ahead of time.
  For more information, see https://angular.io/strict No
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? CSS
```

This will create a new directory called `my-dogs` containing the scaffolding for a new Angular project. You can then navigate to the `my-dogs` directory and run the `ng serve` command to start the development server and begin working on your project.

```bash
cd my-dogs
ng serve
```
Visiting the link [http://localhost:4200](http://localhost:4000), you should see the new Angular application.


## Add Material-UI

To add Material to an Angular project using schematics, you can use the `ng add` command. This command will add the Material package to your project and also update your project with the required configuration for Material:

```bash
ng add @angular/material
```

This command will install the latest version of Material and all of its dependencies, and will also update your Angular project with the required configuration for Material.

After running this command, you should be able to use Material components in your Angular project by importing them from the @angular/material module.

For more detailed instructions on how to add Angular Material to your project, you can refer to the [Angular Material documentation](https://material.angular.io/guide/getting-started#install-angular-material).

## Removing unnecessary code

Let's remove all unnecessary HTML from the newly created `app.component.html` component.

## Get the dogs list from server.

To get a list of dogs from a server in Angular using a service, you can create a service that makes an HTTP GET request to the server to retrieve the list of dogs. You can then inject this service into any component that needs to access the list of dogs, and use the service to make the HTTP request.

First thing you need to do is generate the dog's by creating new class:

```bash
ng generate interface dog
```

unde o sa punem modelul listei de catei:

```js
  export class Dog {
    id?: number;
    name: string = '';
    img: string = '';
  }
```

To create a service in Angular, you would first need to generate a new service using the Angular CLI. You can do this by running the following command:

```bash
ng generate service `dogs`
```

Here's an example of how you might create a CRUD service:

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

In the above example, we create a service called `DogsService` using Angular CLI. 
We then import the `HttpClient` module and inject it into the service. 
We can then use the `HttpClient` to make HTTP requests to a backend API.
We then  added methods to handle the CRUD operations (i.e. addDog(), getDogs() updateDog(), deleteDog()) as needed.


In our component, we need a variable to store this list:

```js
  ...
  export class AppComponent implements OnInit {
  dogs: Dog[] = [];
  ...
```

We fetch the list of dogs using a `GET` request:

```js
  getDogs() {
    this.dogsService.getDogs().subscribe((response) => {
      this.dogs = response;
    })
  }
```

We call the previously created function when the component is initialized:

```js
  componentDidMount() {
    this.getDogs()
  }
```

## Displaying the list of dogs

We use the [Material-UI](https://material.angular.io/components/table/overview) table as an example to display the list of dogs:

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

We create a new variable in the component to store the column names:

```js
  ...
  dogs: Dog[] = [];
  displayedColumns: string[] = ['name', 'img', 'actions']
  ...
```

For each dog, we display the name, image, and action buttons: `Edit` and `Delete`.

## Styling the list of dogs

To improve the design, we add the following styles in `app.component.css`:

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

## Deleting an element from the list of dogs

We delete an element from the list of dogs using a `DELETE` request:

Add the delete method to `app.component.ts`:
```js
  deleteDog(id: number) {
    this.dogsService.deleteDog(id).subscribe(() => {
      this.getDogs()
    });
  }
```

and in `app.component.html`, add the button event:

```html
  <button mat-raised-button color="primary" (click)="deleteDog(element.id)">Stergere</button>
```

## Adding and editing an element from the list of dogs

We insert the Add button above the table:

```html
  <button mat-raised-button class="addButton" (click)="addDog()">Adaugare</button>
  <table mat-table [dataSource]="dogs" class="mat-elevation-z8">
...
```

The method that adds a new element will open a modal with an empty form:

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

The method that edits an element will open a modal that contains details about the dog:

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

We create a new form component in the `src/app` directory that will contain the inputs and save logic:

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

We save a dog using the saveDog method and `POST` and `PUT` requests:

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

Finally, we style the modal:

```css
.container {
  display: flex;
  flex-direction: column;
}

.container > * {
  width: 100%;
}
```