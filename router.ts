import { Router, RouterContext } from "./deps.ts";
import authController from "./controllers/AuthController.ts";
import surveyController from "./controllers/SurveyController.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";

const router = new Router();

router
  .get("/", (ctx: RouterContext) => {
    ctx.response.body = "Hello Deno!";
  })
  .post("/api/login", authController.login)
  .post("/api/register", authController.register)
  .get("/api/survey", authMiddleware, surveyController.getAllByUser)
  .get("/api/survey/:id", authMiddleware, surveyController.getSingle)
  .post("/api/survey", authMiddleware, surveyController.create)
  .put("/api/survey/:id", authMiddleware, surveyController.update)
  .delete("/api/survey/:id", authMiddleware, surveyController.delete)
  .get("/api/surveys", surveyController.getAll);

export default router;
