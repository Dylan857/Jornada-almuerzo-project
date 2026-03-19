import { AIService } from '../../../application/ai.service';
import { AIQuery } from '../../../domain/entities/ai.entity';
import { CustomException } from '../../../shared/http/custom-exception';
import { readBody } from '../../../shared/http/read-body';
import { withResponse } from '../../../shared/http/with-response';

export class AIController {
  private aiService = new AIService();

  query = withResponse(async (req: any) => {
    const body = await readBody<AIQuery>(req);

    if (!body.question?.trim()) {
      throw new CustomException('question is required', 400);
    }
    return this.aiService.query(body.question);
  });
}
