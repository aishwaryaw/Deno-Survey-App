import { RouterContext } from '../depts.ts';
import { Question } from '../models/Question.ts';
import { Survey } from '../models/Survey.ts';
import { BaseSurveyController } from './BaseSurveyController.ts';


export class QuestionController{
    async getBySurvey(ctx:RouterContext){
        const surveyId = ctx.params.surveyId;
        if(surveyId){
        const survey = await BaseSurveyController.findSurveyOrFail(surveyId, ctx);
        if(survey){
        const questions = await Question.getQuestionsBySurvey(surveyId);
        ctx.response.status = 200;
        ctx.response.body = questions;
        }
    }

}

    async getQuestion(ctx:RouterContext){
        const questionId = ctx.params.id;
        if(questionId){
        const question  : Question | null = await Question.getSingleQuestion(questionId);
        if(!question){
        ctx.response.status = 404;
        ctx.response.body = {"message": "No question found"};
        return;
        }
        ctx.response.status = 200;
        ctx.response.body = question;

        }
    }

    async createQuestion(ctx:RouterContext){
        const surveyId = ctx.params.surveyId!;
        if(surveyId){
        const survey = await BaseSurveyController.findSurveyOrFail(surveyId, ctx);
        if(!survey){
            return;
        }

        const result = await ctx.request.body();
        if(result.type == "json"){
            const { text, type, required, data } = await result.value;     
            const question = new Question(survey.id, text, type, required, data);
            await question.createQuestion();
            ctx.response.status = 201;
            ctx.response.body = question;   
        }
       
    }
}
    // async updateQuestionStaticOne(ctx:RouterContext){
    //     const questionId = ctx.params.id!;
    //     if(questionId){
    //     const question : Question | null = await Question.getSingleQuestion(questionId);
    //     if(!question){
    //         ctx.response.status = 404;
    //         ctx.response.body = { message: "Invalid Question ID" };
    //         return;
    //     }

    //     const result = await ctx.request.body();
    //     if(result.type == "json"){
    //         const { text, type, required, data } = await result.value;
    //         const questionu =  await Question.updateQuestion( questionId, question.surveyId, text, type, required, data);
    //         // await question.updateQuestion(text, type, required, data);
    //         ctx.response.body = questionu;   
    //     }
       
    // }

    async updateQuestion(ctx:RouterContext){
        const questionId = ctx.params.id!;
        if(questionId){
        const question : Question | null = await Question.getSingleQuestion(questionId);
        if(!question){
            ctx.response.status = 404;
            ctx.response.body = { message: "Invalid Question ID" };
            return;
        }

        const result = await ctx.request.body();
        if(result.type == "json"){
            const { text, type, required, data } = await result.value;
            await question.updateQuestion( text, type, required, data);
            // await question.updateQuestion(text, type, required, data);
            ctx.response.body = question;   
        }
       
    }
}
    async deleteQuestion(ctx:RouterContext){
        const questionId = ctx.params.id!;
        if(questionId){
        const question : Question | null = await Question.getSingleQuestion(questionId);
        if(!question){
            ctx.response.status = 404;
            ctx.response.body = { message: "Invalid Question ID" };
            return;
        }

        await Question.deleteQuestion(questionId);
        ctx.response.status = 204;
        ctx.response.body = { "message" : "question deleted"};

    }
}

}




export default new QuestionController();