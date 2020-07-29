import { RouterContext } from "../deps.ts";
import Survey from "../models/Survey.ts";

class SurveyController {
  async create(ctx: RouterContext) {
    const { name, description } = await ctx.request.body().value;
    console.log(name);

    const survey = new Survey(name, description, "1");
    const createdSurvey = await survey.createSurvey();
    console.log(createdSurvey);

    ctx.response.status = 201;
    ctx.response.body = {
      id: survey.id,
      name: survey.name,
      description: survey.description,
      user: survey.userId,
    };
  }

  async update(ctx: RouterContext) {
    const id = ctx.params.id!;
    const survey = await Survey.findById(id);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "No survey found.",
      };
      return;
    }

    const { name, description } = await ctx.request.body().value;
    const updatedSurvey = await survey.updateSurvey({
      name: name,
      description: description,
    });
    ctx.response.status = 201;
    ctx.response.body = {
      id: updatedSurvey.id,
      name: updatedSurvey.name,
      description: updatedSurvey.description,
      user: updatedSurvey.userId,
    };
  }

  async delete(ctx: RouterContext) {
    const id = ctx.params.id!;
    const survey = await Survey.findById(id);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "No survey found.",
      };
      return;
    }

    await survey.deleteSurvey();
    ctx.response.status = 204;
    ctx.response.body = {
      message: "Survey deleted.",
    };
  }

  async getSingle(ctx: RouterContext) {
    const id = ctx.params.id!;
    const survey = await Survey.findById(id);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "No survey found.",
      };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
      id: survey.id,
      name: survey.name,
      description: survey.description,
      user: survey.userId,
    };
  }

  async getAllByUser(ctx: RouterContext) {
    const surveys = await Survey.findByUser("1");
    ctx.response.status = 200;
    ctx.response.body = surveys;
  }

  async getAll(ctx: RouterContext) {
    const surveys = await Survey.findAll();
    ctx.response.status = 200;
    ctx.response.body = surveys;
  }
}

const surveyController = new SurveyController();

export default surveyController;
