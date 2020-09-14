import { RouterContext, Router } from '../depts.ts';
import { User } from '../models/User.ts';
import { Survey } from '../models/Survey.ts';
import { BaseSurveyController } from './BaseSurveyController.ts';

export class SurveyController extends BaseSurveyController {

    async getAll(ctx:RouterContext){
        const user = ctx.state.user as User;
        const id = user.id;
        const surveys =  await Survey.findByUser(id);
        ctx.response.status = 200;
        ctx.response.body = surveys;
        }

    async getSingleSurvey(ctx:RouterContext){
        const result  = await ctx.params.id;
        if(result){
            const id : string = result; 
            const survey = await SurveyController.findSurveyOrFail(id, ctx);
            if(survey){
                ctx.response.body = survey;
            }
        }
    }

    async createSurvey(ctx:RouterContext){
        const result = await ctx.request.body();
        if(result.type == "json"){
            const {name, description} = await result.value;
        const user = ctx.state.user as User;
        const survey = new Survey(user.id, name, description);
        console.log(user.id);
        await survey.create();
        ctx.response.status = 201;
        ctx.response.body = survey;
        }
    }

    async updateSurvey(ctx : RouterContext){
        const result = await ctx.request.body();
        if(result.type == "json"){
            const {name, description} = await result.value;
            const params  = await ctx.params.id;
            if(params){
                const id : string = params; 
                const survey = await SurveyController.findSurveyOrFail(id, ctx);
                if(survey){
                    await survey.update({name, description});
                    ctx.response.body = survey;
                }
            }
        }
    }

    async deleteSurvey(ctx:RouterContext){
        const result  = await ctx.params.id;
        if(result){
            const id : string = result; 
            const survey = await SurveyController.findSurveyOrFail(id, ctx);
            if(survey){
                await survey.delete();
                ctx.response.body = 204;
            }
        }
    }
}

export default new SurveyController();