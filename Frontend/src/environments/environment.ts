// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {snackData} from '../mocks/snack.mock';

export const environment = {
  production: false,
  appName: 'DOVA QUIZ',
  url : 'http://localhost:9428/api',
  maintenanceMessage: 'disponible bientôt ...',
  formFieldsRequired: 'Veuiller remplir tous les champs requis(*)',
  deleteWarning: ' voulez-vous vraiment supprimer (',
  formFieldRequired: 'Veuiller remplir ce champs',
  formSelectRequired: 'Veuillez choisir une valeur',
  snackInformation: {
    informationForAll: {
      duration: snackData.duration,
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.info.class]
    },
    successForAll: {
      duration: snackData.duration,
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.succes.class]
    },
    errorForAll: {
      duration:  snackData.duration,
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.error.class]
    },
    loadingUpdate: {
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.update.class]

    },
    loadingPost: {
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.succes.class]

    },
    loadingDelete: {
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.delete.class]

    },
    loadingGet: {
      horizontalPosition:  snackData.horizontalPosition,
      verticalPosition: snackData.verticalPosition,
      panelClass: [snackData.get.class]

    },
    operation: {
      loading: {
        getAll: {
          quiz: 'Récupération de tous les quizs en cours...',
          question: 'Récupération de les question en cours...',
          answer: 'Récupération de toutes les réponses en cours...',
          profil: 'Récupération de tous les profil en cours'
        },
        get: {
          image: 'Téléchargement de l\'image en cours...',
          quiz: 'Récupération d\'un quiz en cours...',
          question: 'Récupération d\'une question en cours...',
          answer: 'Récupération d\'une réponse en cours...',
          profil: 'Récupération du profil en cours...'
        },
        update: {
          quiz: '⏳ Modification du quiz en cours...',
          question: '⏳ Modification de la question en cours...',
          answer: '⏳Modification de la réponse en cours...',
          profil: 'Modification du profil en cours'
        },
        delete:  {
          quiz: '⏳ Suppression du quiz en cours...',
          question: '⏳ Suppression de la question en cours...',
          answer: '⏳ Suppression de la réponse en cours...',
          profil: '⏳ Suppression du profil en cours...'
        },
        post: {
          quiz: '⏳ Enregistrement du quiz en cours...',
          question: '⏳ Enregistrement de la question en cours...',
          answer: '⏳ Enregistrement de la réponse en cours...',
          profil: '⏳ Enregistrement du profil en cours...'
        }},
      succeeded: {
        getAll: {
          quiz: 'Récupération des quizs terminé!',
          question: 'Récupération des question terminé!',
          answer: 'Récupération des réponses terminé!'
        },
        get: {
          quiz: 'Récupération du quiz éffectuée avec succès!',
          question: 'Récupération de la question éffectuée avec succès!',
          answer: 'Récupération de la réponse éffectuée avec succès!',
          profil: 'Récupération du profil éffectuée avec succès!',
          image: '✅ Image téléchargée avec succès!'
        },
        update: {
          quiz: '✅ Modification du quiz éffectuée avec succès!',
          question: '✅ Modification de la question éffectuée avec succès!',
          answer: '✅ Modification de la réponse éffectuée avec succès!',
          profil: '✅ Modification du profil éffectuée avec succès!'
        },
        delete:  {
          quiz: '✅ Suppression du quiz éffectuée avec succès!',
          question: '✅ Suppression de la question éffectuée avec succès!',
          answer: '✅ Suppression de la réponse éffectuée avec succès!',
          profil: '✅ Suppression du profil éffectuée avec succès!'
        },
        post: {
          quiz: '✅ Enregistrement du quiz éffectué avec succès!',
          question: '✅ Enregistrement de la question éffectuée avec succès!',
          answer: '✅ Enregistrement de la réponse éffectuée avec succès!',
          profil: '✅ Enregistrement du profil éffectué avec succès!'
        }

      }
    }
  },
  runningQuiz: 'DovaQuiz',
  incorrectAge: 'L\'age saisit est incorrect!'


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
