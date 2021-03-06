const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Quiz', {
  id: Joi.number(),
  theme: Joi.string().required(),
  subTheme: Joi.string().allow(null),
  label: Joi.string().required(),
  difficulty: Joi.string(),
  dateCreation: Joi.date(),
  dateModification: Joi.date(),
  questions: Joi.array(),
  image: Joi.string().allow(''),
  idPatient:Joi.number().allow(null),
})
