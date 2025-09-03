import { Service } from 'typedi';
import { validateRequest } from '@avolta-ag/validator-utils';
import { Authorizer } from '@avolta-ag/utils';

import { CommentPathParameters, CommentRequest } from './types';
import { MagentoAuthorizer } from 'commonV3/services/entities/magento-authorizer-class';
import { OrdersIdService } from '../orders-id';
import { CommentMagentoApiService } from './comment-magento-api-service';
import { NotFoundException } from 'functionV3/exceptions';
import { DEFAULT_COMMENT } from './constants';

@Service()
export class OrdersAddCommentMagentoService {
  constructor(
    private ordersIdMagentoService: OrdersIdService,
    private commentMagentoApiService: CommentMagentoApiService
  ) {}

  public async handle(
    authorizer: Authorizer,
    request: CommentRequest,
    pathParameters: CommentPathParameters
  ): Promise<boolean> {
    await validateRequest(authorizer, MagentoAuthorizer);
    const transformedRequest = await validateRequest(request, CommentRequest);
    const transformedPathParameters = await validateRequest(pathParameters, CommentPathParameters);

    const order = await this.ordersIdMagentoService.handle(authorizer, transformedPathParameters);

    const entityId = order?.items?.[0]?.items?.[0]?.entity_id;

    if (!entityId) {
      throw new NotFoundException(`Order with id ${transformedPathParameters.id} was not found`);
    }

    const { status, Status, comment, Comment, ...rest } = transformedRequest.statusHistory;

   
    await this.commentMagentoApiService.addComment(
      authorizer,
      {
        statusHistory: {
          ...rest,
          status: status ?? Status!,
          comment: decodeURIComponent(comment? comment : (Comment? Comment : DEFAULT_COMMENT )),
        },
      },
      entityId,
      pathParameters.store_identifier
    );

    return true;
  }
}
