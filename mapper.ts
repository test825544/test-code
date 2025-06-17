import { Service } from 'typedi';

import { GetCreditMemosMagentoResponse, GetCreditMemosResponse } from './types';

@Service()
export class GetCreditMemosMapperService {
  public mapMagentoResponseToApiResponse(
    magentoResponse: GetCreditMemosMagentoResponse
  ): GetCreditMemosResponse {
    return {
      success: true,
      data: magentoResponse.items.map((item) => ({
        sales_order_increment_id: item.extension_attributes?.order_increment_id ?? '',
        external_order_id: item.extension_attributes?.external_order_id ?? '',
        increment_id: item.increment_id,
        total_refunded: item.grand_total,
        tax_refunded: item.tax_amount,
        transaction_id: item.transaction_id ?? '',
        created_at: item.created_at,
        Items: item.items
          .filter((orderItem) => orderItem.price && orderItem.price > 0)
          .map((orderItem) => ({
            sku: orderItem.sku,
            sap_code: orderItem.sap_code,
            qty_refunded: orderItem.qty,
            row_total_incl_tax: orderItem.row_total_incl_tax,
            tax_amount: orderItem.tax_amount,
          })),
      })),
    };
  }
}
