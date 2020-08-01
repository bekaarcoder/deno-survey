import { RouterContext } from "../deps.ts";
import Question from "../models/Question.ts";
import Survey from "../models/Survey.ts";

class QuestionController {
  async getAllBySurvey(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    console.log(surveyId);
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Survey does not exist.",
      };
      return;
    }

    const questions = await Question.findBySurvey(surveyId);
    ctx.response.status = 200;
    ctx.response.body = questions;
  }

  async createQuestion(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    const { text, type, required, data } = await ctx.request.body().value;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Survey does not exist.",
      };
      return;
    }

    const question = new Question(surveyId, text, type, required, data);
    const createdQuestion = await question.createQuestion();

    ctx.response.status = 201;
    ctx.response.body = createdQuestion;
  }

  async getQuestion(ctx: RouterContext) {
    const id = ctx.params.id!;

    const question = await Question.findById(id);
    if (!question) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "No question found.",
      };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = question;
  }
}

const questionController = new QuestionController();
export default questionController;
