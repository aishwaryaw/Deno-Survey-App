import { Router, RouterContext } from './depts.ts';
import authController from './controllers/AuthController.ts';
export const router = new Router();
import surveyController from './controllers/SurveyController.ts';
import { surveyCollection } from './mongo.ts';
import { authMiddleware } from './Middlewares/AuthMiddleware.ts';
import questionConroller from './controllers/QuestionController.ts';
import  siteController  from './controllers/SiteController.ts';
// router.get("/", (ctx:RouterContext)=>{
//     ctx.response.status = 200;
//     ctx.response.body = "<h1>Hello</h1>";
// });

router
.post("/api/login", authController.login)
.post("/api/register", authController.register)

// site routes
.get("/", siteController.viewSurveys )
.get("/survey/:id", siteController.viewSurvey)
.post("/survey/:id", siteController.submitSurvey)

// survey routes
.get("/api/surveys", authMiddleware , surveyController.getAll.bind(surveyController))
.get("/api/survey/:id", authMiddleware, surveyController.getSingleSurvey.bind(surveyController))
.post("/api/surveys",authMiddleware, surveyController.createSurvey.bind(surveyController))
.put("/api/update/:id", authMiddleware, surveyController.updateSurvey.bind(surveyController))
.delete("/api/deleteSurvey/:id", authMiddleware, surveyController.deleteSurvey.bind(surveyController))

// Question routes
.get("/api/survey/:surveyId/questions", authMiddleware ,  questionConroller.getBySurvey)
.get("/api/question/:id", authMiddleware, questionConroller.getQuestion)
.post("/api/question/:surveyId", authMiddleware, questionConroller.createQuestion)
.put("/api/question/:id", authMiddleware, questionConroller.updateQuestion)
.delete("/api/question/:id", authMiddleware, questionConroller.deleteQuestion);

