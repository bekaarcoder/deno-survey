import { RouterContext } from "../deps.ts";
import Survey from "../models/Survey.ts";
import Users from "../models/Users.ts";

class SurveyController {
  async create(ctx: RouterContext) {
    const { name, description } = await ctx.request.body().value;

    const user: Users = ctx.state.user as Users;

    const survey = new Survey(name, description, user.id);
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

    const user = ctx.state.user as Users;
    if (survey.userId !== user.id) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: "You don't have permission to access this survey.",
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

    const user = ctx.state.user as Users;
    if (survey.userId !== user.id) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: "You don't have permission to access this survey.",
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

    const user = ctx.state.user as Users;
    if (survey.userId !== user.id) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: "You don't have permission to access this survey.",
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
    const user: Users = ctx.state.user as Users;
    const surveys = await Survey.findByUser(user.id);
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
