const {Evolution} = require('../../models')

const { Router } = require('express')

const fs = require('fs')

const { Quiz } = require('../../models')


const router = new Router()

const QuestionsRouter = require('./questions')


const quizMulter = require('../../../middleware/quiz-multer-config')

function getQuestionsImage(req) {
  const questionsImage = []
  for (let i = 0; i < req.files.length; i++) {
    if (req.files[i].originalname.indexOf('question') === 0)questionsImage.push(req.files[i])
  }
  return questionsImage
}


function createQuiz(obj, req) {
  const { questions } = obj
  delete obj.questions
  delete obj.id
  obj.dateCreation = new Date()
  obj.dateModification = obj.dateCreation
  const quiz = Quiz.create({ ...obj })
  const questionsImage = getQuestionsImage(req)
  for (let i = 0; i < questions.length; i++) {
    let questionImage
    for (let j = 0; j < questionsImage.length; j++) {
      let coord = questionsImage[j].originalname.split(' ')[0]
      coord = coord.split('_')
      if (+coord[1] === i) {
        questionImage = questionsImage[j]
        break
      }
    }
    delete questions[i].id
    questions[i].quizId = quiz.id
    questions[i] = QuestionsRouter.createQuestion(questionImage
      ? {
        ...questions[i],
        image: `${req.protocol}://${req.get('host')}/images/question/${questionImage.filename}`,
      }
      : { ...questions[i] }, req, i)
  }
  quiz.questions = questions
  return quiz
}
function getQuizByPatientId(id) {
  const quiz = []
  for (let i = 0; i <Quiz.items.length; i++) {
    if (Quiz.items[i].idPatient === parseInt(id, 10) || Quiz.items[i].idPatient ===0) { quiz.push(Quiz.items[i]) }
  }
  deleteDuplication(quiz);
  return quiz
}

function get()
{

    const quiz = []
    for (let i = 0; i <Quiz.items.length; i++) {
      if (Quiz.items[i].idPatient === 0 || Quiz.items[i].idPatient ===0) { quiz.push(Quiz.items[i]) }
    }
    deleteDuplication(quiz);
    return quiz

}
function deleteDuplication(quiz)
{
  for(let i=0; i<quiz.length;i++)
  {
    for(let j=0; j<quiz.length;j++)
    {

      if(quiz[i].label===quiz[j].label && quiz[i].idPatient!==quiz[j].idPatient)
      {
        if(quiz[i].idPatient===0)
        {
         const index = quiz.indexOf(quiz[i]);
          quiz.splice(index, 1);
        }
        else
        {
          const index= quiz.indexOf(quiz[j]);
          quiz.splice(index, 1);
        }

      }

    }
  }

}

function getAQuiz(id) {
  const quiz = Quiz.getById(id)
  const questions = QuestionsRouter.getQuestionsByQuizId(id)
  quiz.questions = questions != null ? questions : []
  return quiz
}
router.get('/:id', (req, res) => {
  try {
    res.status(200).json(getAQuiz(req.params.id))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/', (req, res) => {
  try {
    const quizzes = get().sort((a, b) => new Date(b.dateModification) - new Date(a.dateModification))
    for (let i = 0; i < quizzes.length; i++) { quizzes[i].questions = QuestionsRouter.getQuestionsByQuizId(quizzes[i].id) }

    res.status(200).json(quizzes)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.get('/patient/:idPatient', (req, res) => {
  try {
    const quizzes = getQuizByPatientId(req.params.idPatient).sort((a, b) => new Date(b.dateModification) - new Date(a.dateModification))
    for (let i = 0; i < quizzes.length; i++) { quizzes[i].questions = QuestionsRouter.getQuestionsByQuizId(quizzes[i].id) }

    res.status(200).json(quizzes)
  } catch (err) {
    res.status(500).json(err)
  }
})


function hasQuizImage(req) {
  return req.files[0] && req.files[0].originalname.indexOf('quiz') === 0
}
router.post('/', quizMulter, (req, res) => {
  try {
    res.status(201).json(createQuiz(hasQuizImage(req) ? {
      ...JSON.parse(req.body.quiz),
      image: `${req.protocol}://${req.get('host')}/images/quiz/${req.files[0].filename}`,
    } : {
      ...JSON.parse(req.body.quiz),
      image: ' ',
    }, req))
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})

function deleteEntireQuiz(id) {
  Quiz.delete(id)
  const questions = QuestionsRouter.getQuestionsByQuizId(id)
  for (let i = 0; i < questions.length; i++) {
    const tmp = questions[i]
    const filename = (tmp.image!=null)? tmp.image.split('/images/question/')[1]:''
    if (filename != null && filename.length > 1) {
      fs.unlink(`images/question/${filename}`, () => {
        QuestionsRouter.deleteEntireQuestion(questions[i].id)
      })
    } else {
      QuestionsRouter.deleteEntireQuestion(questions[i].id)
    }
  }
}


router.delete('/:id', (req, res) => {
  try {
    const tmp = Quiz.getById(req.params.id)
    const filename = tmp.image.split('/images/quiz/')[1]
    if (filename != null && filename.length > 1) {
      fs.unlink(`images/quiz/${filename}`, () => {
        deleteEntireQuiz(req.params.id)
      })
    } else {
      deleteEntireQuiz(req.params.id)
    }
    res.status(201).json(`${tmp.name}(id= ${tmp.id}) is deleted`)
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})
function updateQuiz(id, obj, req) {
  const { questions } = obj
  delete obj.questions
  delete obj.id
  delete obj.dateCreation
  obj.dateModification = new Date()
  const quiz = Quiz.update(id, obj)
  const questionsImage = getQuestionsImage(req)
  for (let i = 0; i < questions.length; i++) {
    let questionImage
    for (let j = 0; j < questionsImage.length; j++) {
      let coord = questionsImage[j].originalname.split(' ')[0]
      coord = coord.split('_')
      if (+coord[1] === i) {
        questionImage = questionsImage[j]
        break
      }
    }
    questions[i].quizId = quiz.id
    // s'il la question n'existait pas(dans le frontend toute nouvelle question est crée avec l'id 0)
    if (questions[i].id === 0) {
      delete questions[i].id
      questions[i] = QuestionsRouter.createQuestion(questionImage
        ? {
          ...questions[i],
          image: `${req.protocol}://${req.get('host')}/images/question/${questionImage.filename}`,
        }
        : { ...questions[i] }, req, i)
    } else { // si la question existait déja
      const { id } = questions[i]
      questions[i] = QuestionsRouter.updateQuestion(id, questionImage
        ? {
          ...questions[i],
          image: `${req.protocol}://${req.get('host')}/images/question/${questionImage.filename}`,
        }
        : { ...questions[i] }, req, i)
    }
  }

  quiz.questions = questions
  return quiz
}

router.put('/:id', quizMulter, (req, res) => {
  try {
    const predName = JSON.parse(req.body.quiz)['label'];
    updateQuiz(req.params.id, hasQuizImage(req) ? {
      ...JSON.parse(req.body.quiz),
      image: `${req.protocol}://${req.get('host')}/images/quiz/${req.files[0].filename}`,
    } : {
      ...JSON.parse(req.body.quiz),
    }, req);
    const quizUpdated = getAQuiz(req.params.id);
    if(!predName.localeCompare(quizUpdated.label))
    Evolution.get().filter(evolutionConcerned=>evolutionConcerned.quizId === quizUpdated.id).forEach(
        evolutionToModify=>{
          evolutionToModify.quizNom = quizUpdated.label;
          Evolution.update(evolutionToModify.id,evolutionToModify);
        }
    );
    res.status(201).json(quizUpdated)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})

router.use('/:id/question', QuestionsRouter.router)
module.exports = router
