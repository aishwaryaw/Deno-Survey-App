import { RouterContext } from '../depts.ts';
import { Survey } from "../models/Survey.ts";
import { renderFilepath } from '../helpers.ts';
import { Question, QuestionType } from '../models/Question.ts';
import { answersCollection} from '../mongo.ts';

export class SiteController {
    
    async viewSurveys(ctx:RouterContext){
        const surveys = await Survey.findAll();
        ctx.response.body = await renderFilepath("surveys",
        {
            surveys : surveys,
        });

    }

    async viewSurvey(ctx:RouterContext){
        const result = ctx.params.id;
        if(result){
        const id : string = result;
        const survey = await Survey.findOne(id);
        if(!survey){
            ctx.response.body = await renderFilepath("notfound");
            return;
        }
        const questions = await Question.getQuestionsBySurvey(survey.id);
        ctx.response.body = await renderFilepath("survey", {
            survey,
            questions,
            answers : {},
            errors : {}
        });
        }
    }

    async submitSurvey(ctx:RouterContext){
        const id : string = await ctx.params.id!;
        const survey = await Survey.findOne(id);
        if(!survey){
            ctx.response.body = await renderFilepath("notfound");
            return;
        }
        const questions : Question[] = await Question.getQuestionsBySurvey(id);
        const result = await ctx.request.body();
        if(result.type == "undefined"){
            ctx.response.body = await renderFilepath("survey",
            {
                survey,
                questions,
                errors :{},
                answers : {}
            });
        }
        if(result.type == "form"){
           const formData = await result.value;
           
            let errors : any = {};
            let answers : any = {};
            for( const question of questions){
                let value : string | string[] | null = formData.get(question.id);
                // console.log(value);
                if(question.isChoice() && question.data.multiple){
                    value = formData.getAll(question.id);
                }
                console.log(value);

                if(question.required){
                    if(!value || question.isChoice() && question.data.multiple && !value.length){
                        errors[question.id] = "This field is required";
                    }
                    console.log(errors);
                }

                answers[question.id] = value;
            }

            if(Object.keys(errors).length > 0 ){
                console.log(errors);
                ctx.response.body = await renderFilepath("survey",{
                    survey,
                    questions,
                    errors,
                    answers
                });
                return;
            }
           const {$oid} = await answersCollection.insertOne({
               surveyId : id,
               date : new Date(),
               answers,
               userAgent : ctx.request.headers.get("User-Agent")
           });

           ctx.response.body = await renderFilepath("surveyFinish", 
           {
               answerId : $oid
           });
        }     
            
    }

    
}

export default new SiteController();