import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProfilServices} from '../../../services/profil.services';
import {Profil} from '../../../models/profil.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ProfilComponent} from '../profil/profil.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProfilEditComponent implements OnInit {
  public profilForm: FormGroup;
  public value;
  imagePreview: string;
  public imageChanged: boolean;
  public savedImage: string;
  imageReestablisher: Subject<null> = new Subject();

  @Output()
  profileCreated: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(@Inject(MAT_DIALOG_DATA) public profil: Profil,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<ProfilComponent>,
              private formbuilder: FormBuilder,
              private profilService: ProfilServices,
              private Activerouter: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.initiForm(this.profil);
    // this.imagePreview = this.profil.image;
  }
  deleteImage() {
    this.imageChanged = true;
    this.profil.image = '';
  }
  get nom() {
    return this.profilForm.get('nom') as FormArray;
  }
  initiForm(profil: Profil) {
    this.imageChanged = false;
    this.imagePreview = profil.image.length > 1 ? profil.image : null;
    this.savedImage = this.imagePreview;
    this.profilForm = this.formbuilder.group({
      nom: profil.nom,
      age: profil.age,
      prenom: profil.prenom,
      stade: profil.stade,
      sexe: profil.sexe,
      recommandations: profil.recommandations,
      image: profil.image,
      id: profil.id
    });
  }


  editTheProfil() {
    if (this.conform()) {
      const profilToModify: Profil =  (this.profilForm.getRawValue()) as Profil;
      profilToModify.image = this.profil.image;
      this.profileCreated.emit(true);
      this.profilService
        .updateProfil(profilToModify,  this.profilForm.get('image') == null ? null : this.profilForm.get('image').value )
        .subscribe((profil) => {
          if (profil !== undefined) {
            this.profil = profil;
            this.savedImage = profil.image;
            this.initiForm(profil);
          }
        });

      this.dialogRef.close({
        profil : profilToModify,
        image: profilToModify.image});
    }
  }
  cancelEdit() {
    // this.initiForm(this.profil);
    this.dialogRef.close(this.profil);
  }

  conform() {
    return true;
  }
}
