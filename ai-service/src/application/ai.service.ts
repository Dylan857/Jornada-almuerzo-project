import { AIRepository } from '../infrastructure/repository/ai.repository';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'getIngredientStock',
        description:
          'Returns current stock of all ingredients in the warehouse',
        parameters: {
          type: 'OBJECT',
          properties: {},
          required: [],
        },
      },
      {
        name: 'getTopRecipes',
        description: 'Returns the most ordered recipes with their count',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'NUMBER',
              description: 'How many recipes to return (default 5)',
            },
          },
          required: [],
        },
      },
      {
        name: 'getLowStockIngredients',
        description: 'Returns ingredients with stock below a threshold',
        parameters: {
          type: 'OBJECT',
          properties: {
            threshold: {
              type: 'NUMBER',
              description: 'Stock level to consider low',
            },
          },
          required: [],
        },
      },
      {
        name: 'getOrderHistory',
        description: 'Returns recent orders with their status and quantities',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: { type: 'NUMBER' },
          },
          required: [],
        },
      },
      {
        name: 'getPurchaseHistory',
        description: 'Returns recent market purchases by ingredient',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: { type: 'NUMBER' },
          },
          required: [],
        },
      },
      {
        name: 'getScarcityPrediction',
        description: 'Predicts which ingredients will run out soonest',
        parameters: {
          type: 'OBJECT',
          properties: {},
          required: [],
        },
      },
    ],
  },
];

export class AIService {
  private repository = new AIRepository();
  private genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  private model = this.genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: TOOLS as any,
    systemInstruction: `You are an intelligent assistant for a restaurant management system. 
    You have access to real-time data from the warehouse, orders, and market purchases.
    Answer questions in the same language the user writes in.
    Be concise and practical — the manager needs quick, actionable insights.`,
  });

  async query(question: string): Promise<string> {
    const chat = this.model.startChat();
    let result = await chat.sendMessage(question);

    while (result.response.functionCalls()?.length) {
      const calls = result.response.functionCalls();
      const toolResponses = [];

      for (const call of calls!) {
        const data = await this.executeTool(call.name, call.args);
        toolResponses.push({
          functionResponse: {
            name: call.name,
            response: { content: data },
          },
        });
      }

      result = await chat.sendMessage(toolResponses);
    }
    return result.response.text();
  }

  private async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'getIngredientStock':
        return await this.repository.getIngredientStock();
      case 'getTopRecipes':
        return await this.repository.getTopRecipes(args.limit);
      case 'getLowStockIngredients':
        return await this.repository.getLowStockIngredients(args.threshold);
      case 'getOrderHistory':
        return await this.repository.getOrderHistory(args.limit);
      case 'getPurchaseHistory':
        return await this.repository.getPurchaseHistory(args.limit);
      case 'getScarcityPrediction':
        return await this.repository.getScarcityPrediction();
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
