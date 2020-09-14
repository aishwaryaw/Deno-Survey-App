import { Survey } from "../models/Survey.ts";
import { RouterContext} from '../depts.ts';
import {User} from '../models/User.ts';

export class BaseSurveyController {

    static async findSurveyOrFail(surveyId : string, ctx:RouterContext) : Promise<Survey | null>{

        const survey = await Survey.findOne(surveyId);
          // If the survey does not exist return with 404
          if(!survey){
            ctx.response.status = 404;
            ctx.response.body = {
                "message" : "Invalid Survey ID"
            }
            return null;
          }
          
        // to check if survey belongs to logged in user
          const user = ctx.state.user as User;
          const userId = user.id;
          if(survey.userId !== userId){
            ctx.response.status = 403;
            ctx.response.body = {
                "message" : "You don't have permission to view this survey"
            }
            return null;
          }

          return survey;
    }

}